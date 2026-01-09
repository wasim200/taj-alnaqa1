"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, Users, Trophy, MagicWand, LogOut } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { name: 'الرئيسية', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'إصدار الأكواد', href: '/admin/generate', icon: MagicWand },
        { name: 'طباعة البطائق', href: '/admin/print', icon: Home }, // Using Home icon as placeholder or Printer
        { name: 'المشتركين', href: '/admin/participants', icon: Users },
        { name: 'السحب', href: '/admin/winner', icon: Trophy },
    ];

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-[#003318] text-white p-6 flex flex-col shrink-0">
                <div className="flex items-center gap-3 mb-10">
                    <Trophy className="text-[#D4AF37] w-8 h-8" />
                    <span className="text-xl font-bold">تاج النقاء</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 p-3 rounded-lg transition ${isActive ? 'bg-white/10 text-[#D4AF37] border-r-4 border-[#D4AF37]' : 'hover:bg-white/5 text-gray-300'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <button className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-900/20 rounded-lg mt-auto transition">
                    <LogOut className="w-5 h-5" />
                    <span>تسجيل خروج</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 overflow-auto">
                {children}
            </main>
        </div>
    );
}
