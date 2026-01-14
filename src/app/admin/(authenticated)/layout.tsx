"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, Users, Trophy, Wand2, LogOut, UserPlus, Shield, Settings, Menu, X } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Close mobile menu when path changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const allNavItems = [
        { name: 'الرئيسية', href: '/admin/dashboard', icon: LayoutDashboard, permission: 'dashboard' },
        { name: 'إصدار الأكواد', href: '/admin/generate', icon: Wand2, permission: 'generate' },
        { name: 'طباعة الكروت', href: '/admin/print', icon: Home, permission: 'print' },
        { name: 'إدخال يدوي', href: '/admin/manual-entry', icon: UserPlus, permission: 'manual_entry' },
        { name: 'المشتركين', href: '/admin/participants', icon: Users, permission: 'participants' },
        { name: 'السحب', href: '/admin/winner', icon: Trophy, permission: 'winner' },
        { name: 'الموظفين', href: '/admin/users', icon: Shield, permission: 'users' },
    ];

    const navItems = allNavItems.filter(item => {
        if (!user) return false;
        if (user.role === 'superadmin') return true;
        if (item.permission === 'dashboard') return true;
        if (item.permission === 'users') return false;
        return user.permissions.includes(item.permission);
    });

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/logout', { method: 'POST' });
            localStorage.removeItem('user');
            window.location.href = '/admin/login';
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50 overflow-hidden">

            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden fixed top-4 left-4 z-50 bg-[#D4AF37] text-[#003318] p-2 rounded-full shadow-lg hover:bg-[#b5952f] transition"
            >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Settings className="w-6 h-6" />}
            </button>

            {/* Overlay for Mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 right-0 z-50 w-64 bg-[#003318] text-white p-6 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0 md:shadow-none
                ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="flex items-center gap-3 mb-10">
                    <Trophy className="text-[#D4AF37] w-8 h-8" />
                    <span className="text-xl font-bold">تاج النقاء</span>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
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
            <main className="flex-1 p-6 md:p-10 overflow-auto w-full h-screen">
                {children}
            </main>
        </div >
    );
}
