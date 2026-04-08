import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Code, Participant, User, ActivityLog } from '@/models/Schema';
import { logActivity } from '@/lib/log-activity';

export async function POST(req: Request) {
    try {
        await dbConnect();

        // 1. Check if user is SuperAdmin
        const adminUsername = req.headers.get('x-admin-username') || 'Unknown';
        if (adminUsername === 'Unknown') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const adminUser = await User.findOne({ username: adminUsername });
        if (!adminUser || adminUser.role !== 'superadmin') {
            await logActivity(adminUsername, 'RESTORE_FAILED', 'محاولة غير مصرحة لاستعادة نسخة احتياطية');
            return NextResponse.json({ success: false, message: 'غير مصرح لك باستعادة البيانات' }, { status: 403 });
        }

        // 2. Parse FormData
        const formData = await req.formData();
        const file = formData.get('file') as File;
        if (!file) {
            return NextResponse.json({ success: false, message: 'لم يتم رفع أي ملف' }, { status: 400 });
        }

        // 3. Read and Parse JSON File
        const fileContent = await file.text();
        let backupData;
        try {
            backupData = JSON.parse(fileContent);
        } catch (e) {
            return NextResponse.json({ success: false, message: 'الملف المرفوع ليس ملف JSON صالح' }, { status: 400 });
        }

        if (!backupData || !backupData.data || !backupData.data.Codes) {
            return NextResponse.json({ success: false, message: 'هيكل ملف النسخة الاحتياطية غير صحيح المرجو التأكد منه' }, { status: 400 });
        }

        // 4. Drop current collections and Restore new Data
        await Promise.all([
            Code.deleteMany({}),
            Participant.deleteMany({}),
            User.deleteMany({}),
            ActivityLog.deleteMany({})
        ]);

        // Note: Using insertMany might fail if the file is too huge or schema validation fails, 
        // but for <10,000 documents it is very fast.
        const restorePromises = [];
        if (backupData.data.Codes && backupData.data.Codes.length > 0) {
            restorePromises.push(Code.insertMany(backupData.data.Codes));
        }
        if (backupData.data.Participants && backupData.data.Participants.length > 0) {
            restorePromises.push(Participant.insertMany(backupData.data.Participants));
        }
        if (backupData.data.Users && backupData.data.Users.length > 0) {
            restorePromises.push(User.insertMany(backupData.data.Users));
        }
        if (backupData.data.ActivityLogs && backupData.data.ActivityLogs.length > 0) {
            restorePromises.push(ActivityLog.insertMany(backupData.data.ActivityLogs));
        }

        await Promise.all(restorePromises);

        // 5. Finalize
        await logActivity(adminUsername, 'BACKUP_RESTORED', 'تمت استعادة وتجديد بيانات النظام من نسخة احتياطية بنجاح');

        return NextResponse.json({ success: true, message: 'تم استعادة النظام بنجاح' });
    } catch (error: any) {
        console.error('Restore Error:', error);
        return NextResponse.json({ success: false, message: 'حدث خطأ في السيرفر أثناء الاستعادة: ' + error.message }, { status: 500 });
    }
}
