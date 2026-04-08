const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const MONGODB_URI = 'mongodb+srv://v2-nextjs_db_user:lk1WdQNBCbpCJrGu@cluster2.h6atciy.mongodb.net/taj_alnaqa?retryWrites=true&w=majority&appName=Cluster2';
const PDF_DIR = path.join(__dirname, '../pdfs');

const CodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    batch_name: { type: String, required: true },
    is_used: { type: Boolean, default: false },
    used_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Participant', default: null },
    used_at: { type: Date, default: null },
    created_at: { type: Date, default: Date.now },
});

const Code = mongoose.models.Code || mongoose.model('Code', CodeSchema);

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    role: { type: String, enum: ['superadmin', 'employee'], default: 'employee' },
    permissions: [{ type: String }],
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Regex for the codes: Assuming they start with FX or FG and have 7 characters total
const CODE_REGEX = /(FX|FG)([A-Z0-9]{5})/g;

async function extractCodesFromPdf(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    
    // Process text
    const text = data.text;
    const matches = [...text.matchAll(CODE_REGEX)];
    
    // Return all extracted full matches
    return matches.map(match => match[0]);
}

async function run() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected successfully!");

        console.log("Creating/Updating Admin user (admin / admin123)...");
        await User.updateOne(
            { username: "admin" },
            { $set: { password_hash: "admin123", role: "superadmin" } },
            { upsert: true }
        );
        console.log("Admin user ready!");

        const files = fs.readdirSync(PDF_DIR).filter(f => f.endsWith('.pdf'));
        
        const allSmallCodes = new Set();
        const allLargeCodes = new Set();

        for (const file of files) {
            console.log(`Processing ${file}...`);
            const filePath = path.join(PDF_DIR, file);
            const codes = await extractCodesFromPdf(filePath);
            
            console.log(`Extracted ${codes.length} codes from ${file}.`);
            
            for (const code of codes) {
                if (code.startsWith('FG')) {
                    allSmallCodes.add(code);
                } else if (code.startsWith('FX')) {
                    allLargeCodes.add(code);
                }
            }
        }

        console.log("============= SUMMARY =============");
        console.log(`Total Small Product Codes (FG): ${allSmallCodes.size} (Expected: 4000)`);
        console.log(`Total Large Product Codes (FX): ${allLargeCodes.size} (Expected: 3000)`);
        
        if (allSmallCodes.size !== 4000 || allLargeCodes.size !== 3000) {
            console.warn("WARNING: The number of extracted unique codes does not match the expected count. Proceeding anyway...");
        }

        const allCodes = [...allSmallCodes, ...allLargeCodes];

        console.log("Preparing codes for insertion...");
        const codeDocuments = allCodes.map(code => ({
            code: code,
            batch_name: "Recovery_From_PDFs",
            is_used: false,
        }));

        console.log("Clearing old recovering data if any...");
        await Code.deleteMany({ batch_name: "Recovery_From_PDFs" });

        console.log("Inserting into MongoDB...");
        // Insert in batches of 1000
        const BATCH_SIZE = 1000;
        for (let i = 0; i < codeDocuments.length; i += BATCH_SIZE) {
            const batch = codeDocuments.slice(i, i + BATCH_SIZE);
            await Code.insertMany(batch, { ordered: false });
            console.log(`Inserted ${i + batch.length} / ${codeDocuments.length} codes...`);
        }

        console.log("Operation Complete!");
    } catch (err) {
        console.error("Error occurred:", err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
