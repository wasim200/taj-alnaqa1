import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Code, Participant, User, ActivityLog } from '@/models/Schema';
import { logActivity } from '@/lib/log-activity';

export async function GET(req: Request) {
    try {
        await dbConnect();

        // 1. Check if user is SuperAdmin
        const adminUsername = req.headers.get('x-admin-username') || 'Unknown';
        if (adminUsername === 'Unknown') {
            return new NextResponse(JSON.stringify({ success: false, message: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const adminUser = await User.findOne({ username: adminUsername });
        if (!adminUser || (adminUser.role !== 'superadmin' && !adminUser.permissions.includes('system_management'))) {
            await logActivity(adminUsername, 'BACKUP_FAILED', 'محاولة غير مصرحة لأخذ نسخة احتياطية');
            return new NextResponse(JSON.stringify({ success: false, message: 'غير مصرح لك بنسخ البيانات' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // 2. Fetch all collections
        const [codes, participants, users, activityLogs] = await Promise.all([
            Code.find({}).lean(),
            Participant.find({}).lean(),
            User.find({}).lean(),
            ActivityLog.find({}).lean()
        ]);

        const backupData = {
            metadata: {
                generateDate: new Date().toISOString(),
                totalCodes: codes.length,
                totalParticipants: participants.length,
                totalUsers: users.length,
                version: "1.0"
            },
            data: {
                Codes: codes,
                Participants: participants,
                Users: users,
                ActivityLogs: activityLogs
            }
        };

        // 3. Log the action
        await logActivity(adminUsername, 'BACKUP_DOWNLOADED', 'تم أخذ نسخة احتياطية كاملة من قاعدة البيانات');

        // 4. Send as downloadable JSON file
        const jsonResponse = JSON.stringify(backupData, null, 2);
        
        return new NextResponse(jsonResponse, {
            status: 200,
            headers: {
                'Content-Disposition': `attachment; filename="Taj_AlNqaa_Backup_${new Date().toISOString().split('T')[0]}.json"`,
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.error('Backup Error:', error);
        return new NextResponse(JSON.stringify({ success: false, message: 'Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
