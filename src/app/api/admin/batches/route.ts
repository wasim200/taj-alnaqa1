import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Code } from '@/models/Schema';

export async function GET() {
    try {
        await dbConnect();
        // distinct batch_name
        const batches = await Code.distinct('batch_name');
        return NextResponse.json({ success: true, batches });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
