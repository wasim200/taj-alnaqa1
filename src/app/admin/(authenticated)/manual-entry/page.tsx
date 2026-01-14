'use client';

import { useState } from 'react';
import { UserPlus, Save, AlertCircle, CheckCircle } from 'lucide-react';

export default function ManualEntryPage() {
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const res = await fetch('/api/admin/manual-entry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.success) {
                setStatus({ type: 'success', message: data.message });
                setFormData({ code: '', name: '', phone: '' }); // Reset form
            } else {
                setStatus({ type: 'error', message: data.message });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'حدث خطأ في الاتصال بالخادم' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fadeInUp">
            <header className="bg-white p-6 shadow-sm mb-6 rounded-lg">
                <h1 className="text-2xl font-bold text-[#004D25] flex items-center gap-2">
                    <UserPlus className="w-8 h-8" />
                    إدخال يدوي للمشتركين
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    تسجيل مشترك في السحب يدوياً عن طريق كود الخدش
                </p>
            </header>

            <div className="bg-white p-6 shadow-sm rounded-lg max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Code Input */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            كود الخدش (Code)
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="مثال: FX1234A"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition uppercase"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        />
                    </div>

                    {/* Name Input */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            اسم المشترك الرباعي
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="الاسم الكامل"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    {/* Phone Input */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            رقم الهاتف (يمن موبايل / سبأفون ...)
                        </label>
                        <input
                            type="tel"
                            required
                            placeholder="7xxxxxxxx"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition text-left"
                            dir="ltr"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className={`p-4 rounded-lg flex items-start gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {status.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                            <p className="text-sm font-medium whitespace-pre-line">{status.message}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#004D25] text-white py-3 rounded-lg font-bold text-lg hover:bg-[#003318] disabled:opacity-50 transition flex items-center justify-center gap-2"
                    >
                        {loading ? 'جاري التسجيل...' : (
                            <>
                                <Save className="w-5 h-5" />
                                تسجيل المشترك
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
