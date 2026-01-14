import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Code } from '@/models/Schema';
import { logActivity } from '@/lib/log-activity';
import { randomBytes } from 'crypto';

function generateRandomCode(prefix: string) {
    // Format: FX (Prefix) + 4 Digits + 1 Letter
    // Example: FX1234A
    const digits = Math.floor(1000 + Math.random() * 9000).toString(); // 4 random digits
    const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // 1 random letter A-Z
    return `${prefix}${digits}${letter}`;
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { quantity, batch_name, prefix } = body;
        const qty = parseInt(quantity);

        const validPrefix = prefix === 'FX' ? 'FX' : 'FG'; // Default to FG if invalid

        if (!batch_name || !qty || qty <= 0 || qty > 15000) {
            return NextResponse.json({ success: false, message: 'بيانات غير صحيحة' }, { status: 400 });
        }

        let insertedCount = 0;

        // We will generate in chunks to avoid memory issues and better handle collisions
        const CHUNK_SIZE = 1000;

        while (insertedCount < qty) {
            const remaining = qty - insertedCount;
            const currentBatchSize = Math.min(remaining, CHUNK_SIZE);
            const codesToInsert = new Set<string>();

            // Generate a set of unique codes in memory
            while (codesToInsert.size < currentBatchSize) {
                codesToInsert.add(generateRandomCode(validPrefix));
            }

            const docs = Array.from(codesToInsert).map(code => ({
                code,
                batch_name,
                is_used: false
            }));

            try {
                // ordered: false allows continuing even if duplicates fail
                const result = await Code.insertMany(docs, { ordered: false });
                insertedCount += result.length;
            } catch (error: any) {
                // If some failed due to duplicate key, that's fine, we count successful ones
                if (error.insertedDocs) {
                    insertedCount += error.insertedDocs.length;
                } else {
                    // If completely failed (shouldn't happen with ordered: false usually unless connection drops)
                    console.error("Batch Insert Error", error);
                }
            }
        }

        // Log the activity
        const adminUsername = req.headers.get('x-admin-username') || 'Unknown';
        await logActivity(adminUsername, 'GENERATE_CODES', `تم توليد ${insertedCount} كود (${validPrefix}) - دفعة: ${batch_name}`);

        return NextResponse.json({
            success: true,
            message: `تم توليد ${insertedCount} كود بنجاح (${validPrefix}) في دفعة: ${batch_name}`
        });

    } catch (error) {
        console.error('Generate Error:', error);
        return NextResponse.json({ success: false, message: 'حدث خطأ في الخادم' }, { status: 500 });
    }
}
