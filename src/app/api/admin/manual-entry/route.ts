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
            return NextResponse.json({ success: false, message: 'الاسم غير صحيح (يجب أن يكون 3 أحرف على الأقل)' }, { status: 400 });
        }

        // Loose phone validation for admin (just ensure it has some digits)
        if (!phone || phone.length < 9) {
            return NextResponse.json({ success: false, message: 'رقم الهاتف غير صحيح' }, { status: 400 });
        }

        // Code Validation
        if (!code) {
            return NextResponse.json({ success: false, message: 'رمز الكود مطلوب' }, { status: 400 });
        }

        // 2. Find and Validate Code
        const codeDoc = await Code.findOne({ code });

        if (!codeDoc) {
            return NextResponse.json({ success: false, message: 'الكود غير موجود في النظام' }, { status: 404 });
        }

        if (codeDoc.is_used) {
            return NextResponse.json({ success: false, message: 'هذا الكود مستخدم بالفعل' }, { status: 409 });
        }

        // 3. Register Participant
        // Logic: FX -> 2 Chances, FG -> 1 Chance
        const isDoubleChance = code.startsWith('FX');
        const entries = isDoubleChance ? 3 : 1;
        const participantIds = [];

        // Admin Manual Entry - Metadata
        const adminMetadata = {
            ip: 'Manual Entry (Admin)',
            ua: 'Admin Dashboard'
        };

        for (let i = 0; i < entries; i++) {
            const newParticipant = await Participant.create({
                name,
                phone,
                code_entered: code,
                ip_address: adminMetadata.ip,
                user_agent: adminMetadata.ua,
                is_manual_entry: true // Optional flag if schema supports it, otherwise just metadata implies it
            });
            participantIds.push(newParticipant._id);
        }

        // 4. Mark Code as Used
        codeDoc.is_used = true;
        codeDoc.used_by = participantIds[0];
        codeDoc.used_at = new Date();
        await codeDoc.save();

        const successMessage = isDoubleChance
            ? 'تم تسجيل الكود بنجاح.\n\nمبروك 🎉✨ لقد دخلت السحب معنا بثلاث فرص لاختيارك الحجم 1000 مل من فيري جولد ضاعف فرصك بالفوز عند شرائك عبوة أخرى العديد من الجوائز القيمة بانتظارك دائماً أنت الرابح 👑✨'
            : `تم تسجيل المشترك بنجاح.\nعدد الفرص: ${entries} (${code})`;

        return NextResponse.json({
            success: true,
            message: successMessage,
            participantId: participantIds[0]
        });

    } catch (error) {
        console.error('Manual Entry Error:', error);
        return NextResponse.json({ success: false, message: 'حدث خطأ في الخادم أثناء التسجيل' }, { status: 500 });
    }
}
