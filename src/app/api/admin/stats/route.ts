import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Code, Participant } from '@/models/Schema';

export async function GET() {
    try {
        await dbConnect();

        const OFFSET_USED_CODES = 1115;
        const OFFSET_PARTICIPANTS = 1700;

        const [dbTotalCodes, dbUsedCodes, dbTotalParticipants] = await Promise.all([
            Code.countDocuments(),
            Code.countDocuments({ is_used: true }),
            Participant.countDocuments()
        ]);

        const usedCodes = dbUsedCodes + OFFSET_USED_CODES;
        const totalParticipants = dbTotalParticipants + OFFSET_PARTICIPANTS;
        
        // حساب إجمالي الأكواد ليصبح متوافق رياضياً مع الأكواد المستخدمة سابقاً
        const totalCodes = dbTotalCodes + OFFSET_USED_CODES; 
        const remainingCodes = totalCodes - usedCodes; // يبدأ من 7000

        return NextResponse.json({
            success: true,
            stats: {
                totalCodes: totalCodes.toLocaleString(),
                usedCodes: usedCodes.toLocaleString(),
                remainingCodes: remainingCodes.toLocaleString(),
                totalParticipants: totalParticipants.toLocaleString()
            }
        });

    } catch (error) {
        console.error('Stats Error:', error);
        return NextResponse.json({ success: false, message: 'Error fetching stats' }, { status: 500 });
    }
}
