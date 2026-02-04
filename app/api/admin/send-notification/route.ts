import { NextResponse } from 'next/server';
import webpush from 'web-push';
import connectDB from '@/lib/db';
import Subscription from '@/models/Subscription';

// Configure VAPID details
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY!;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY!;

if (vapidPublicKey && vapidPrivateKey) {
    webpush.setVapidDetails(
        'mailto:admin@simtechcomputers.com',
        vapidPublicKey,
        vapidPrivateKey
    );
}

export async function POST(req: Request) {
    try {
        await connectDB();

        const formData = await req.formData();

        // Extract form fields
        const title = formData.get('title') as string;
        const body = formData.get('body') as string;
        const url = formData.get('url') as string;
        const action1_title = formData.get('action1_title') as string;
        const action1_url = formData.get('action1_url') as string;
        const action2_title = formData.get('action2_title') as string;
        const action2_url = formData.get('action2_url') as string;

        // Extract files
        const imageFile = formData.get('image') as File | null;
        const iconFile = formData.get('icon') as File | null;

        // For now, we'll use direct URLs if files are uploaded
        // In a production environment, you'd upload these to Cloudinary or similar
        let imagePath = null;
        let iconPath = '/images/logo.png'; // Default icon

        // Note: Since we're dealing with FormData files, we'd need to handle uploading
        // For simplicity, we'll use default paths. You can extend this to upload to Cloudinary
        if (imageFile && imageFile.size > 0) {
            // In production: upload to Cloudinary and get URL
            // For now: we'll skip the banner image if not already hosted
            console.log('Image file received:', imageFile.name);
        }

        if (iconFile && iconFile.size > 0) {
            console.log('Icon file received:', iconFile.name);
        }

        // Fetch all subscriptions
        const subscriptions = await Subscription.find();

        if (!subscriptions || subscriptions.length === 0) {
            return NextResponse.json(
                { error: 'No subscribers found.' },
                { status: 400 }
            );
        }

        // Construct actions array
        const actions = [];
        if (action1_title && action1_url) {
            actions.push({ action: action1_url, title: action1_title });
        }
        if (action2_title && action2_url) {
            actions.push({ action: action2_url, title: action2_title });
        }

        // Construct notification payload
        const notificationPayload = JSON.stringify({
            title: title,
            body: body,
            image: imagePath,
            icon: iconPath,
            url: url || '/',
            actions: actions,
        });

        // Send notifications to all subscriptions
        const promises = subscriptions.map((sub) =>
            webpush.sendNotification(sub, notificationPayload).catch((err: any) => {
                // Handle expired/invalid subscriptions
                if (err.statusCode === 410 || err.statusCode === 404) {
                    console.log(`Subscription expired/gone for ${sub._id}, deleting...`);
                    return Subscription.deleteOne({ _id: sub._id });
                }
                console.error('Error sending notification:', err);
            })
        );

        await Promise.all(promises);

        console.log(`Notifications sent to ${subscriptions.length} subscribers`);

        return NextResponse.json({
            success: true,
            message: `Notification sent successfully to ${subscriptions.length} subscribers!`,
        });
    } catch (error) {
        console.error('Error sending notification:', error);
        return NextResponse.json(
            { error: 'Failed to send notification' },
            { status: 500 }
        );
    }
}
