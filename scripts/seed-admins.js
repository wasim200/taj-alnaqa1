
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
    created_at: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seedAdmins() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        // 1. Update/Create 'admin'
        await User.findOneAndUpdate(
            { username: 'admin' },
            { password_hash: 'admin123' },
            { upsert: true, new: true }
        );
        console.log('User "admin" updated successfully.');

        // 2. Update/Create 'Waseem'
        await User.findOneAndUpdate(
            { username: 'Waseem' },
            { password_hash: 'Waseem00#' },
            { upsert: true, new: true }
        );
        console.log('User "Waseem" created/updated successfully.');

        process.exit(0);
    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
}

seedAdmins();
