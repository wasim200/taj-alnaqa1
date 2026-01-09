import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Code, Participant } from '@/models/Schema';

export async function DELETE() {
    try {
        await dbConnect();

        // Delete all documents from collections
        await Code.deleteMany({});
        await Participant.deleteMany({});

        return NextResponse.json({
            success: true,
            message: 'تم إعادة تهيئة النظام بنجاح. تم حذف جميع الأكواد والمشتركين.'
        });

    } catch (error) {
        console.error('Reset Error:', error);
        return NextResponse.json({ success: false, message: 'حدث خطأ أثناء إعادة التهيئة' }, { status: 500 });
    }
}
