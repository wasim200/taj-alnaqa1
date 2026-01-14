import { NextResponse } from 'next/server';

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/Schema';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { username, password } = await req.json();

        // Find user by username
        const user = await User.findOne({ username });

        if (!user) {
            return NextResponse.json({ success: false, message: 'بيانات الدخول غير صحيحة' }, { status: 401 });
        }

        // Verify password (Direct comparison for now as requested)
        // In a real app, use bcrypt.compare(password, user.password_hash)
        if (password !== user.password_hash) {
            return NextResponse.json({ success: false, message: 'بيانات الدخول غير صحيحة' }, { status: 401 });
        }

        // Create response
        const response = NextResponse.json({ success: true, message: 'Login successful' });

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
