'use server';

import dbConnect from "@/lib/db";
import Enquiry from "@/models/Enquiry";

export async function submitContact(prevState: any, formData: FormData) {
    try {
        await dbConnect();

        const name = formData.get('name') as string;
        const phone = formData.get('phone') as string;

        // Server-side validation
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            return { success: false, message: 'Please enter a valid 10-15 digit mobile number (numbers only).' };
        }

        const email = formData.get('email') as string;
        const brand = formData.get('brand') as string | null;
        const processor = formData.get('processor') as string | null;
        const ram = formData.get('ram') as string | null;
        const storage = formData.get('storage') as string | null;
        const model = formData.get('model') as string | null;
        const purpose = formData.get('purpose') as string | null;
        const message = formData.get('message') as string;

        // Create new enquiry
        await Enquiry.create({
            name,
            phone,
            email,
            brand: brand || undefined,
            processor: processor || undefined,
            ram: ram || undefined,
            storage: storage || undefined,
            model: model || undefined,
            purpose: purpose || undefined,
            message,
            date: new Date()
        });

        return { success: true, message: 'Thank you! Your enquiry has been sent successfully. We will get back to you shortly.' };
    } catch (error) {
        console.error('Error submitting enquiry:', error);
        return { success: false, message: 'Something went wrong. Please try again later.' };
    }
}
