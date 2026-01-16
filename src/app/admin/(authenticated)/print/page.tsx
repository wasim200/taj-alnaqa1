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
                className="grid gap-0.5 mx-auto print:mx-0 print:w-full bg-white"
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
