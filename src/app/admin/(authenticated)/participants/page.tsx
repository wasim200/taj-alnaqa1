"use client";

import { useEffect, useState } from 'react';
import { Users, Search } from 'lucide-react';

interface Participant {
    _id: string;
    name: string;
    phone: string;
    code_entered: string;
    created_at: string;
}

export default function Participants() {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/participants')
            .then(res => res.json())
            .then(data => {
                if (data.success) setParticipants(data.participants);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="animate-fadeInUp">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#004D25]">قائمة المشتركين</h1>
                    <p className="text-gray-500 mt-1">عرض أحدث المشتركين في السحب</p>
                </div>
            </header>

            <div className="glass-card overflow-hidden">
                {/* Search Toolbar (Placeholder) */}
                <div className="p-4 border-b bg-gray-50 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="بحث بالاسم أو الهاتف..."
                            className="w-full pl-4 pr-10 py-2 border rounded-full focus:outline-none focus:ring-1 ring-[#004D25]"
                        />
                        <Search className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">جاري التحميل...</div>
                ) : (
                    <table className="w-full text-right">
                        <thead className="bg-[#004D25] text-white">
                            <tr>
                                <th className="p-4 font-bold">الاسم</th>
                                <th className="p-4 font-bold">الهاتف</th>
                                <th className="p-4 font-bold">الكود المستخدم</th>
                                <th className="p-4 font-bold">تاريخ الاشتراك</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {participants.map((p) => (
                                <tr key={p._id} className="hover:bg-green-50/50 transition">
                                    <td className="p-4 font-bold text-gray-800">{p.name}</td>
                                    <td className="p-4 font-mono text-gray-600" dir="ltr">{p.phone}</td>
                                    <td className="p-4 font-mono font-bold text-[#D4AF37]">{p.code_entered}</td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {new Date(p.created_at).toLocaleString('ar-SA')}
                                    </td>
                                </tr>
                            ))}
                            {participants.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400">لا يوجد مشتركين حتى الآن</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
