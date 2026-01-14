import { ActivityLog } from '@/models/Schema';
import dbConnect from './db';

export async function logActivity(username: string, action: string, details: string = '', ip_address: string = 'Unknown') {
    try {
        await dbConnect();
        await ActivityLog.create({
            admin_username: username,
            action,
            details,
            ip_address,
        });
    } catch (error) {
        console.error('Failed to log activity:', error);
        // We don't want to crash the main request if logging fails, so we just log the error to console
    }
}
