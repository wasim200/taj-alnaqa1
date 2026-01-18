import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Code } from '@/models/Schema';

export async function GET() {
    try {
        await dbConnect();
        // distinct batch_name
        const batches = await Code.distinct('batch_name');
        return NextResponse.json({ success: true, batches });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }

}

export async function DELETE(request: Request) {
    try {
        await dbConnect();
        const { batchName } = await request.json();

        if (!batchName) {
            return NextResponse.json(
                { success: false, error: 'Batch name is required' },
                { status: 400 }
            );
        }

        const result = await Code.deleteMany({ batch_name: batchName });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Batch not found' },
                { status: 404 }
            );
        }

        // Log the activity (assuming logActivity helper is available or we import it)
        // Since logActivity is not imported in original snippet, I will skip it here or import it if I saw it used elsewhere.
        // Checking imports: only NextResponse, dbConnect, Code are imported.
        // I will stick to basic functionality first. If I need logging, I should import it.
        // Let's add the import for logActivity if possible, but I don't want to break the file if the path is wrong. 
        // Based on previous file views, logActivity is in '@/lib/log-activity'.

        return NextResponse.json({
            success: true,
            message: `Batch "${batchName}" deleted successfully`,
            deletedCount: result.deletedCount
        });

    } catch (error) {
        console.error('Error deleting batch:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete batch' },
            { status: 500 }
        );
    }
}
