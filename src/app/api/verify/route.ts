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

        // Update Code Validation: Check for FX or FG prefix + 4 digits + 1 char (approx length 7)
        // Regex: ^(FX|FG)\d{4}[A-Z]$
        if (!code || !/^(FX|FG)\d{4}[A-Z]$/.test(code)) {
            return NextResponse.json({ success: false, message: 'صيغة الكود غير صحيحة. تأكد من الكود (مثال: FX1234A)' }, { status: 400 });
        }

        // 3. Find Code
        const codeDoc = await Code.findOne({ code });

        if (!codeDoc) {
            return NextResponse.json({ success: false, message: 'الكود غير موجود. تأكد من إدخاله بشكل صحيح.' }, { status: 404 });
        }

        if (codeDoc.is_used) {
            return NextResponse.json({ success: false, message: 'عذراً، هذا الكود مستخدم من قبل.' }, { status: 409 });
        }

        // 4. Register Participant
        // Logic: FX -> 2 Chances (2 Entries), FG -> 1 Chance (1 Entry)
        const isDoubleChance = code.startsWith('FX');
        const entries = isDoubleChance ? 3 : 1;
        const participantIds = [];

        for (let i = 0; i < entries; i++) {
            const newParticipant = await Participant.create({
                name,
                phone,
                code_entered: code,
                ip_address: req.headers.get('x-forwarded-for') || 'unknown',
                user_agent: req.headers.get('user-agent') || 'unknown'
            });
            participantIds.push(newParticipant._id);
        }

        // 5. Mark Code as Used
        codeDoc.is_used = true;
        // Just store the first ID reference for tracking, or maybe change schema to array later (simpler for now)
        codeDoc.used_by = participantIds[0];
        codeDoc.used_at = new Date();
        await codeDoc.save();

        const successMessage = isDoubleChance
            ? 'تم تسجيل الكود بنجاح.\n\nمبروك 🎉✨ لقد دخلت السحب معنا بثلاث فرص لاختيارك الحجم 1000 مل من فيري جولد ضاعف فرصك بالفوز عند شرائك عبوة أخرى العديد من الجوائز القيمة بانتظارك دائماً أنت الرابح 👑✨'
            : 'تم تسجيل الكود بنجاح\nدائماً أنت الرابح 🎉✨\nمبروك دخولك السحب معنا بفرصة واحدة \nيمكنك الدخول بثلاث فرص عند اختيارك لحجم 1000 مل من فيري جولد 😍👑\n العديد من الجوائز القيمة بانتظارك 🎁🥳';

        return NextResponse.json({
            success: true,
            message: successMessage,
            participantId: participantIds[0]
        });

    } catch (error) {
        console.error('Verify Error:', error);
        return NextResponse.json({ success: false, message: 'حدث خطأ في الخادم' }, { status: 500 });
    }
}
