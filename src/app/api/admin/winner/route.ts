import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Participant } from '@/models/Schema';

export async function GET() {
    try {
        await dbConnect();
        const count = await Participant.countDocuments();

        if (count === 0) {
            return NextResponse.json({ success: false, message: 'لا يوجد مشتركين حتى الآن' }, { status: 404 });
        }

        const random = Math.floor(Math.random() * count);
        const winner = await Participant.findOne().skip(random);

        return NextResponse.json({
            success: true,
            winner: {
                name: winner.name,
                phone: winner.phone,
                code: winner.code_entered,
                date: winner.created_at
            }
        });

    } catch (error) {
        console.error('Winner Error:', error);
        return NextResponse.json({ success: false, message: 'حدث خطأ أثناء السحب' }, { status: 500 });
    }
}
