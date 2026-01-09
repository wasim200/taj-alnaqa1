import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Code } from '@/models/Schema';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const batch = searchParams.get('batch');
        const limit = parseInt(searchParams.get('limit') || '100');

        if (!batch) {
            return NextResponse.json({ success: false, message: 'Batch required' }, { status: 400 });
        }

        const codes = await Code.find({ batch_name: batch, is_used: false }).limit(limit);
        return NextResponse.json({ success: true, codes });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
