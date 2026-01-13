"use client";

import { useEffect, useRef, useState } from 'react';
import QRious from 'qrious';
import { Printer } from 'lucide-react';

// --- Components ---

// Wrapper for QRious
function QRCode({ value, size = 100 }: { value: string, size?: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            new QRious({
                element: canvasRef.current,
                value: value,
                size: size,
                background: 'white',
                foreground: 'black',
                level: 'H'
            });
        }
    }, [value, size]);

    return <canvas ref={canvasRef} width={size} height={size} />;
}

interface StickerCardProps {
    code: string;
}

function StickerCard({ code }: StickerCardProps) {
    return (
        <div
            className="border border-dashed border-gray-300 print:border-gray-400 p-2 flex flex-col items-center justify-between text-center relative break-inside-avoid overflow-hidden"
            style={{
                height: '52mm',
                width: '100%',
                fontSize: '9px'
            }}
        >
            {/* 1. Header */}
            <h3 className="text-[#004D25] font-bold text-[8px] leading-tight w-full">
                كن أنت الفائز مع تاج النقاء للمنظفات
            </h3>

            {/* 2. Code */}
            <div className="my-[1px]">
                <span className="bg-gray-100 print:bg-gray-200 px-2 py-0.5 rounded text-xs font-mono font-black tracking-widest text-black border border-black/20">
                    {code}
                </span>
            </div>

            {/* 3. Scratch Instruction */}
            {/* 3. Scratch Instruction */}
            <p className="text-[7px] text-gray-700 font-bold leading-tight px-1 flex items-center justify-center gap-1 flex-wrap">
                <span>للدخول في السحب اخدش الكود وارسل الرمز والاسم عبر الواتساب للرقم:</span>
                <span className="flex items-center gap-0.5 dir-ltr">
                    <svg viewBox="0 0 24 24" width="10" height="10" fill="#25D366" xmlns="http://www.w3.org/2000/svg"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.654-.696c1.025.558 1.987.896 3.129.896 3.183 0 5.768-2.587 5.768-5.766-.001-3.18-2.585-5.768-5.766-5.768zm0 10.154c-1.028 0-1.782-.284-2.553-.788l-1.636.429.438-1.594c-.585-.86-1.129-1.89-1.129-2.922 0-2.43 1.977-4.406 4.407-4.406 2.43 0 4.406 1.977 4.406 4.406 0 2.429-1.976 4.406-4.406 4.406z" /></svg>
                    774987789
                </span>
            </p>

            {/* 5. Footer (Moved Up) */}
            <p className="text-[7px] text-gray-600 font-bold mt-1 mb-0.5">
                للتسجيل التلقائي امسح الباركود
            </p>

            {/* 4. QR Code */}
            <div className="">
                <QRCode value={`https://taj-alnaqa.vercel.app`} size={60} />
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
