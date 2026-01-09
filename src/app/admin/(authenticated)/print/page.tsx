"use client";

import { useEffect, useRef, useState } from 'react';
import QRious from 'qrious';
import { Printer, Filter } from 'lucide-react';

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

export default function PrintPage() {
    const [batches, setBatches] = useState<string[]>([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [codes, setCodes] = useState<any[]>([]);
    const [loadingBatches, setLoadingBatches] = useState(true);
    const [loadingCodes, setLoadingCodes] = useState(false);
    const [cols, setCols] = useState(3); // 3 or 4 columns

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
            const res = await fetch(`/api/admin/codes?batch=${encodeURIComponent(selectedBatch)}&limit=1000`); // Limit for demo
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
                            طباعة البطائق
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">اختر الدفعة لطباعة أكواد الكروت</p>
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

                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">الأعمدة</label>
                            <select
                                className="p-2 border rounded-lg text-sm"
                                value={cols}
                                onChange={(e) => setCols(parseInt(e.target.value))}
                            >
                                <option value={3}>3 أعمدة</option>
                                <option value={4}>4 أعمدة</option>
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
                className={`grid gap-4 print:gap-2 mx-auto`}
                style={{
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    width: '100%'
                }}
            >
                {codes.map((item, index) => (
                    <div
                        key={item._id || index}
                        className="border-2 border-dashed border-gray-300 print:border-gray-800 rounded-lg p-4 flex flex-col items-center justify-center text-center relative break-inside-avoid"
                        style={{ height: '220px' }} // Fixed height for consistency
                    >
                        <h3 className="text-[#004D25] font-bold text-sm mb-2 flex items-center gap-1">
                            <span className="text-[#D4AF37]">👑</span> تاج النقاء
                        </h3>

                        <div className="mb-2">
                            <QRCode value={`https://taj-alnaqa.vercel.app`} size={80} />
                        </div>

                        <div className="bg-gray-100 print:bg-gray-200 px-3 py-1 rounded text-sm font-mono font-bold tracking-widest text-black">
                            {item.code}
                        </div>

                        <p className="text-[10px] text-gray-500 mt-2">
                            امسح الكود للدخول للسحب
                        </p>
                    </div>
                ))}
            </div>

            {codes.length === 0 && !loadingCodes && (
                <div className="text-center py-20 text-gray-400 print:hidden">
                    الرجاء اختيار دفعة وعرض الأكواد
                </div>
            )}

            <style jsx global>{`
          @media print {
             @page { margin: 0.5cm; }
             body { background: white; -webkit-print-color-adjust: exact; }
          }
       `}</style>
        </div>
    );
}
