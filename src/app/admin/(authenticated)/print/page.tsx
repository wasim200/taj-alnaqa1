"use client";

import { useEffect, useRef, useState } from 'react';
import QRious from 'qrious';
import { Printer } from 'lucide-react';

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
            className="flex flex-col items-center justify-center text-center relative break-inside-avoid"
            style={{
                height: '65mm', // Slightly taller for the droplet point
                width: '100%',
                fontSize: '9px',
                // Using SVG background for the exact droplet shape and border
                backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' viewBox='0 0 200 260' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M 100 5 C 150 80 195 130 195 180 A 95 95 0 0 1 5 180 C 5 130 50 80 100 5 Z' fill='white' stroke='${encodeURIComponent(themeColor)}' stroke-width='5' /%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'contain',
                padding: '25mm 5mm 15mm 5mm', // Padding to push content down from the point
            }}
        >
            <div className="flex flex-col items-center justify-between h-full w-full max-w-[80%] mx-auto pt-4">
                {/* 1. Header */}
                <div className="mb-1">
                    <h3 style={{ color: themeColor }} className="font-extrabold text-[10px] leading-tight">
                        كن أنت الفائز مع
                    </h3>
                    <h3 style={{ color: themeColor }} className="font-extrabold text-[10px] leading-tight">
                        تاج النقاء للمنظفات
                    </h3>
                </div>

                {/* 2. Code */}
                <div className="my-1 w-full flex justify-center">
                    <span className="bg-gray-200 px-4 py-1 rounded-lg text-sm font-mono font-black tracking-widest text-black shadow-inner border border-gray-300 block">
                        {code}
                    </span>
                </div>

                {/* 3. Scratch Instruction */}
                <div className="mb-1">
                    <p className="text-[7px] font-bold leading-tight" style={{ color: 'black' }}>
                        للدخول في السحب اخدش الكود وارسل الرمز
                    </p>
                    <p className="text-[7px] font-bold leading-tight flex items-center justify-center gap-1" style={{ color: 'black' }}>
                        <span>والاسم للرقم</span>
                        <span className="text-[8px]">774987789</span>
                    </p>
                </div>

                {/* 4. QR Code */}
                <div className="">
                    <QRCode value={`https://taj-alnaqa.vercel.app`} size={55} color={themeColor} />
                </div>

                {/* 5. Footer */}
                <p className="text-[7px] font-bold mt-0.5" style={{ color: 'black' }}>
                    للتسجيل التلقائي امسح الباركود
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
            const res = await fetch(`/api/admin/codes?batch=${encodeURIComponent(selectedBatch)}&limit=1000`);
            const data = await res.json();
            if (data.success) {
                setCodes(data.codes);
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
                        <p className="text-gray-500 text-sm mt-1">اختر الدفعة لطباعة أكواد الكروت (20 كرت في الصفحة)</p>
                    </div>

                    <div className="flex flex-wrap items-end gap-3 w-full md:w-auto">
                        <div className="flex-1">
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
                            {loadingCodes ? 'جاري التحميل...' : 'عرض'}
                        </button>

                        <button
                            onClick={handlePrint}
                            disabled={codes.length === 0}
                            className="bg-[#D4AF37] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#AA8C2C] disabled:opacity-50"
                        >
                            طباعة
                        </button>
                    </div>
                </div>
            </header>

            {/* Print Area */}
            <div
                className="grid gap-0 mx-auto print:mx-0 print:w-full"
                style={{
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    width: '100%'
                }}
            >
                {codes.map((item, index) => (
                    <StickerCard key={item._id || index} code={item.code} />
                ))}
            </div>

            {codes.length === 0 && !loadingCodes && (
                <div className="text-center py-20 text-gray-400 print:hidden">
                    الرجاء اختيار دفعة وعرض الأكواد
                </div>
            )}

            <style jsx global>{`
                @media print {
                    @page { 
                        size: A4; 
                        margin: 5mm; 
                    }
                    body { 
                        background: white; 
                        -webkit-print-color-adjust: exact; 
                    }
                    /* Ensure grid flows correctly */
                    .grid {
                        display: grid !important;
                        grid-template-columns: repeat(4, 1fr) !important;
                    }
                }
            `}</style>
        </div>
    );
}
