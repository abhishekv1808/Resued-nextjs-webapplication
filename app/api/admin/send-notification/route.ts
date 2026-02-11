import { NextResponse } from 'next/server';
import webpush from 'web-push';
import connectDB from '@/lib/db';
import Subscription from '@/models/Subscription';
import cloudinary from '@/lib/cloudinary';

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
        let imagePath = null;
        let iconPath = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/images/logo.png`; // Default icon with absolute URL

        const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        // Handle Image Upload
        if (imageFile && imageFile.size > 0) {
            if (isCloudinaryConfigured) {
                const arrayBuffer = await imageFile.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                const result = await new Promise<any>((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'simtech-notifications',
                            quality: "auto",
                            fetch_format: "auto"
                        },
                        (error: any, result: any) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    uploadStream.end(buffer);
                });
                imagePath = result.secure_url;
            } else {
                // Fallback: Save locally
                const { writeFile, mkdir } = await import('fs/promises');
                const path = await import('path');

                const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'notifications');
                await mkdir(uploadsDir, { recursive: true });

                const ext = imageFile.name.split('.').pop() || 'jpg';
                const fileName = `banner-${Date.now()}.${ext}`;
                const filePath = path.join(uploadsDir, fileName);

                const arrayBuffer = await imageFile.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                await writeFile(filePath, buffer);

                imagePath = `${baseUrl}/uploads/notifications/${fileName}`;
            }
        }

        // Handle Icon Upload
        if (iconFile && iconFile.size > 0) {
            if (isCloudinaryConfigured) {
                const arrayBuffer = await iconFile.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                const result = await new Promise<any>((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'simtech-notifications',
                            quality: "auto",
                            fetch_format: "auto"
                        },
                        (error: any, result: any) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    uploadStream.end(buffer);
                });
                iconPath = result.secure_url;
            } else {
                // Fallback: Save locally
                const { writeFile, mkdir } = await import('fs/promises');
                const path = await import('path');

                const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'notifications');
                await mkdir(uploadsDir, { recursive: true });

                const ext = iconFile.name.split('.').pop() || 'png';
                const fileName = `icon-${Date.now()}.${ext}`;
                const filePath = path.join(uploadsDir, fileName);

                const arrayBuffer = await iconFile.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                await writeFile(filePath, buffer);

                iconPath = `${baseUrl}/uploads/notifications/${fileName}`;
            }
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
