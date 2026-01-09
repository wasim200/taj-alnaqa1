import mongoose, { Schema, model, models } from 'mongoose';

// --- Code Model ---
const CodeSchema = new Schema({
    code: { type: String, required: true, unique: true },
    batch_name: { type: String, required: true },
    is_used: { type: Boolean, default: false },
    used_by: { type: Schema.Types.ObjectId, ref: 'Participant', default: null },
    used_at: { type: Date, default: null },
    created_at: { type: Date, default: Date.now },
});

export const Code = models.Code || model('Code', CodeSchema);

// --- Participant Model ---
const ParticipantSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true }, // Not unique globally, maybe? Or yes? Usually yes for fairness.
    // In previous system, user could enter multiple times?
    // Let's assume phone is unique for now based on "Rate Limiting" tasks previously. 
    // Wait, previous PHP schema allowed duplicates or not? 
    // "participants" table usually has "phone" and "code".
    // A user can participate multiple times with different codes.
    // So (phone, code) is the unique interaction, but here we separate Participant entity?
    // Let's keep it simple: A Participant is created when they enter. 
    // Actually, better: separate "Entry" from "Person". 
    // But for simplicity of migration:
    // We store "Entry" in Participant collection.
    code_entered: { type: String, required: true },
    ip_address: { type: String },
    user_agent: { type: String },
    created_at: { type: Date, default: Date.now },
});

export const Participant = models.Participant || model('Participant', ParticipantSchema);

// --- User (Admin) Model ---
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
});

export const User = models.User || model('User', UserSchema);
