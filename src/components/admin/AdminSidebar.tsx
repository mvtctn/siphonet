'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Users, Settings, Tag, FileText, Layers, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export function AdminSidebar() {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    const navItems = [
        { href: '/admin/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
        { href: '/admin/products', label: 'Sản phẩm', icon: Package },
        { href: '/admin/categories', label: 'Danh mục', icon: Tag },
        { href: '/admin/posts', label: 'Bài viết (Blog)', icon: FileText },
        { href: '/admin/pages', label: 'Trang tĩnh', icon: Layers },
        { href: '/admin/users', label: 'Người dùng', icon: Users },
        { href: '/admin/settings', label: 'Cấu hình Web', icon: Settings },
    ]

    return (
        <aside
            className={`hidden md:flex flex-col bg-slate-900 text-slate-300 transition-all duration-300 border-r border-slate-800 ${collapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Header */}
            <div className={`h-16 flex items-center ${collapsed ? 'justify-center' : 'px-6'} border-b border-slate-800`}>
                {collapsed ? (
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white">S</div>
                ) : (
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        Siphonet <span className="text-primary">Admin</span>
                    </h2>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${isActive
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'hover:bg-slate-800 hover:text-white'
                                }`}
                            title={collapsed ? item.label : ''}
                        >
                            <item.icon size={22} className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} transition-colors`} />
                            {!collapsed && <span className="font-medium">{item.label}</span>}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer Toggle */}
            <div className="p-4 border-t border-slate-800 flex justify-end">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>
        </aside>
    )
}
