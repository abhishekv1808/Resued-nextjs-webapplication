'use server';

import dbConnect from "@/lib/db";
import Enquiry from "@/models/Enquiry";

export async function submitContact(prevState: any, formData: FormData) {
    try {
        await dbConnect();

        const name = formData.get('name') as string;
        const phone = formData.get('phone') as string;
        const email = formData.get('email') as string;
        const brand = formData.get('brand') as string | null;
        const processor = formData.get('processor') as string | null;
        const ram = formData.get('ram') as string | null; // Assuming these might exist in the form
        const storage = formData.get('storage') as string | null; // Assuming these might exist in the form
        const purpose = formData.get('purpose') as string | null; // Assuming these might exist in the form
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
