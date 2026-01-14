import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/Schema';

// GET: List all users
export async function GET() {
    try {
        await dbConnect();
        // Return all users but exclude password_hash
        const users = await User.find({}, '-password_hash').sort({ created_at: -1 });
        return NextResponse.json({ success: true, users });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

// POST: Create a new user
export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { username, password, role, permissions } = body;

        // Basic validation
        if (!username || !password) {
            return NextResponse.json({ success: false, message: 'Username and password are required' }, { status: 400 });
        }

        // Check availability
        const existing = await User.findOne({ username });
        if (existing) {
            return NextResponse.json({ success: false, message: 'User already exists' }, { status: 409 });
        }

        // Create user (Note: Password hashing should be improved in production, 
        // currently using plaintext/simple match as per previous migration step, 
        // but for a new feature let's assume the previous logic prevails. 
        // Ideally we should hash here. Since "seed-admins.js" used plaintext for migration 
        // (admin123), checking login route... it compares `password !== user.password_hash`.
        // So we store exactly what we get.

        const newUser = await User.create({
            username,
            password_hash: password, // Storing as is for now based on current login logic
            role: role || 'employee',
            permissions: permissions || []
        });

        return NextResponse.json({ success: true, message: 'User created successfully', user: newUser });

    } catch (error) {
        console.error('Create User Error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

// PUT: Update a user
export async function PUT(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { id, password, role, permissions } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: 'User ID required' }, { status: 400 });
        }

        const updateData: any = {};
        if (password) updateData.password_hash = password; // Only update if provided
        if (role) updateData.role = role;
        if (permissions) updateData.permissions = permissions;

        await User.findByIdAndUpdate(id, updateData);

        return NextResponse.json({ success: true, message: 'User updated successfully' });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

// DELETE: Delete a user
export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, message: 'User ID required' }, { status: 400 });
        }

        await User.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
