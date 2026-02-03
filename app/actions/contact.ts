'use server';

import dbConnect from "@/lib/db";
import Enquiry from "@/models/Enquiry";

export async function submitContact(prevState: any, formData: FormData) {
    try {
        await dbConnect();

        const name = formData.get('name');
        const phone = formData.get('phone');
        const email = formData.get('email');
        const brand = formData.get('brand');
        const processor = formData.get('processor');
        const ram = formData.get('ram'); // Assuming these might exist in the form
        const storage = formData.get('storage'); // Assuming these might exist in the form
        const purpose = formData.get('purpose'); // Assuming these might exist in the form
        const message = formData.get('message');

        // Create new enquiry
        await Enquiry.create({
            name,
            phone,
            email,
            brand,
            processor,
            ram,
            storage,
            purpose,
            message,
            date: new Date()
        });

        return { success: true, message: 'Thank you! Your enquiry has been sent successfully. We will get back to you shortly.' };
    } catch (error) {
        console.error('Error submitting enquiry:', error);
        return { success: false, message: 'Something went wrong. Please try again later.' };
    }
}
