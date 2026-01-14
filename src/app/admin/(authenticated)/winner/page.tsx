"use client";

import { useState } from 'react';
import { Trophy, Gift, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WinnerPage() {
    const [winner, setWinner] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDraw = async () => {
        setLoading(true);
        setError('');
        setWinner(null);

        // Simulated suspense delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const res = await fetch('/api/admin/winner', {
                headers: { 'x-admin-username': user.username || 'Unknown' }
            });
            const data = await res.json();

            if (data.success) {
                setWinner(data.winner);
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#D4AF37', '#004D25', '#ffffff']
                });
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('حدث خطأ أثناء الاتصال بالخادم');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fadeInUp flex flex-col items-center justify-center min-h-[60vh] text-center">

            <header className="mb-12">
                <h1 className="text-4xl font-bold text-[#004D25] mb-2 flex items-center gap-3 justify-center">
                    <Trophy className="w-10 h-10 text-[#D4AF37]" />
                    سحب الفائزين
                </h1>
                <p className="text-gray-500">اضغط على الزر أدناه لاختيار فائز عشوائي من المشتركين</p>
            </header>

            <div className="glass-card p-12 w-full max-w-2xl bg-white/50 backdrop-blur-xl border border-white/20 shadow-xl rounded-3xl relative overflow-hidden">

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#004D25] via-[#D4AF37] to-[#004D25]"></div>

                {winner ? (
                    <div className="animate-scaleIn">
                        <div className="w-24 h-24 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Sparkles className="w-12 h-12 text-[#D4AF37]" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-400 mb-2">الفائز هو</h2>
                        <h3 className="text-5xl font-black text-[#004D25] mb-4 drop-shadow-sm">{winner.name}</h3>
                        <div className="inline-block bg-[#004D25] text-white px-6 py-2 rounded-full font-mono text-xl tracking-widest dir-ltr">
                            {winner.phone}
                        </div>
                        <div className="mt-8 pt-8 border-t border-gray-100 flex justify-center gap-8">
                            <div>
                                <p className="text-sm text-gray-400">الكود الفائز</p>
                                <p className="font-bold text-gray-700 font-mono text-lg">{winner.code}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">تاريخ الاشتراك</p>
                                <p className="font-bold text-gray-700">
                                    {new Date(winner.date).toLocaleDateString('ar-SA')}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-10">
                        <Gift className={`w-32 h-32 mx-auto text-gray-200 mb-6 transition duration-1000 ${loading ? 'animate-bounce text-[#D4AF37]' : ''}`} />
                        {error ? (
                            <p className="text-red-500 font-bold text-lg bg-red-50 py-2 px-4 rounded-lg inline-block">{error}</p>
                        ) : (
                            <p className="text-gray-400 text-lg">جاهز للسحب؟</p>
                        )}
                    </div>
                )}
            </div>

            <button
                onClick={handleDraw}
                disabled={loading}
                className="mt-10 bg-gradient-to-r from-[#D4AF37] to-[#B5952F] text-white text-xl font-bold py-4 px-12 rounded-full shadow-lg shadow-[#D4AF37]/40 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-3"
            >
                {loading ? 'جارٍ السحب...' : 'سحب فائز عشوائي 🎲'}
            </button>
        </div>
    );
}
