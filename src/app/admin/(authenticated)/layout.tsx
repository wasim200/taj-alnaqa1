"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, Users, Trophy, Wand2, LogOut, UserPlus } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { name: 'الرئيسية', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'إصدار الأكواد', href: '/admin/generate', icon: Wand2 },
        { name: 'طباعة الكروت', href: '/admin/print', icon: Home },
        { name: 'إدخال يدوي', href: '/admin/manual-entry', icon: UserPlus }, // New Feature
        { name: 'المشتركين', href: '/admin/participants', icon: Users },
        { name: 'السحب', href: '/admin/winner', icon: Trophy },
    ];

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/logout', { method: 'POST' });
            window.location.href = '/admin/login';
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

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

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-900/20 rounded-lg mt-auto transition w-full"
                >
                    <LogOut className="w-5 h-5" />
                    <span>تسجيل خروج</span>
                </button>

                <div className="mt-8 pt-4 border-t border-[#D4AF37]/20 text-center text-xs text-gray-400">
                    <p className="mb-1">&copy; {new Date().getFullYear()} تاج النقاء</p>
                    <p className="text-[10px]">
                        تطوير وتكويد: <a href="https://wa.me/967781911651" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors">جلامور ديزاين</a>
                    </p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 overflow-auto">
                {children}
            </main>
        </div >
    );
}
