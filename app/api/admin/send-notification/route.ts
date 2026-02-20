import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import connectDB from '@/lib/db';
import Subscription from '@/models/Subscription';
import User from '@/models/User';
import Order from '@/models/Order';
import cloudinary from '@/lib/cloudinary';
import { requireAdmin } from '@/lib/admin-auth';

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

export async function POST(req: NextRequest) {
    const authError = await requireAdmin();
    if (authError) return authError;
    try {
        await connectDB();

        const formData = await req.formData();

        // Extract form fields
        const title = formData.get('title') as string;
        const body = formData.get('body') as string;
        const url = formData.get('url') as string;
        const audience = formData.get('audience') as string || 'all';
        const targetTags = formData.get('tags') as string; // comma-separated
        const targetLocation = formData.get('location') as string;
        const targetUserId = formData.get('userId') as string;
        const inactiveDays = formData.get('inactiveDays') as string;
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

        // ===== AUDIENCE TARGETING =====
        let subscriptions;
        let audienceLabel = 'all subscribers';

        switch (audience) {
            case 'specific_user': {
                // Send to a specific user by userId
                if (!targetUserId) {
                    return NextResponse.json({ error: 'User ID is required for specific user targeting.' }, { status: 400 });
                }
                subscriptions = await Subscription.find({ userId: targetUserId });
                audienceLabel = 'specific user';
                break;
            }
            case 'registered_users': {
                // All subscriptions linked to a user account
                subscriptions = await Subscription.find({ userId: { $ne: null } });
                audienceLabel = 'registered users';
                break;
            }
            case 'cart_abandonment': {
                // Users who have items in cart
                const usersWithCart = await User.find({ 'cart.0': { $exists: true } }).select('_id');
                const userIds = usersWithCart.map(u => u._id);
                subscriptions = await Subscription.find({ userId: { $in: userIds } });
                audienceLabel = `users with cart items (${userIds.length} users)`;
                break;
            }
            case 'by_tags': {
                // Users matching specific tags
                if (!targetTags) {
                    return NextResponse.json({ error: 'Tags are required for tag-based targeting.' }, { status: 400 });
                }
                const tagsArray = targetTags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
                const taggedUsers = await User.find({ tags: { $in: tagsArray } }).select('_id');
                const tagUserIds = taggedUsers.map(u => u._id);
                subscriptions = await Subscription.find({ userId: { $in: tagUserIds } });
                audienceLabel = `users tagged [${tagsArray.join(', ')}] (${tagUserIds.length} users)`;
                break;
            }
            case 'by_location': {
                // Users in a specific location/city
                if (!targetLocation) {
                    return NextResponse.json({ error: 'Location is required for location-based targeting.' }, { status: 400 });
                }
                const escapedLoc = targetLocation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const locationUsers = await User.find({ location: { $regex: escapedLoc, $options: 'i' } }).select('_id');
                const locUserIds = locationUsers.map(u => u._id);
                subscriptions = await Subscription.find({ userId: { $in: locUserIds } });
                audienceLabel = `users in "${targetLocation}" (${locUserIds.length} users)`;
                break;
            }
            case 'inactive_users': {
                // Users who haven't logged in for X days
                const days = parseInt(inactiveDays || '7', 10);
                const cutoffDate = new Date();
                cutoffDate.setDate(cutoffDate.getDate() - days);
                const inactiveUsers = await User.find({
                    $or: [
                        { lastLogin: { $lt: cutoffDate } },
                        { lastLogin: { $exists: false } },
                    ]
                }).select('_id');
                const inactiveIds = inactiveUsers.map(u => u._id);
                subscriptions = await Subscription.find({ userId: { $in: inactiveIds } });
                audienceLabel = `inactive users (${days}+ days, ${inactiveIds.length} users)`;
                break;
            }
            case 'purchase_history': {
                // Users who have made at least one successful order
                const buyerOrders = await Order.aggregate([
                    { $match: { status: { $in: ['Paid', 'Confirmed', 'Processing', 'Shipped', 'Delivered'] } } },
                    { $group: { _id: '$user' } },
                ]);
                const buyerIds = buyerOrders.map(o => o._id);
                subscriptions = await Subscription.find({ userId: { $in: buyerIds } });
                audienceLabel = `past buyers (${buyerIds.length} users)`;
                break;
            }
            case 'all':
            default: {
                subscriptions = await Subscription.find();
                audienceLabel = 'all subscribers';
                break;
            }
        }

        if (!subscriptions || subscriptions.length === 0) {
            return NextResponse.json(
                { error: `No subscribers found for audience: ${audienceLabel}` },
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
        // IMPORTANT: pass a plain object, not a Mongoose document
        const promises = subscriptions.map((sub) => {
            const pushSubscription = {
                endpoint: sub.endpoint,
                keys: {
                    p256dh: sub.keys.p256dh,
                    auth: sub.keys.auth,
                },
            };
            return webpush.sendNotification(pushSubscription, notificationPayload).catch((err: any) => {
                // Handle expired/invalid subscriptions
                if (err.statusCode === 410 || err.statusCode === 404) {
                    console.log(`Subscription expired/gone for ${sub._id}, deleting...`);
                    return Subscription.deleteOne({ _id: sub._id });
                }
                console.error('Error sending to subscription:', sub._id, err.message || err);
            });
        });

        await Promise.all(promises);

        console.log(`Notifications sent to ${subscriptions.length} subscribers (${audienceLabel})`);

        return NextResponse.json({
            success: true,
            message: `Notification sent to ${subscriptions.length} ${audienceLabel}!`,
        });
    } catch (error) {
        console.error('Error sending notification:', error);
        return NextResponse.json(
            { error: 'Failed to send notification' },
            { status: 500 }
        );
    }
}
