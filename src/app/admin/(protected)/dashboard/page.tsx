'use client'

import { useState, useEffect } from 'react'
import {
    ShoppingCart, Package, FileText, Users,
    TrendingUp, ArrowRight, ShoppingBag, CreditCard,
    MessageSquare, Quote, Activity, Clock,
    Plus, Layers, ExternalLink, RefreshCcw,
    CheckCircle2, AlertCircle, Loader2
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
    orders: { total: number; new: number; revenue: number }
    posts: { total: number; draft: number }
    contacts: { unread: number }
    products: { total: number }
    quotes: { total: number }
}

interface RecentData {
    orders: any[]
    contacts: any[]
}

export default function EnhancedDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [recent, setRecent] = useState<RecentData | null>(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const fetchDashboardData = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true)
        try {
            const res = await fetch('/api/admin/stats')
            const result = await res.json()
            if (result.success) {
                setStats(result.data.stats)
                setRecent(result.data.recent)
            }
        } catch (error) {
            console.error('Failed to fetch stats', error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-slate-500 font-medium animate-pulse">Đang tải dữ liệu hệ thống...</p>
                </div>
            </div>
        )
    }

    const statCards = [
        {
            label: 'Doanh thu',
            value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats?.orders.revenue || 0),
            subValue: 'Tổng cộng',
            icon: CreditCard,
            color: 'emerald',
            href: '/admin/orders'
        },
        {
            label: 'Đơn hàng mới',
            value: stats?.orders.new || 0,
            subValue: `${stats?.orders.total || 0} tổng cộng`,
            icon: ShoppingCart,
            color: 'blue',
            href: '/admin/orders'
        },
        {
            label: 'Liên hệ chưa đọc',
            value: stats?.contacts.unread || 0,
            subValue: 'Cần phản hồi',
            icon: MessageSquare,
            color: 'orange',
            href: '/admin/contacts'
        },
        {
            label: 'Bài viết',
            value: stats?.posts.total || 0,
            subValue: `${stats?.posts.draft || 0} bản nháp`,
            icon: FileText,
            color: 'indigo',
            href: '/admin/posts'
        }
    ]

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Hệ thống đang hoạt động</span>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Trình quản trị</h1>
                    <p className="text-slate-500 font-medium mt-1">Tổng quan về tình trạng và hoạt động của website.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchDashboardData(true)}
                        disabled={refreshing}
                        className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary transition-all hover:shadow-lg disabled:opacity-50"
                    >
                        <RefreshCcw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                    <Link
                        href="/admin/products/new"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all hover:shadow-sm active:scale-95"
                    >
                        <Plus className="h-4 w-4 text-primary" />
                        <span className="hidden sm:inline">Thêm sản phẩm</span>
                    </Link>
                    <Link
                        href="/admin/posts/new"
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
                    >
                        <FileText className="h-4 w-4" />
                        <span className="hidden sm:inline">Viết bài mới</span>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <Link key={idx} href={stat.href} className="group relative bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden">
                        <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                            <div className="flex items-start justify-between">
                                <div className={`p-4 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform duration-500`}>
                                    <stat.icon size={24} />
                                </div>
                                <div className="text-right">
                                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                                    <div className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <span className="text-xs font-bold text-slate-400">{stat.subValue}</span>
                                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                        {/* Abstract Background element */}
                        <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${stat.color}-50/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
                    </Link>
                ))}
            </div>

            <div className="grid lg:grid-cols-[1fr_400px] gap-8">
                {/* Column 1: Lists */}
                <div className="space-y-8">
                    {/* Recent Orders Section */}
                    <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                    <ShoppingCart size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Đơn hàng mới nhất</h3>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-0.5">Xử lý ngay để tăng sự hài lòng</p>
                                </div>
                            </div>
                            <Link href="/admin/orders" className="p-3 text-slate-400 hover:text-primary transition-all">
                                <ExternalLink size={20} />
                            </Link>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {recent?.orders.map((order: any) => (
                                <div key={order.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                                    <div className="flex items-center gap-5">
                                        <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                                            <ShoppingBag size={24} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-lg">#{order.order_code || order.id.slice(0, 8)}</div>
                                            <div className="text-sm text-slate-500 font-medium">
                                                {order.customer_name} • {new Intl.NumberFormat('vi-VN').format(Number(order.total_amount))}đ
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${order.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            order.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                                                'bg-blue-50 text-blue-600 border-blue-100'
                                            }`}>
                                            {order.status === 'new' ? 'Mới' : order.status === 'processing' ? 'Đang xử lý' :
                                                order.status === 'shipped' ? 'Đang giao' : order.status === 'completed' ? 'Thành công' : 'Đã hủy'}
                                        </span>
                                        <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5">
                                            <Clock size={10} />
                                            {new Date(order.created_at).toLocaleDateString('vi-VN')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!recent?.orders || recent?.orders.length === 0) && (
                                <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-4">
                                    <ShoppingCart size={48} className="opacity-10" />
                                    <p className="font-medium uppercase tracking-widest text-xs">Không có đơn hàng nào</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Contacts Section */}
                    <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                                    <MessageSquare size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Liên hệ khách hàng</h3>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-0.5">Phản hồi sớm để chốt tương tác</p>
                                </div>
                            </div>
                            <Link href="/admin/contacts" className="p-3 text-slate-400 hover:text-primary transition-all">
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                        <div className="grid sm:grid-cols-2 divide-x divide-slate-50">
                            {recent?.contacts.map((contact: any) => (
                                <div key={contact.id} className="p-8 hover:bg-slate-50/50 transition-all flex flex-col justify-between group">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="h-10 w-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm uppercase">
                                                {contact.name.charAt(0)}
                                            </div>
                                            {contact.status === 'unread' && (
                                                <div className="px-2 py-0.5 bg-orange-500 text-white text-[8px] font-bold uppercase rounded-full tracking-tighter shadow-lg shadow-orange-500/20">Mới</div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 line-clamp-1">{contact.name}</div>
                                            <div className="text-xs text-slate-400 font-bold truncate">{contact.email}</div>
                                        </div>
                                        <p className="text-sm text-slate-600 font-medium line-clamp-2 italic">"{contact.message}"</p>
                                    </div>
                                    <Link href="/admin/contacts" className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:underline">
                                        Xem chi tiết <ArrowRight size={14} />
                                    </Link>
                                </div>
                            ))}
                            {(!recent?.contacts || recent?.contacts.length === 0) && (
                                <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-4 col-span-2">
                                    <MessageSquare size={48} className="opacity-10" />
                                    <p className="font-medium uppercase tracking-widest text-xs">Không có tin nhắn nào</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Column 2: Status & Quick Tasks */}
                <div className="space-y-8">
                    {/* Website Status */}
                    <div className="bg-slate-900 rounded-[40px] p-8 shadow-2xl text-white space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold uppercase tracking-tighter">Trạng thái Web</h3>
                            <Activity className="text-emerald-400" size={20} />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 size={18} className="text-emerald-400" />
                                    <span className="text-sm font-bold opacity-80">Supabase DB</span>
                                </div>
                                <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">Ổn định</span>
                            </div>
                            <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 size={18} className="text-emerald-400" />
                                    <span className="text-sm font-bold opacity-80">PayOS API</span>
                                </div>
                                <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">Đang chạy</span>
                            </div>
                            <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <AlertCircle size={18} className="text-amber-400" />
                                    <span className="text-sm font-bold opacity-80">Media Storage</span>
                                </div>
                                <span className="text-[10px] font-bold uppercase text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full">Gần đầy</span>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                            <Link href="/">
                                <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 transition-all rounded-[20px] font-bold text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95">
                                    Check Live Site
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Pro Tips / Stats Summary */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[40px] p-8 text-white space-y-6 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="p-3 bg-white/10 rounded-2xl w-fit mb-4">
                                <TrendingUp size={24} />
                            </div>
                            <h3 className="text-2xl font-bold tracking-tight mb-2">Thống kê nâng cao</h3>
                            <p className="text-white/60 text-sm font-medium leading-relaxed mb-6">Bạn có <span className="text-white font-bold">{stats?.quotes.total || 0} yêu cầu báo giá</span> mới đang chờ xử lý.</p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-black/10 p-4 rounded-3xl border border-white/5">
                                    <div className="text-lg font-bold">{stats?.products.total || 0}</div>
                                    <div className="text-[10px] font-bold uppercase opacity-50 tracking-widest">Sản phẩm</div>
                                </div>
                                <div className="bg-black/10 p-4 rounded-3xl border border-white/5">
                                    <div className="text-lg font-bold">{stats?.quotes.total || 0}</div>
                                    <div className="text-[10px] font-bold uppercase opacity-50 tracking-widest">Báo giá</div>
                                </div>
                            </div>
                        </div>
                        {/* Blob */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                    </div>
                </div>
            </div>
        </div>
    )
}
