"use client";

import { useState } from 'react';
import Swal from 'sweetalert2';
import { Wand2, Loader } from 'lucide-react';

export default function GenerateCodes() {
    const [batchName, setBatchName] = useState('');
    const [quantity, setQuantity] = useState(100);
    const [prefix, setPrefix] = useState('FG');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const res = await fetch('/api/admin/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-username': user.username || 'Unknown'
                },
                body: JSON.stringify({ batch_name: batchName, quantity, prefix })
            });
            const data = await res.json();

            if (data.success) {
                Swal.fire({ icon: 'success', title: 'تم التوليد بنجاح', text: data.message });
                setBatchName('');
                setQuantity(100);
            } else {
                throw new Error(data.message);
            }
        } catch (error: any) {
            Swal.fire({ icon: 'error', title: 'خطأ', text: error.message || 'حدث خطأ غير متوقع' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fadeInUp max-w-2xl mx-auto">
            <div className="glass-card p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#004D25]">
                        <Wand2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#004D25]">إصدار أكواد جديدة</h2>
                    <p className="text-gray-500 mt-2">قم بتوليد دفعة جديدة من الأكواد للطباعة</p>
                </div>

                <form onSubmit={handleGenerate} className="space-y-6">
                    {/* Code Type */}
                    <div>
                        <label className="block text-[#004D25] font-bold mb-2">نوع المنتج (نوع الكود)</label>
                        <select
                            value={prefix}
                            onChange={(e) => setPrefix(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none bg-white"
                        >
                            <option value="FG">منتج صغير (FG - فرصة واحدة)</option>
                            <option value="FX">منتج كبير (FX - ثلاث فرص)</option>
                        </select>
                    </div>

                    {/* Batch Name */}
                    <div>
                        <label className="block text-[#004D25] font-bold mb-2">اسم الدفعة</label>
                        <input
                            type="text"
                            value={batchName}
                            onChange={(e) => setBatchName(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                            placeholder="مثال: دفعة رمضان 1447"
                            required
                        />
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-[#004D25] font-bold mb-2">الكمية المطلوبة</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                            min="1"
                            max="15000"
                            required
                        />
                        <p className="text-xs text-gray-400 mt-1">الحد الأقصى 15,000 كود في المرة الواحدة</p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#004D25] text-white font-bold py-4 rounded-lg hover:bg-[#003318] transition flex justify-center items-center gap-2 shadow-lg disabled:opacity-70"
                    >
                        {isLoading ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                <span>جاري الإصدار...</span>
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-5 h-5" />
                                <span>توليد الأكواد</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
