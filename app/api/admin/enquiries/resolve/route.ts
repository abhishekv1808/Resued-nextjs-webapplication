import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Enquiry from '@/models/Enquiry';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { enquiryId } = await req.json();

        if (!enquiryId) {
            return NextResponse.json({ error: 'Missing enquiryId' }, { status: 400 });
        }

        const deletedEnquiry = await Enquiry.findByIdAndDelete(enquiryId);

        if (!deletedEnquiry) {
            return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error resolving enquiry:', error);
        return NextResponse.json({ error: 'Failed to resolve enquiry' }, { status: 500 });
    }
}
