"use client";

import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import QRious from 'qrious';
import { Printer, Download, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- Components ---

// Wrapper for QRious
// Wrapper for QRious
function QRCode({ value, size = 100, color = 'black' }: { value: string, size?: number, color?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            new QRious({
                element: canvasRef.current,
                value: value,
                size: size,
                background: 'white',
                foreground: color,
                level: 'H'
            });
        }
    }, [value, size, color]);

    return <canvas ref={canvasRef} width={size} height={size} />;
}

interface StickerCardProps {
    code: string;
}

function StickerCard({ code }: StickerCardProps) {
    // Theme Color based on the provided image (Dark Maroon/Brown)
    const themeColor = '#4a0404'; // Approximate dark red from image

    return (
        <div
            className="flex flex-col items-center justify-center text-center relative break-inside-avoid shadow-sm"
            style={{
                height: '50mm',
                width: '100%',
                fontSize: '8px',
                // Wavy Red Pattern (Using a high-quality radial gradient to simulate "wavy"/texture)
                background: `repeating-radial-gradient(circle at 0 0, transparent 0, #991b1b 7px), repeating-linear-gradient(#b91c1c, #b91c1c)`,
                backgroundColor: '#b91c1c',

                // SVG Overlay (Teardrop)
                backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' viewBox='0 0 200 280' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M 100 5 C 150 80 195 130 195 180 A 95 95 0 0 1 5 180 C 5 130 50 80 100 5 Z' fill='white' stroke='${encodeURIComponent(themeColor)}' stroke-width='5' /%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'contain',
                padding: '12mm 4mm 4mm 4mm',
            }}
        >
            <div className="flex flex-col items-center justify-between h-full w-full max-w-[90%] mx-auto pt-1">
                {/* 1. Header */}
                <div className="mb-0.5">
                    <h3 style={{ color: themeColor }} className="font-extrabold text-[7px] leading-tight">
                        كن أنت الفائز مع
                    </h3>
                    <h3 style={{ color: themeColor }} className="font-extrabold text-[7px] leading-tight">
                        تاج النقاء للمنظفات
                    </h3>
                </div>

                {/* 2. Code */}
                <div className="my-0.5 w-full flex justify-center">
                    <span className="bg-gray-200 px-3 py-0.5 rounded-md text-[8px] font-mono font-black tracking-widest text-black shadow-inner border border-gray-300 block">
                        {code}
                    </span>
                </div>

                {/* 3. Scratch Instruction */}
                <div className="mb-0.5 leading-none">
                    <p className="text-[5px] font-bold leading-tight" style={{ color: 'black' }}>
                        لدخولك السحب اخدش وارسل الرمز
                    </p>
                    <p className="text-[5px] font-bold leading-tight" style={{ color: 'black' }}>
                        والاسم عبر الواتساب للرقم:
                    </p>
                    <p className="text-[6px] font-black mt-0.5 flex items-center justify-center gap-1" dir="ltr" style={{ color: 'black' }}>
                        <span>+967 774987789</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" /></svg>
                    </p>
                </div>

                {/* 4. QR Code */}
                <div className="">
                    <QRCode value={`https://taj-alnaqa.vercel.app`} size={35} color={themeColor} />
                </div>

                {/* 5. Footer */}
                <p className="text-[5px] font-bold mt-0.5" style={{ color: 'black' }}>
                    للتحويل التلقائي امسح QR
                </p>
            </div>
        </div>
    );
}

// --- Main Page ---

