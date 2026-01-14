"use client";

import { Users, CreditCard, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCodes: '0',
        usedCodes: '0',
        remainingCodes: '0',
        totalParticipants: '0'
    });

    const [user, setUser] = useState<any>(null);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            const data = await res.json();
            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Failed to fetch stats');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleReset = async () => {
        const result = await Swal.fire({
            title: 'هل أنت متأكد؟',
            text: "سيتم حذف جميع الأكواد والمشتركين من قاعدة البيانات نهائياً! لا يمكن التراجع عن هذا الإجراء.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'نعم، احذف كل شيء!',
            cancelButtonText: 'إلغاء'
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch('/api/admin/reset', {
                    method: 'DELETE',
                    headers: { 'x-admin-username': user?.username || 'Unknown' }
                });
                const data = await res.json();

                if (data.success) {
                    Swal.fire('تم الحذف!', data.message, 'success');
                    fetchStats(); // Refresh stats to show zeros
                } else {
                    Swal.fire('خطأ!', 'فشلت عملية التهيئة', 'error');
                }
            } catch (error) {
                Swal.fire('خطأ!', 'حدث خطأ في الاتصال', 'error');
            }
        }
    };

    const statCards = [
        { label: 'إجمالي الأكواد', value: stats.totalCodes, icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'الأكواد المستخدمة', value: stats.usedCodes, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'المتبقي', value: stats.remainingCodes, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
        { label: 'المشتركين', value: stats.totalParticipants, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    ];

    return (
        <div className="animate-fadeInUp space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-[#004D25]">لوحة القيادة</h1>
                    <p className="text-gray-500 mt-1">مرحباً بك في نظام تاج النقاء</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-bold text-[#004D25]">
                        {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="glass-card p-6 flex flex-col items-center text-center hover:-translate-y-1 transition duration-300">
                        {loading ? (
                            <div className="animate-pulse h-20 w-full bg-gray-200 rounded-lg"></div>
                        ) : (
                            <>
                                <div className={`p-4 rounded-full ${stat.bg} ${stat.color} mb-4`}>
                                    <stat.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-4xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                                <p className="text-gray-500 font-medium">{stat.label}</p>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Danger Zone - Super Admin Only */}
            {user?.role === 'superadmin' && (
                <section className="glass-card p-6 border-t-4 border-red-500">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                                تهيئة النظام
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">إعادة تهيئة النظام وحذف جميع البيانات</p>
                        </div>
                        <button
                            onClick={handleReset}
                            className="bg-red-50 text-red-600 border border-red-200 px-6 py-3 rounded-lg hover:bg-red-600 hover:text-white transition font-bold flex items-center gap-2"
                        >
                            <Trash2 className="w-5 h-5" />
                            إعادة تهيئة قاعدة البيانات
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
}
