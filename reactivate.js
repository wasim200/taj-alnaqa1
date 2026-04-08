const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const MONGODB_URI = 'mongodb+srv://v2-nextjs_db_user:lk1WdQNBCbpCJrGu@cluster2.h6atciy.mongodb.net/taj_alnaqa?retryWrites=true&w=majority&appName=Cluster2';

const CodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    batch_name: { type: String, required: true },
    is_used: { type: Boolean, default: false },
    used_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Participant', default: null },
    used_at: { type: Date, default: null },
    created_at: { type: Date, default: Date.now },
});

const ParticipantSchema = new mongoose.Schema({
    name: { type: String },
});

const Code = mongoose.models.Code || mongoose.model('Code', CodeSchema);
const Participant = mongoose.models.Participant || mongoose.model('Participant', ParticipantSchema);

async function run() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected successfully!");

        console.log("Reactivating used codes...");
        const updateResult = await Code.updateMany(
            { is_used: true },
            { $set: { is_used: false, used_by: null, used_at: null } }
        );
        
        console.log(`Successfully reactivated ${updateResult.modifiedCount} codes.`);

        console.log("Deleting test participants...");
        const deleteResult = await Participant.deleteMany({});
        console.log(`Deleted ${deleteResult.deletedCount} test participants.`);

        console.log("\n=========================");
        console.log("Operation Complete! All codes are now fresh.");
        console.log("=========================");
    } catch (err) {
        console.error("Error occurred:", err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
