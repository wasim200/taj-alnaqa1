"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { Lock, User } from 'lucide-react';

export default function AdminLogin() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (data.success) {
                router.push('/admin/dashboard');
                Swal.fire({
                    icon: 'success',
                    title: 'تم الدخول بنجاح',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                throw new Error(data.message);
            }

        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'فشل الدخول',
                text: err.message || 'بيانات الدخول غير صحيحة'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-md p-8 animate-fadeInUp">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-[#004D25] mb-2">تسجيل دخول المسؤول</h2>
                    <p className="text-gray-500">لوحة تحكم تاج النقاء</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-[#004D25] font-bold mb-2">اسم المستخدم</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                                required
                            />
                            <User className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[#004D25] font-bold mb-2">كلمة المرور</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                                required
                            />
                            <Lock className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#004D25] text-white font-bold py-3 rounded-lg hover:bg-[#003318] transition flex justify-center items-center gap-2"
                    >
                        {isLoading ? 'جاري الدخول...' : 'تسجيل الدخول'}
                    </button>
                </form>
            </div>
        </div>
    );
}
