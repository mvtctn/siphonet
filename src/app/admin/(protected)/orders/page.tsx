
'use client'

import { useEffect, useState } from 'react'
import { useOrderStore, Order } from '@/store/useOrderStore'
import {
    Search,
    Filter,
    Download,
    MoreHorizontal,
    Eye,
    CheckCircle2,
    Clock,
    Truck,
    XCircle,
    ShoppingBag,
    CreditCard,
    ArrowUpRight,
    Loader2,
    Calendar,
    ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export default function OrdersPage() {
    const { orders, isLoading, fetchOrders } = useOrderStore()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    useEffect(() => {
        fetchOrders()
    }, [])

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customerPhone.includes(searchQuery)

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const stats = [
        {
            label: 'Tổng đơn hàng',
            value: orders.length,
            icon: ShoppingBag,
            color: 'blue'
        },
        {
            label: 'Đang xử lý',
            value: orders.filter(o => o.status === 'processing' || o.status === 'new').length,
            icon: Clock,
            color: 'orange'
        },
        {
            label: 'Chờ thanh toán',
            value: orders.filter(o => o.paymentStatus === 'pending').length,
            icon: CreditCard,
            color: 'amber'
        },
        {
            label: 'Đã hoàn thành',
            value: orders.filter(o => o.status === 'completed').length,
            icon: CheckCircle2,
            color: 'emerald'
        }
    ]

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            new: 'bg-blue-50 text-blue-600 border-blue-100',
            processing: 'bg-orange-50 text-orange-600 border-orange-100',
            shipped: 'bg-indigo-50 text-indigo-600 border-indigo-100',
            completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            cancelled: 'bg-rose-50 text-rose-600 border-rose-100'
        }
        const labels: Record<string, string> = {
            new: 'Mới',
            processing: 'Đang xử lý',
            shipped: 'Đang giao',
            completed: 'Đã xong',
            cancelled: 'Đã hủy'
        }
        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
                {labels[status]}
            </span>
        )
    }

    const getPaymentBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-amber-50 text-amber-600 border-amber-100',
            paid: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            failed: 'bg-rose-50 text-rose-600 border-rose-100',
            cancelled: 'bg-slate-50 text-slate-500 border-slate-100'
        }
        const labels: Record<string, string> = {
            pending: 'Chờ thanh toán',
            paid: 'Đã thanh toán',
            failed: 'Thất bại',
            cancelled: 'Đã hủy'
        }
        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
                {labels[status]}
            </span>
        )
    }

    if (isLoading && orders.length === 0) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Quản lý Đơn hàng</h1>
                    <p className="text-slate-500 mt-1">Theo dõi và xử lý đơn đặt hàng từ khách hàng.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-bold text-sm shadow-sm active:scale-95">
                        <Download className="h-4 w-4" />
                        Xuất báo cáo
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Tuần này</span>
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                        <div className="text-xs font-medium text-slate-500 mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                {/* Search & Filters */}
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm mã đơn, tên hoặc SĐT khách..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
                        <div className="flex bg-slate-200/50 p-1 rounded-xl">
                            {['all', 'new', 'processing', 'shipped', 'completed'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all capitalize ${statusFilter === status
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {status === 'all' ? 'Tất cả' : status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="text-left bg-slate-50/10 border-b border-slate-100">
                                <th className="pl-8 pr-4 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Đơn hàng</th>
                                <th className="px-4 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Khách hàng</th>
                                <th className="px-4 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Thanh toán</th>
                                <th className="px-4 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Tổng cộng</th>
                                <th className="px-4 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Ngày đặt</th>
                                <th className="px-4 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Trạng thái</th>
                                <th className="pl-4 pr-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="pl-8 pr-4 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 text-sm tracking-tight group-hover:text-primary transition-colors">
                                                    #{order.orderCode}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                                                    {order.paymentMethod}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-700 text-sm capitalize">{order.customerName}</span>
                                                <span className="text-xs text-slate-400">{order.customerPhone}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5">
                                            {getPaymentBadge(order.paymentStatus)}
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className="font-bold text-slate-900 text-sm">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.totalAmount))}
                                            </span>
                                        </td>
                                        <td className="px-4 py-5">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Calendar className="h-3.5 w-3.5 text-slate-300" />
                                                <span className="text-xs font-medium">
                                                    {format(new Date(order.createdAt), 'dd MMM yyyy', { locale: vi })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5 text-center">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="pl-4 pr-8 py-5 text-right">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="inline-flex items-center justify-center p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-primary hover:text-white transition-all group/btn active:scale-90"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="bg-slate-50 p-6 rounded-full mb-4">
                                                <ShoppingBag className="h-10 w-10 text-slate-200" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900">Không tìm thấy đơn hàng nào</h3>
                                            <p className="text-slate-400 max-w-xs mt-1">Hệ thống chưa ghi nhận đơn hàng nào khớp với yêu cầu của bạn.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/20">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Tổng cộng: {filteredOrders.length} đơn hàng
                    </div>
                </div>
            </div>
        </div>
    )
}
