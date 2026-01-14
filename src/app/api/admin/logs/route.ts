import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { ActivityLog } from '@/models/Schema';

export async function GET(req: Request) {
    try {
        await dbConnect();

        // Fetch last 100 logs sorted by newest first
        const logs = await ActivityLog.find()
            .sort({ created_at: -1 })
            .limit(100);

        return NextResponse.json({ success: true, logs });
    } catch (error) {
        console.error('Error fetching logs:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
