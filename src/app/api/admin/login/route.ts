import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        // Verification Logic (Hardcoded for now as per plan, or use DB User model)
        // Using hardcoded for initial migration simplicity as requested in simulating login
        const ADMIN_USER = process.env.ADMIN_USER || 'admin';
        const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123';

        if (username === ADMIN_USER && password === ADMIN_PASS) {
            // Create response
            const response = NextResponse.json({ success: true, message: 'Login successful' });

            // Set Cookie
            // In Next.js, cookies can be set on response
            response.cookies.set('admin_token', 'secure-token-value', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 60 * 60 * 24 // 1 day
            });

            return response;
        } else {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
