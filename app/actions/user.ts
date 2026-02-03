'use server';

import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { revalidatePath } from 'next/cache';
import Product from '@/models/Product';

export async function updateProfile(prevState: any, formData: FormData) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    if (!session.isLoggedIn || !session.user) {
        return { success: false, message: 'Unauthorized' };
    }

    const name = formData.get('name') as string;
    const location = formData.get('location') as string;
    const email = formData.get('email') as string;
    const address = formData.get('address') as string;

    if (!name || !location) {
        return { success: false, message: 'Name and Location are required' };
    }

    try {
        await dbConnect();

        // Update user in DB
        const updatedUser = await User.findByIdAndUpdate(
            session.user._id,
            { name, location, email, address },
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
