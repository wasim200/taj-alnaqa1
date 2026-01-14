"use client";

import { useState, useEffect } from 'react';
import { ClipboardList, Clock, Search } from 'lucide-react';

export default function LogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch('/api/admin/logs');
                const data = await res.json();
                if (data.success) {
                    setLogs(data.logs);
                }
            } catch (error) {
                console.error('Error fetching logs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log =>
        log.admin_username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fadeInUp">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-3xl font-bold text-[#004D25] mb-2 flex items-center gap-3">
                        <ClipboardList className="w-8 h-8 text-[#D4AF37]" />
                        سجل النظام
                    </h1>
                    <p className="text-gray-500">متابعة نشاطات الموظفين والعمليات الحساسة</p>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="بحث في السجل..."
                        className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D4AF37] outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">جاري تحميل السجل...</div>
                ) : filteredLogs.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">لا يوجد سجلات حتى الآن</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-[#004D25]/5 text-[#004D25]">
                                <tr>
                                    <th className="p-4 font-bold">المستخدم</th>
                                    <th className="p-4 font-bold">العملية</th>
                                    <th className="p-4 font-bold">التفاصيل</th>
                                    <th className="p-4 font-bold">التوقيت</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredLogs.map(log => (
                                    <tr key={log._id} className="hover:bg-gray-50 transition">
                                        <td className="p-4 font-bold text-gray-800">{log.admin_username}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${log.action === 'LOGIN' ? 'bg-blue-100 text-blue-700' :
                                                    log.action === 'DELETE' ? 'bg-red-100 text-red-700' :
                                                        log.action === 'SYSTEM_RESET' ? 'bg-red-200 text-red-800' :
                                                            'bg-gray-100 text-gray-700'
                                                }`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600 text-sm">{log.details}</td>
                                        <td className="p-4 text-gray-500 text-sm font-mono dir-ltr flex items-center gap-2">
                                            <Clock className="w-3 h-3" />
                                            {new Date(log.created_at).toLocaleString('en-GB')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
