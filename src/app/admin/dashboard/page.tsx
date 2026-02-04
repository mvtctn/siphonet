'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    LayoutDashboard,
    Package,
    FolderTree,
    FileText,
    Users,
    Settings,
    LogOut,
    TrendingUp,
    ShoppingCart,
    DollarSign,
    Eye,
    Menu,
    X,
    Bell,
    Search
} from 'lucide-react'

export default function AdminDashboard() {
    const router = useRouter()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('admin_token')
        if (!token) {
            router.push('/dangnhapadmin')
        }
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('admin_token')
        router.push('/dangnhapadmin')
    }

    const stats = [
        {
            label: 'Tổng doanh thu',
            value: '1,245,000,000 đ',
            change: '+12.5%',
            icon: DollarSign,
            color: 'from-green-500 to-emerald-600'
        },
        {
            label: 'Đơn hàng mới',
            value: '156',
            change: '+8.2%',
            icon: ShoppingCart,
            color: 'from-blue-500 to-cyan-600'
        },
        {
            label: 'Sản phẩm',
            value: '342',
            change: '+24',
            icon: Package,
            color: 'from-purple-500 to-pink-600'
        },
        {
            label: 'Lượt truy cập',
            value: '12,543',
            change: '+18.7%',
            icon: Eye,
            color: 'from-orange-500 to-red-600'
        }
    ]

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard', active: true },
        { icon: Package, label: 'Sản phẩm', href: '/admin/products' },
        { icon: FolderTree, label: 'Danh mục', href: '/admin/categories' },
        { icon: ShoppingCart, label: 'Đơn hàng', href: '/admin/orders', badge: '5' },
        { icon: FileText, label: 'Báo giá', href: '/admin/quotes', badge: '12' },
        { icon: Users, label: 'Khách hàng', href: '/admin/customers' },
        { icon: Settings, label: 'Cài đặt', href: '/admin/settings' }
    ]

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full bg-gradient-to-b from-primary to-cyan-800 text-white transition-all duration-300 z-40 ${isSidebarOpen ? 'w-64' : 'w-20'
                }`}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
                    {isSidebarOpen && (
                        <h1 className="text-xl font-bold">Siphonet Admin</h1>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active
                                    ? 'bg-white/20 shadow-lg'
                                    : 'hover:bg-white/10'
                                }`}
                        >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            {isSidebarOpen && (
                                <>
                                    <span className="flex-1">{item.label}</span>
                                    {item.badge && (
                                        <span className="px-2 py-0.5 bg-accent rounded-full text-xs font-bold">
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Logout */}
                <div className="absolute bottom-4 left-0 right-0 px-4">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all"
                    >
                        <LogOut className="h-5 w-5 flex-shrink-0" />
                        {isSidebarOpen && <span>Đăng xuất</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Top Bar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <Bell className="h-5 w-5 text-slate-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-slate-900">Admin User</p>
                                <p className="text-xs text-slate-500">admin@siphonet.com</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="p-6">
                    {/* Welcome */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Chào mừng trở lại!</h1>
                        <p className="text-slate-600">Tổng quan hoạt động hệ thống</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl`}>
                                        <stat.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                                        <TrendingUp className="h-4 w-4" />
                                        {stat.change}
                                    </span>
                                </div>
                                <p className="text-slate-600 text-sm mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Recent Activity */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Recent Orders */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">Đơn hàng gần đây</h2>
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <ShoppingCart className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">DH-2024-{1000 + i}</p>
                                                <p className="text-xs text-slate-500">Khách hàng {i}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-900">{(Math.random() * 50 + 10).toFixed(1)}M đ</p>
                                            <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                                Đã xác nhận
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Products */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">Sản phẩm bán chạy</h2>
                            <div className="space-y-3">
                                {['Bơm ly tâm CR', 'Hệ thống RO', 'Biến tần Schneider', 'Van điện từ ASCO', 'Bộ lọc nước'].map((product, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <Package className="h-5 w-5 text-purple-600" />
                                            </div>
                                            <p className="font-semibold text-slate-900">{product}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-900">{Math.floor(Math.random() * 50 + 10)} đã bán</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
