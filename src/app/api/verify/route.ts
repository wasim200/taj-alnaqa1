import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Code, Participant } from '@/models/Schema';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { name, phone, code } = body;

        // 1. Basic Validation
        if (!name || name.length < 3) {
            return NextResponse.json({ success: false, message: 'الاسم غير صحيح' }, { status: 400 });
        }
        if (!/^7\d{8}$/.test(phone)) {
            return NextResponse.json({ success: false, message: 'رقم الهاتف يجب أن يبدأ بـ 7 ويتكون من 9 أرقام' }, { status: 400 });
        }
        if (!code || !code.startsWith('TAJ-')) {
            return NextResponse.json({ success: false, message: 'صيغة الكود غير صحيحة' }, { status: 400 });
        }

        // 2. Rate Limiting Check (Simple impl based on IP or Phone)
        // Skipped for now to keep it simple, but recommended.

        // 3. Find Code
        const codeDoc = await Code.findOne({ code });

        if (!codeDoc) {
            return NextResponse.json({ success: false, message: 'الكود غير موجود. تأكد من إدخاله بشكل صحيح.' }, { status: 404 });
        }

        if (codeDoc.is_used) {
            return NextResponse.json({ success: false, message: 'عذراً، هذا الكود مستخدم من قبل.' }, { status: 409 });
        }

        // 4. Register Participant
        // Check if phone already won? Maybe allowed multiple times.

        // Create Participant
        const newParticipant = await Participant.create({
            name,
            phone,
            code_entered: code,
            ip_address: req.headers.get('x-forwarded-for') || 'unknown',
            user_agent: req.headers.get('user-agent') || 'unknown'
        });

        // 5. Mark Code as Used
        codeDoc.is_used = true;
        codeDoc.used_by = newParticipant._id;
        codeDoc.used_at = new Date();
        await codeDoc.save();

        return NextResponse.json({
            success: true,
            message: 'تم تسجيلك بنجاح في السحب!',
            participantId: newParticipant._id
        });

    } catch (error) {
        console.error('Verify Error:', error);
        return NextResponse.json({ success: false, message: 'حدث خطأ في الخادم' }, { status: 500 });
    }
}
