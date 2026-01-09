import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Code, Participant } from '@/models/Schema';

export async function GET() {
    try {
        await dbConnect();

        const [totalCodes, usedCodes, totalParticipants] = await Promise.all([
            Code.countDocuments(),
            Code.countDocuments({ is_used: true }),
            Participant.countDocuments()
        ]);

        const remainingCodes = totalCodes - usedCodes;

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
