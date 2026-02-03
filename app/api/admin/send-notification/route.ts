import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        // Log the data to console to simulate receiving it
        console.log('Notification Request Received:');
        console.log('Title:', formData.get('title'));
        console.log('Body:', formData.get('body'));
        console.log('Audience:', formData.get('audience'));

        // In a real implementation, we would process the files and call a push service (e.g. FCM/VAPID)
        // const banner = formData.get('image');
        // const icon = formData.get('icon');

        return NextResponse.json({ success: true, message: 'Notification scheduled successfully!' });
    } catch (error) {
        console.error('Error sending notification:', error);
        return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
    }
}
