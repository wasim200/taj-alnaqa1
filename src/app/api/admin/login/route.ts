import { NextResponse } from 'next/server';


import dbConnect from '@/lib/db';
import { User } from '@/models/Schema';
import { logActivity } from '@/lib/log-activity';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { username, password } = await req.json();

        // Find user by username
        const user = await User.findOne({ username });

        if (!user) {
            await logActivity(username, 'LOGIN_FAILED', 'محاولة دخول فاشلة: اسم المستخدم غير موجود');
            return NextResponse.json({ success: false, message: 'بيانات الدخول غير صحيحة' }, { status: 401 });
        }

        // Verify password (Direct comparison for now as requested)
        // In a real app, use bcrypt.compare(password, user.password_hash)
        if (password !== user.password_hash) {
            await logActivity(username, 'LOGIN_FAILED', 'محاولة دخول فاشلة: كلمة المرور غير صحيحة');
            return NextResponse.json({ success: false, message: 'بيانات الدخول غير صحيحة' }, { status: 401 });
        }

        // Create response
        const response = NextResponse.json({
            success: true,
            message: 'Login successful',
            user: {
                username: user.username,
                role: user.role,
                permissions: user.permissions
            }
        });

        // Log the login action
        const ip = req.headers.get('x-forwarded-for') || 'Unknown';
        await logActivity(user.username, 'LOGIN', 'تم تسجيل الدخول بنجاح', ip);

        // Set Cookie
        response.cookies.set('admin_token', 'secure-token-value', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 // 1 day
        });

        return response;

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
