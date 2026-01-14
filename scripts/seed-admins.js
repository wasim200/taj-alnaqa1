
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ['superadmin', 'employee'], default: 'employee' },
    permissions: { type: [String], default: [] },
    created_at: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seedAdmins() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        // 1. Update 'admin' to SUPERADMIN
        await User.findOneAndUpdate(
            { username: 'admin' },
            {
                password_hash: 'admin123',
                role: 'superadmin',
                permissions: [] // Superadmin bypasses checks
            },
            { upsert: true, new: true }
        );
        console.log('User "admin" updated successfully to SUPERADMIN.');

        // 2. Update 'Waseem' to SUPERADMIN (or keep employee?)
        // Let's make Waseem superadmin too or let user decide?
        // User said "admin accounts". I'll default Waseem to superadmin too for safety/ease, or employee?
        // "واضيف حساب مدير جديد باسم Waseem". Manager = Admin?
        // Let's make Waseem Superadmin for now to avoid issues, or give full permissions.
        await User.findOneAndUpdate(
            { username: 'Waseem' },
            {
                password_hash: 'Waseem00#',
                role: 'superadmin',
                permissions: []
            },
            { upsert: true, new: true }
        );
        console.log('User "Waseem" updated successfully.');

        process.exit(0);
    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
}

seedAdmins();
