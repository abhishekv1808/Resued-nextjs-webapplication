'use server';

import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { revalidatePath } from 'next/cache';
import Product from '@/models/Product';

/**
 * Normalize an Indian phone number to a consistent +91XXXXXXXXXX format.
 * Handles inputs like: 6360354678, 916360354678, +916360354678, 0916360354678, 06360354678
 */
function normalizePhone(raw: string): string {
    // Strip all non-digit characters (spaces, dashes, parens, plus sign)
    const digits = raw.replace(/\D/g, '');

    if (digits.length === 10) {
        // Plain 10-digit number → prepend +91
        return `+91${digits}`;
    }

    if (digits.length === 12 && digits.startsWith('91')) {
        // 916360354678 → +916360354678
        return `+${digits}`;
    }

    if (digits.length === 11 && digits.startsWith('0')) {
        // 06360354678 → +91 + last 10
        return `+91${digits.slice(1)}`;
    }

    if (digits.length === 13 && digits.startsWith('091')) {
        // 0916360354678 → +91 + last 10
        return `+91${digits.slice(3)}`;
    }

    // If it already had a '+' and 12 digits (e.g. +91...), digits will be 12
    // For any other format, return with + prefix if it looks like a country-coded number
    if (digits.length > 10) {
        return `+${digits}`;
    }

    // Return as-is if too short or unrecognizable (will fail validation below)
    return raw.trim();
}

/**
 * Validate profile input fields server-side.
 */
function validateProfileInput(fields: {
    name: string;
    location: string;
    email?: string;
    phone?: string;
    address?: string;
}): string | null {
    // Name: 2-100 chars, no special injection chars
    if (!fields.name || fields.name.trim().length < 2) {
        return 'Name must be at least 2 characters long.';
    }
    if (fields.name.trim().length > 100) {
        return 'Name must be less than 100 characters.';
    }

    // Location: 2-200 chars
    if (!fields.location || fields.location.trim().length < 2) {
        return 'Location must be at least 2 characters long.';
    }
    if (fields.location.trim().length > 200) {
        return 'Location must be less than 200 characters.';
    }

    // Email: basic format check (optional field)
    if (fields.email && fields.email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fields.email.trim())) {
            return 'Please enter a valid email address.';
        }
        if (fields.email.trim().length > 254) {
            return 'Email address is too long.';
        }
    }

    // Phone: must be a valid Indian mobile number after normalization (optional field)
    if (fields.phone && fields.phone.trim()) {
        const normalized = normalizePhone(fields.phone);
        // After normalization, should be +91 followed by 10 digits starting with 6-9
        const phoneRegex = /^\+91[6-9]\d{9}$/;
        if (!phoneRegex.test(normalized)) {
            return 'Please enter a valid 10-digit Indian mobile number.';
        }
    }

    // Address: max 500 chars
    if (fields.address && fields.address.trim().length > 500) {
        return 'Address must be less than 500 characters.';
    }

    return null; // All valid
}

export async function updateProfile(prevState: any, formData: FormData) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    if (!session.isLoggedIn || !session.user) {
        return { success: false, message: 'Unauthorized' };
    }

    const name = (formData.get('name') as string || '').trim();
    const location = (formData.get('location') as string || '').trim();
    const email = (formData.get('email') as string || '').trim();
    const address = (formData.get('address') as string || '').trim();
    const rawPhone = (formData.get('phone') as string || '').trim();

    // Validate all input fields
    const validationError = validateProfileInput({ name, location, email, phone: rawPhone, address });
    if (validationError) {
        return { success: false, message: validationError };
    }

    // Normalize phone number to +91XXXXXXXXXX format
    const phone = rawPhone ? normalizePhone(rawPhone) : '';

    try {
        await dbConnect();

        // If phone is provided, check for duplicates manually using normalized comparison
        if (phone) {
            // Extract last 10 digits for comparison
            const last10 = phone.slice(-10);

            const existingUser = await User.findOne({
                _id: { $ne: session.user._id },
                $or: [
                    { phone: phone },                                  // Exact match: +916360354678
                    { phone: last10 },                                 // Stored as 6360354678
                    { phone: `+91${last10}` },                         // Stored as +916360354678
                    { phone: `91${last10}` },                          // Stored as 916360354678
                    { phone: { $regex: `${last10}$` } },               // Ends with last 10 digits
                ]
            });

            if (existingUser) {
                return { success: false, message: 'This phone number is already registered with another account.' };
            }
        }

        // Update user in DB
        const updateData: Record<string, string> = { name, location, email, address };
        if (phone) {
            updateData.phone = phone;
        }

        const updatedUser = await User.findByIdAndUpdate(
            session.user._id,
            updateData,
            { new: true, runValidators: true }
        ).lean();

        if (!updatedUser) {
            return { success: false, message: 'User not found' };
        }

        // Update session
        session.user = {
            ...session.user,
            name: updatedUser.name,
            location: updatedUser.location,
            email: updatedUser.email,
            address: updatedUser.address,
        };
        await session.save();

        revalidatePath('/profile');
        return { success: true, message: 'Profile updated successfully!' };

    } catch (error: any) {
        console.error('Profile Update Error:', error);

        // Handle Duplicate Key Error (E11000) as a fallback
        if (error.code === 11000 || error.message?.includes('E11000')) {
            if (error.keyPattern?.phone) {
                return { success: false, message: 'This phone number is already registered with another account.' };
            }
            if (error.keyPattern?.email) {
                return { success: false, message: 'This email is already currently in use.' };
            }
            return { success: false, message: 'Duplicate entry found. Please check your details.' };
        }

        return { success: false, message: error.message || 'Failed to update profile' };
    }
}

export async function removeFromWishlist(productId: string) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    if (!session.isLoggedIn || !session.user) {
        return { success: false, message: 'Unauthorized' };
    }

    try {
        await dbConnect();
        await User.findByIdAndUpdate(
            session.user._id,
            { $pull: { wishlist: productId } }
        );

        revalidatePath('/wishlist');
        return { success: true, message: 'Removed from wishlist' };
    } catch (error: any) {
        console.error('Wishlist Remove Error:', error);
        return { success: false, message: 'Failed to remove from wishlist' };
    }
}

export async function addToWishlist(productId: string) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    if (!session.isLoggedIn || !session.user) {
        // Return a flag to trigger login modal if needed, or just error
        return { success: false, message: 'Please login to add to wishlist', requiresLogin: true };
    }

    try {
        await dbConnect();
        // Check if already in wishlist to avoid duplicates (though $addToSet handles it)
        await User.findByIdAndUpdate(
            session.user._id,
            { $addToSet: { wishlist: productId } }
        );

        revalidatePath('/wishlist');
        // You might want to revalidate the product page too if it shows "In Wishlist" status
        return { success: true, message: 'Added to wishlist!' };
    } catch (error: any) {
        console.error('Wishlist Add Error:', error);
        return { success: false, message: 'Failed to add to wishlist' };
    }
}
