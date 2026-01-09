import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Participant } from '@/models/Schema';

export async function GET() {
    try {
        await dbConnect();
        // Simple fetch all, desc order
        const participants = await Participant.find().sort({ created_at: -1 }).limit(100);
        return NextResponse.json({ success: true, participants });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
