import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Code } from '@/models/Schema';
import { randomBytes } from 'crypto';

function generateRandomCode() {
    const hex = randomBytes(3).toString('hex').toUpperCase();
    return `TAJ-${hex}`;
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { quantity, batch_name } = body;
        const qty = parseInt(quantity);

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
                codesToInsert.add(generateRandomCode());
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

        return NextResponse.json({
            success: true,
            message: `تم توليد ${insertedCount} كود بنجاح في دفعة: ${batch_name}`
        });

    } catch (error) {
        console.error('Generate Error:', error);
        return NextResponse.json({ success: false, message: 'حدث خطأ في الخادم' }, { status: 500 });
    }
}