export default function PrintPage() {
    const [batches, setBatches] = useState<string[]>([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [codes, setCodes] = useState<any[]>([]);
    const [printRange, setPrintRange] = useState({ start: 1, end: 100 });
    const [loadingBatches, setLoadingBatches] = useState(true);
    const [loadingCodes, setLoadingCodes] = useState(false);

    // Fixed columns for A4
    const cols = 4;

    // Fetch Batches
    useEffect(() => {
        fetch('/api/admin/batches')
            .then(res => res.json())
            .then(data => {
                if (data.success) setBatches(data.batches);
            })
            .finally(() => setLoadingBatches(false));
    }, []);

    // Fetch Codes when batch selected
    const loadCodes = async () => {
        if (!selectedBatch) return;
        setLoadingCodes(true);
        try {
            const res = await fetch(`/api/admin/codes?batch=${encodeURIComponent(selectedBatch)}&limit=15000`);
            const data = await res.json();
            if (data.success) {
                setCodes(data.codes);
                // Reset range when loading new codes
                setPrintRange({ start: 1, end: 100 });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingCodes(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadCSV = () => {
        if (!codes.length) return;

        // Create CSV content
        const headers = ['Code', 'Batch', 'Created At'];
        const rows = codes.map(c => [c.code, c.batch_name, new Date(c.created_at).toISOString()]);

        const csvContent = [
            headers.join(','),
            ...rows.map(r => r.join(','))
        ].join('\n');

        // Create Blob and Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `codes_${selectedBatch}_all.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadPDF = async () => {
        const input = document.querySelector('.grid') as HTMLElement;
        if (!input) return;

        // Visual feedback
        const btn = document.getElementById('btn-download-pdf');
        if (btn) btn.innerText = 'جاري المعالجة...';

        try {
            const canvas = await html2canvas(input, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`codes_${selectedBatch}_${printRange.start}-${printRange.end}.pdf`);
        } catch (err) {
            console.error(err);
            alert('حدث خطأ أثناء إنشاء ملف PDF');
        } finally {
            if (btn) btn.innerText = 'تنزيل ملف (PDF)';
        }
    };

    const handleDownloadFullPDF = async () => {
        if (!codes.length) return;

        const btn = document.getElementById('btn-download-full-pdf');
        const originalText = btn ? btn.innerText : 'تحميل الكل (PDF)';
        if (btn) btn.innerText = 'جاري التحضير...';

        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = 210;
            const pageHeight = 297;
            const chunkSize = 20; // 4 cols * 5 rows = 20 items per page (fits well on A4)
            const totalChunks = Math.ceil(codes.length / chunkSize);

            // Create a dedicated container for rendering
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.top = '0';
            container.style.width = '210mm'; // Set to A4 width
            container.style.backgroundColor = 'white';
            document.body.appendChild(container);

            for (let i = 0; i < totalChunks; i++) {
                if (btn) btn.innerText = `جاري المعالجة ${i + 1} / ${totalChunks}`;

                const start = i * chunkSize;
                const end = start + chunkSize;
                const chunk = codes.slice(start, end);

                // Render Chunk
                const root = createRoot(container);

                // We wrap the render in a promise to wait for it
                await new Promise<void>((resolve) => {
                    root.render(
                        <div
                            className="grid"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: '1mm',
                                width: '100%',
                                padding: '5mm', // Margin simulating @page margin
                                backgroundColor: 'white'
                            }}
                        >
                            {chunk.map((item, idx) => (
                                <StickerCard key={item._id || idx} code={item.code} />
                            ))}
                        </div>
                    );
                    // Short timeout to ensure React flushes and paints
                    setTimeout(resolve, 100);
                });

                // Capture
                const canvas = await html2canvas(container, {
                    scale: 2,
                    useCORS: true,
                    logging: false
                });

                const imgData = canvas.toDataURL('image/png');
                const imgHeight = (canvas.height * pageWidth) / canvas.width;

                if (i > 0) pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight);

                // Cleanup current chunk
                root.unmount();
                // Brief pause to let UI breathe
                await new Promise(r => setTimeout(r, 50));
            }

            // Remove container
            document.body.removeChild(container);

            // Save
            pdf.save(`Full_Batch_${selectedBatch}_${codes.length}.pdf`);

        } catch (err) {
            console.error(err);
            alert('حدث خطأ أثناء إنشاء الملف الكامل');
        } finally {
            if (btn) btn.innerText = originalText;
        }
    };

    const handleDownloadFullPDF = async () => {
        if (!codes.length) return;

        const btn = document.getElementById('btn-download-full-pdf');
        const originalText = btn ? btn.innerText : 'تحميل الكل (PDF)';
        if (btn) btn.innerText = 'جاري التحضير...';

        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = 210;
            const pageHeight = 297;
            const chunkSize = 20; // 4 cols * 5 rows = 20 items per page (fits well on A4)
            const totalChunks = Math.ceil(codes.length / chunkSize);

            // Create a dedicated container for rendering
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.top = '0';
            container.style.width = '210mm'; // Set to A4 width
            container.style.backgroundColor = 'white';
            document.body.appendChild(container);

            for (let i = 0; i < totalChunks; i++) {
                if (btn) btn.innerText = `جاري المعالجة ${i + 1} / ${totalChunks}`;

                const start = i * chunkSize;
                const end = start + chunkSize;
                const chunk = codes.slice(start, end);

                // Render Chunk
                const root = createRoot(container);

                // We wrap the render in a promise to wait for it
                await new Promise<void>((resolve) => {
                    root.render(
                        <div
                            className="grid"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: '1mm',
                                width: '100%',
                                padding: '5mm', // Margin simulating @page margin
                                backgroundColor: 'white'
                            }}
                        >
                            {chunk.map((item, idx) => (
                                <StickerCard key={item._id || idx} code={item.code} />
                            ))}
                        </div>
                    );
                    // Short timeout to ensure React flushes and paints
                    setTimeout(resolve, 100);
                });

                // Capture
                const canvas = await html2canvas(container, {
                    scale: 2,
                    useCORS: true,
                    logging: false
                });

                const imgData = canvas.toDataURL('image/png');
                const imgHeight = (canvas.height * pageWidth) / canvas.width;

                if (i > 0) pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight);

                // Cleanup current chunk
                root.unmount();
                // Brief pause to let UI breathe
                await new Promise(r => setTimeout(r, 50));
            }

            // Remove container
            document.body.removeChild(container);

            // Save
            pdf.save(`Full_Batch_${selectedBatch}_${codes.length}.pdf`);

        } catch (err) {
            console.error(err);
            alert('حدث خطأ أثناء إنشاء الملف الكامل');
        } finally {
            if (btn) btn.innerText = originalText;
        }
    };

    const handleNextPage = () => {
        const step = 100;
        const newStart = printRange.end + 1;
        const newEnd = Math.min(codes.length, newStart + step - 1);
        if (newStart <= codes.length) {
            setPrintRange({ start: newStart, end: newEnd });
        }
    };

    const handlePrevPage = () => {
        const step = 100;
        const newStart = Math.max(1, printRange.start - step);
        const newEnd = newStart + step - 1;
        setPrintRange({ start: newStart, end: newEnd });
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Controls - Hidden during print */}
            <header className="print:hidden bg-white p-6 shadow-sm mb-6 rounded-lg animate-fadeInUp">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#004D25] flex items-center gap-2">
                            <Printer className="w-6 h-6" />
                            طباعة الكروت
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            تم تحديد <b>200</b> كرت في كل دفعة طباعة لتجنب التعليق.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-end gap-3 w-full md:w-auto">
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-xs font-bold text-gray-500 mb-1">اختر الدفعة</label>
                            <select
                                className="w-full p-2 border rounded-lg text-sm"
                                value={selectedBatch}
                                onChange={(e) => setSelectedBatch(e.target.value)}
                            >
                                <option value="">-- اختر --</option>
                                {batches.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>

                        <button
                            onClick={loadCodes}
                            disabled={!selectedBatch || loadingCodes}
                            className="bg-[#004D25] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#003318] disabled:opacity-50"
                        >
                            {loadingCodes ? 'جاري التحميل...' : 'جلب الأكواد'}
                        </button>

                        {/* Pagination Controls */}
                        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border">
                            <button
                                onClick={handlePrevPage}
                                disabled={printRange.start <= 1}
                                className="px-3 py-1 bg-white border rounded hover:bg-gray-100 disabled:opacity-50 text-xs font-bold"
                            >
                                السابق
                            </button>

                            <div className="flex items-center gap-2 text-xs font-bold font-mono">
                                <span>{printRange.start}</span>
                                <span>-</span>
                                <span>{printRange.end}</span>
                            </div>

                            <button
                                onClick={handleNextPage}
                                disabled={printRange.end >= codes.length}
                                className="px-3 py-1 bg-white border rounded hover:bg-gray-100 disabled:opacity-50 text-xs font-bold"
                            >
                                التالي
                            </button>
                        </div>

                        <button
                            onClick={handlePrint}
                            disabled={codes.length === 0}
                            className="bg-[#D4AF37] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#AA8C2C] disabled:opacity-50"
                        >
                            طباعة ({Math.max(0, Math.min(codes.length, printRange.end) - printRange.start + 1)})
                        </button>

                        <button
                            id="btn-download-pdf"
                            onClick={handleDownloadPDF}
                            disabled={codes.length === 0}
                            className="bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-800 disabled:opacity-50 flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            تنزيل ملف (PDF)
                        </button>

                        <button
                            onClick={handleDownloadCSV}
                            disabled={codes.length === 0}
                            className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-700 disabled:opacity-50"
                        >
                            ملف (CSV)
                        </button>
                    </div>
                </div>
            </header>

            {/* Print Area */}
            <div
                className="grid gap-0.5 mx-auto print:mx-0 print:w-full bg-white"
                style={{
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    width: '100%'
                }}
            >
                {codes.slice(printRange.start - 1, printRange.end).map((item, index) => (
                    <StickerCard key={item._id || index} code={item.code} />
                ))}
            </div>

            {codes.length === 0 && !loadingCodes && (
                <div className="text-center py-20 text-gray-400 print:hidden">
                    الرجاء اختيار دفعة وجلب الأكواد
                </div>
            )}

            <style jsx global>{`
                .sticker-card-bg {
                    height: 50mm;
                    width: 100%;
                    font-size: 8px;
                    /* Wavy Red Pattern */
                    background: repeating-radial-gradient(circle at 0 0, transparent 0, #991b1b 7px), repeating-linear-gradient(#b91c1c, #b91c1c);
                    background-color: #b91c1c;
                    
                    /* SVG Overlay */
                    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' viewBox='0 0 200 280' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M 100 5 C 150 80 195 130 195 180 A 95 95 0 0 1 5 180 C 5 130 50 80 100 5 Z' fill='white' stroke='%234a0404' stroke-width='5' /%3e%3c/svg%3e");
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: contain;
                    padding: 12mm 4mm 4mm 4mm;
                }

                @media print {
                    @page { 
                        size: A4; 
                        margin: 5mm; 
                    }
                    body { 
                        background-color: white !important; 
                        -webkit-print-color-adjust: exact !important; 
                        print-color-adjust: exact !important;
                    }
                    /* Ensure grid flows correctly */
                    .grid {
                        display: grid !important;
                        grid-template-columns: repeat(4, 1fr) !important;
                        gap: 1mm !important; /* Visual gap for cutting lines */
                        background-color: white !important;
                    }
                }
            `}</style>
        </div>
    );
}
