"use client";

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Users, UserPlus, Trash2, Key, Shield } from 'lucide-react';

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'employee',
        permissions: [] as string[]
    });

    const AVAILABLE_PERMISSIONS = [
        { id: 'generate', label: 'إصدار الأكواد' },
        { id: 'print', label: 'طباعة الكروت' },
        { id: 'manual_entry', label: 'إدخال يدوي' },
        { id: 'participants', label: 'عرض المشتركين' },
        { id: 'winner', label: 'إجراء السحب' },
        { id: 'users', label: 'إدارة الموظفين' }
    ];

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id: string, username: string) => {
        const result = await Swal.fire({
            title: 'هل أنت متأكد؟',
            text: `سيتم حذف المستخدم "${username}" نهائياً!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'نعم، احذف',
            cancelButtonText: 'إلغاء'
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`/api/admin/users?id=${id}`, {
                    method: 'DELETE'
                });
                const data = await res.json();

                if (data.success) {
                    Swal.fire('تم الحذف!', 'تم حذف المستخدم بنجاح.', 'success');
                    fetchUsers();
                } else {
                    Swal.fire('خطأ!', data.message, 'error');
                }
            } catch (error) {
                Swal.fire('خطأ!', 'حدث خطأ أثناء الاتصال بالخادم.', 'error');
            }
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                Swal.fire('تم الإضافة!', 'تم إضافة الموظف بنجاح.', 'success');
                setShowForm(false);
                setFormData({ username: '', password: '', role: 'employee', permissions: [] });
                fetchUsers();
            } else {
                Swal.fire('خطأ!', data.message, 'error');
            }
        } catch (error) {
            Swal.fire('خطأ!', 'حدث خطأ أثناء الاتصال بالخادم.', 'error');
        }
    };

    const togglePermission = (permId: string) => {
        setFormData(prev => {
            const perms = prev.permissions.includes(permId)
                ? prev.permissions.filter(p => p !== permId)
                : [...prev.permissions, permId];
            return { ...prev, permissions: perms };
        });
    };

    return (
        <div className="animate-fadeInUp">
            <header className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-3xl font-bold text-[#004D25] mb-2 flex items-center gap-3">
                        <Users className="w-8 h-8 text-[#D4AF37]" />
                        إدارة الموظفين
                    </h1>
                    <p className="text-gray-500">إضافة حسابات الموظفين وتحديد صلاحياتهم</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-[#004D25] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#003318] transition flex items-center gap-2"
                >
                    <UserPlus className="w-5 h-5" />
                    {showForm ? 'إلغاء' : 'إضافة موظف جديد'}
                </button>
            </header>

            {/* Create Form */}
            {showForm && (
                <div className="glass-card p-8 mb-8 animate-scaleIn bg-white rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold text-[#004D25] mb-6 flex items-center gap-2">
                        <UserPlus className="w-6 h-6" />
                        بيانات الموظف الجديد
                    </h3>
                    <form onSubmit={handleCreate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">اسم المستخدم</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">كلمة المرور</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-bold mb-3 flex items-center gap-2">
                                <Key className="w-5 h-5 text-[#D4AF37]" />
                                الصلاحيات المسموحة
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {AVAILABLE_PERMISSIONS.map(perm => (
                                    <label key={perm.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition border border-gray-200">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 text-[#004D25] rounded focus:ring-[#D4AF37]"
                                            checked={formData.permissions.includes(perm.id)}
                                            onChange={() => togglePermission(perm.id)}
                                        />
                                        <span className="text-gray-700 font-medium">{perm.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-6 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
                            >
                                إلغاء
                            </button>
                            <button
                                type="submit"
                                className="bg-[#D4AF37] text-white px-8 py-2 rounded-lg font-bold hover:bg-[#B5952F] transition shadow-md"
                            >
                                حفظ المستخدم
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-bold text-gray-700">قائمة المستخدمين في النظام</h3>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">جاري التحميل...</div>
                ) : users.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">لا يوجد موظفين حالياً</div>
                ) : (
                    <table className="w-full text-right">
                        <thead className="bg-[#004D25]/5 text-[#004D25]">
                            <tr>
                                <th className="p-4 font-bold">اسم المستخدم</th>
                                <th className="p-4 font-bold">الدور</th>
                                <th className="p-4 font-bold">الصلاحيات</th>
                                <th className="p-4 font-bold">تاريخ الإنشاء</th>
                                <th className="p-4 font-bold text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map(user => (
                                <tr key={user._id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 font-bold text-gray-800">{user.username}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'superadmin'
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {user.role === 'superadmin' ? 'مدير عام' : 'موظف'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-1">
                                            {user.role === 'superadmin' ? (
                                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded textxs font-medium">الكل</span>
                                            ) : user.permissions.length > 0 ? (
                                                user.permissions.map((p: string) => (
                                                    <span key={p} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] border border-gray-200">
                                                        {AVAILABLE_PERMISSIONS.find(ap => ap.id === p)?.label || p}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 text-xs">-</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-500 text-sm font-mono dir-ltr">
                                        {new Date(user.created_at).toLocaleDateString('en-GB')}
                                    </td>
                                    <td className="p-4 text-center">
                                        {user.username !== 'admin' && ( // Prevent deleting main admin
                                            <button
                                                onClick={() => handleDelete(user._id, user.username)}
                                                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition"
                                                title="حذف"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
