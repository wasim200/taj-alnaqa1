import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Code, Participant } from '@/models/Schema';
import { logActivity } from '@/lib/log-activity';

export async function DELETE(req: Request) {
    try {
        await dbConnect();

        // Delete all documents from collections
        await Code.deleteMany({});
        await Participant.deleteMany({});

        const adminUsername = req.headers.get('x-admin-username') || 'Unknown';
        await logActivity(adminUsername, 'SYSTEM_RESET', 'قام بتهيئة النظام وحذف جميع البيانات');

        return NextResponse.json({
            success: true,
            message: 'تم إعادة تهيئة النظام بنجاح. تم حذف جميع الأكواد والمشتركين.'
        });

    } catch (error) {
        console.error('Reset Error:', error);
        return NextResponse.json({ success: false, message: 'حدث خطأ أثناء إعادة التهيئة' }, { status: 500 });
    }
}
