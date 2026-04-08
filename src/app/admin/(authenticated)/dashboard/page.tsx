"use client";

import { Users, CreditCard, CheckCircle, Clock, Trash2, Download, Upload } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
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

    const triggerRestore = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const result = await Swal.fire({
            title: 'تحذير هام جداً!',
            text: 'استعادة النسخة الاحتياطية ستقوم بحذف جميع البيانات الحالية واستبدالها ببيانات الملف المرفوع! هل أنت متأكد؟',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'نعم، قم بالاستعادة!',
            cancelButtonText: 'إلغاء'
        });

        if (result.isConfirmed) {
            setIsRestoring(true);
            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await fetch('/api/admin/restore', {
                    method: 'POST',
                    headers: { 'x-admin-username': user?.username || 'Unknown' },
                    body: formData
                });

                const data = await res.json();
                if (data.success) {
                    await Swal.fire('نجاح!', 'تم استعادة النظام من النسخة الاحتياطية بنجاح.', 'success');
                    window.location.reload();
                } else {
                    Swal.fire('خطأ!', data.message || 'فشلت الاستعادة', 'error');
                }
            } catch (error) {
                Swal.fire('خطأ!', 'حدث خطأ في الاتصال بالخادم.', 'error');
            } finally {
                setIsRestoring(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        } else {
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleBackup = async () => {
        setIsBackingUp(true);
        try {
            const res = await fetch('/api/admin/backup', {
                method: 'GET',
                headers: { 'x-admin-username': user?.username || 'Unknown' }
            });

            if (!res.ok) throw new Error('فشل النسخ الاحتياطي');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Taj_AlNqaa_Backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            Swal.fire({
                title: 'تم النسخ بنجاح',
                text: 'تم إنشاء وتحميل ملف النسخة الاحتياطية بنجاح.',
                icon: 'success',
                confirmButtonColor: '#004D25',
                confirmButtonText: 'حسناً'
            });

        } catch (error) {
            Swal.fire('خطأ!', 'حدث خطأ أثناء الاتصال ومحاولة اخذ نسخة احتياطية.', 'error');
        } finally {
            setIsBackingUp(false);
        }
    };

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
                    <h1 className="text-4xl font-bold text-[#004D25] mb-2">لوحة القيادة</h1>
                    <p className="text-gray-500 text-lg">يا هلا {user?.username}، مرحباً بك في نظام تاج النقاء</p>
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

            {/* System Management - Backup & Restore */}
            {(user?.role === 'superadmin' || user?.permissions?.includes('system_management')) && (
                <section className="glass-card p-6 border-t-4 border-blue-500">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".json"
                        className="hidden"
                    />
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                إدارة بيانات النظام
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">إنشاء أو استعادة نسخة احتياطية للبيانات (JSON)</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={triggerRestore}
                                disabled={isRestoring || isBackingUp}
                                className="bg-green-50 text-green-600 border border-green-200 px-6 py-3 rounded-lg hover:bg-green-600 hover:text-white transition font-bold flex items-center gap-2 disabled:opacity-50"
                            >
                                <Upload className="w-5 h-5" />
                                {isRestoring ? 'جاري الاستعادة...' : 'استعادة نسخة احتياطية'}
                            </button>

                            <button
                                onClick={handleBackup}
                                disabled={isRestoring || isBackingUp}
                                className="bg-blue-50 text-blue-600 border border-blue-200 px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition font-bold flex items-center gap-2 disabled:opacity-50"
                            >
                                <Download className="w-5 h-5" />
                                {isBackingUp ? 'جاري السحب...' : 'نسخ احتياطي (JSON)'}
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* Danger Zone - Super Admin Only */}
            {user?.role === 'superadmin' && (
                <section className="glass-card p-6 border-t-4 border-red-500 mt-6">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                                تهيئة النظام (خطر)
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">إعادة تهيئة النظام وحذف جميع البيانات (للمدير العام فقط)</p>
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
