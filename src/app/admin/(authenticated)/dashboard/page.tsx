"use client";

import { Users, CreditCard, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard() {
    // Static data for now, will replace with API call
    const stats = [
        { label: 'إجمالي الأكواد', value: '15,000', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'الأكواد المستخدمة', value: '8,420', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'المتبقي', value: '6,580', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
        { label: 'المشتركين', value: '3,200', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    ];

    return (
        <div className="animate-fadeInUp">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#004D25]">لوحة القيادة</h1>
                    <p className="text-gray-500 mt-1">مرحباً بك في نظام تاج النقاء</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-bold text-[#004D25]">
                    {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="glass-card p-6 flex flex-col items-center text-center hover:-translate-y-1 transition duration-300">
                        <div className={`p-4 rounded-full ${stat.bg} ${stat.color} mb-4`}>
                            <stat.icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-4xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                        <p className="text-gray-500 font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions or Charts could go here */}
            <section className="glass-card p-6">
                <h3 className="text-xl font-bold text-[#004D25] mb-4 border-b pb-2">آخر النشاطات</h3>
                <p className="text-gray-400 text-center py-8">لا توجد نشاطات حديثة لعرضها حالياً</p>
            </section>
        </div>
    );
}
