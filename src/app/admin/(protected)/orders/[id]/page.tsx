
'use client'

import { useEffect, useState, use } from 'react'
import { useOrderStore, Order } from '@/store/useOrderStore'
import {
    ArrowLeft,
    Calendar,
    ChevronRight,
    CreditCard,
    Download,
    Mail,
    MapPin,
    Phone,
    Printer,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    User,
    Building2,
    Hash,
    Package,
    Loader2,
    FileText,
    ChevronDown
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import { generateInvoice, generateDeliveryNote, generateShippingLabel, generateAllDocuments } from '@/lib/generateOrderPDF'

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: orderId } = use(params)
    const router = useRouter()
    const { orders, updateOrderStatus, updatePaymentStatus, updateOrderNotes } = useOrderStore()
    const [order, setOrder] = useState<Order | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isUpdating, setIsUpdating] = useState(false)
    const [notes, setNotes] = useState('')
    const [showPdfMenu, setShowPdfMenu] = useState(false)
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`/api/admin/orders/${orderId}`)
                const result = await response.json()
                if (result.success) {
                    setOrder(result.data)
                    setNotes(result.data.notes || '')
                }
            } catch (error) {
                console.error('Failed to fetch order', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchOrder()
    }, [orderId])

    // Close PDF menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            if (showPdfMenu && !target.closest('.pdf-dropdown-container')) {
                setShowPdfMenu(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showPdfMenu])

    const handleStatusUpdate = async (newStatus: string) => {
        setIsUpdating(true)
        await updateOrderStatus(orderId, newStatus)
        setOrder(prev => prev ? { ...prev, status: newStatus as any } : null)
        setIsUpdating(false)
    }

    const handlePaymentUpdate = async (newStatus: string) => {
        setIsUpdating(true)
        await updatePaymentStatus(orderId, newStatus)
        setOrder(prev => prev ? { ...prev, paymentStatus: newStatus as any } : null)
        setIsUpdating(false)
    }

    const handleSaveNotes = async () => {
        setIsUpdating(true)
        await updateOrderNotes(orderId, notes)
        setOrder(prev => prev ? { ...prev, notes } : null)
        setIsUpdating(false)
        alert('Đã lưu ghi chú thành công!')
    }

    const handleGeneratePDF = async (type: 'invoice' | 'delivery' | 'shipping' | 'all') => {
        if (!order) return

        setIsGeneratingPdf(true)
        setShowPdfMenu(false)

        try {
            switch (type) {
                case 'invoice':
                    await generateInvoice(order)
                    break
                case 'delivery':
                    await generateDeliveryNote(order)
                    break
                case 'shipping':
                    await generateShippingLabel(order)
                    break
                case 'all':
                    await generateAllDocuments(order)
                    break
            }
        } catch (error) {
            console.error('PDF generation failed:', error)
        } finally {
            setIsGeneratingPdf(false)
        }
    }

    const handleOpenMap = () => {
        if (order?.deliveryAddress) {
            const encodedAddress = encodeURIComponent(order.deliveryAddress)
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank')
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        )
    }

    if (!order) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-bold">Không tìm thấy đơn hàng</h2>
                <Link href="/admin/orders" className="text-primary hover:underline mt-4 inline-block">Quay lại danh sách</Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between font-bold">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/orders" className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div className="h-6 w-px bg-slate-200 mx-2" />
                        <div className="flex flex-col">
                            <h1 className="text-sm font-bold text-slate-900 uppercase tracking-widest leading-none">
                                Đơn hàng #{order.orderCode}
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`h-1.5 w-1.5 rounded-full ${order.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest">{order.status}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* PDF Export Dropdown */}
                        <div className="relative pdf-dropdown-container">
                            <button
                                onClick={() => setShowPdfMenu(!showPdfMenu)}
                                disabled={isGeneratingPdf}
                                className="hidden md:flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 font-bold text-sm transition-colors border border-slate-200 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-50"
                            >
                                {isGeneratingPdf ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Đang tạo PDF...
                                    </>
                                ) : (
                                    <>
                                        <FileText className="h-4 w-4" />
                                        Xuất PDF
                                        <ChevronDown className="h-3 w-3" />
                                    </>
                                )}
                            </button>

                            {showPdfMenu && !isGeneratingPdf && (
                                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                    <button
                                        onClick={() => handleGeneratePDF('invoice')}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                        <FileText className="h-4 w-4 text-blue-500" />
                                        <div className="text-left">
                                            <div className="font-bold">Hóa đơn</div>
                                            <div className="text-xs text-slate-400">Invoice</div>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => handleGeneratePDF('delivery')}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                        <Package className="h-4 w-4 text-red-500" />
                                        <div className="text-left">
                                            <div className="font-bold">Phiếu xuất kho</div>
                                            <div className="text-xs text-slate-400">Delivery Note</div>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => handleGeneratePDF('shipping')}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                        <Truck className="h-4 w-4 text-green-500" />
                                        <div className="text-left">
                                            <div className="font-bold">Bản giao hàng</div>
                                            <div className="text-xs text-slate-400">Shipping Label</div>
                                        </div>
                                    </button>
                                    <div className="h-px bg-slate-200 my-2" />
                                    <button
                                        onClick={() => handleGeneratePDF('all')}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-primary hover:bg-primary/5 transition-colors"
                                    >
                                        <Download className="h-4 w-4" />
                                        <div className="text-left">
                                            <div>Tải tất cả (3 file)</div>
                                            <div className="text-xs text-slate-400 font-normal">Download All</div>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="h-6 w-px bg-slate-200 mx-2" />
                        <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(e.target.value)}
                            disabled={isUpdating}
                            className="bg-primary text-white border-none rounded-xl px-4 py-2.5 text-sm font-bold shadow-lg shadow-primary/20 outline-none active:scale-95 transition-all disabled:opacity-50"
                        >
                            <option value="new">Mới</option>
                            <option value="processing">Đang xử lý</option>
                            <option value="shipped">Đang giao</option>
                            <option value="completed">Đã hoàn thành</option>
                            <option value="cancelled">Đã hủy</option>
                        </select>
                    </div>
                </div>
            </div>

            <main className="max-w-[1400px] mx-auto p-6 md:p-8 grid lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Order Items & Customer Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Order Items */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <Package className="h-5 w-5 text-primary" />
                                Danh sách sản phẩm
                            </h3>
                            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                {order.items.length} mặt hàng
                            </span>
                        </div>
                        <div className="p-0">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Sản phẩm</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Số lượng</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Đơn giá</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {order.items.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                                                        <Package className="h-6 w-6 text-slate-300" />
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="font-bold text-slate-900 text-sm truncate leading-tight">{item.productName}</span>
                                                        <span className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {item.productId.slice(0, 8)}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center font-bold text-slate-600 text-sm">
                                                x{item.quantity}
                                            </td>
                                            <td className="px-6 py-5 text-right font-medium text-slate-500 text-sm">
                                                {new Intl.NumberFormat('vi-VN').format(item.price)}đ
                                            </td>
                                            <td className="px-6 py-5 text-right font-bold text-slate-900 text-sm">
                                                {new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)}đ
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-8 bg-slate-50 space-y-3">
                            <div className="flex justify-between text-sm text-slate-500 font-medium">
                                <span>Tạm tính</span>
                                <span>{new Intl.NumberFormat('vi-VN').format(Number(order.totalAmount))}đ</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-500 font-medium">
                                <span>Phí vận chuyển</span>
                                <span className="text-emerald-600">Miễn phí</span>
                            </div>
                            <div className="h-px bg-slate-200 my-4" />
                            <div className="flex justify-between items-center capitalize">
                                <span className="text-lg font-bold text-slate-900">Tổng cộng</span>
                                <span className="text-2xl font-bold text-primary">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.totalAmount))}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info Card */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col h-full">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Thông tin khách hàng
                            </h3>
                            <div className="space-y-4 flex-1">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-slate-50 rounded-xl">
                                        <User className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Họ và tên</div>
                                        <div className="font-bold text-slate-900">{order.customerName}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-slate-50 rounded-xl">
                                        <Building2 className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Công ty</div>
                                        <div className="font-bold text-slate-900">{order.customerCompany || 'N/A'}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-slate-50 rounded-xl">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</div>
                                        <div className="font-bold text-slate-900">{order.customerEmail}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-slate-50 rounded-xl">
                                        <Phone className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Số điện thoại</div>
                                        <div className="font-bold text-primary">{order.customerPhone}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col h-full">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                Địa chỉ giao hàng
                            </h3>
                            <div className="bg-slate-50 p-6 rounded-2xl flex-1 border border-slate-100 dashed border-2">
                                <p className="text-slate-700 font-medium leading-relaxed italic">
                                    "{order.deliveryAddress}"
                                </p>
                            </div>
                            <button
                                onClick={handleOpenMap}
                                className="w-full mt-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-bold text-xs transition-all tracking-widest uppercase"
                            >
                                Bản đồ chỉ đường
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Status & Payment */}
                <aside className="space-y-8">
                    {/* Status Tracker */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            Tiến trình xử lý
                        </h3>
                        <div className="space-y-6 relative">
                            {/* Line connecting points */}
                            <div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-slate-100" />

                            {[
                                { status: 'new', label: 'Tiếp nhận đơn hàng', date: order.createdAt, active: ['new', 'processing', 'shipped', 'completed'].includes(order.status) },
                                { status: 'processing', label: 'Đang xử lý & đóng gói', date: null, active: ['processing', 'shipped', 'completed'].includes(order.status) },
                                { status: 'shipped', label: 'Bàn giao vận chuyển', date: null, active: ['shipped', 'completed'].includes(order.status) },
                                { status: 'completed', label: 'Hoàn thành', date: order.updatedAt && order.status === 'completed' ? order.updatedAt : null, active: order.status === 'completed' }
                            ].map((step, idx) => (
                                <div key={idx} className={`relative pl-10 ${step.active ? '' : 'opacity-40 filter grayscale'}`}>
                                    <div className={`absolute left-0 top-0 h-9 w-9 rounded-xl border-2 flex items-center justify-center bg-white transition-all ${step.active ? 'border-primary text-primary shadow-sm' : 'border-slate-200 text-slate-300'
                                        }`}>
                                        {step.active && step.status !== order.status ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">{step.label}</div>
                                        <div className="text-[10px] text-slate-400 font-medium tracking-tight">
                                            {step.date ? format(new Date(step.date), 'HH:mm - dd/MM/yyyy', { locale: vi }) : 'Chờ thực hiện'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl shadow-xl text-white">
                        <h3 className="font-bold text-sm mb-6 flex items-center gap-2 uppercase tracking-widest text-slate-400">
                            <CreditCard className="h-4 w-4 text-primary" />
                            Thanh toán
                        </h3>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-400">Hình thức:</span>
                                <span className="text-sm font-bold">{order.paymentMethod}</span>
                            </div>

                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-slate-400">Trạng thái:</span>
                                    <span className={`text-xs font-bold uppercase tracking-widest ${order.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'
                                        }`}>
                                        {order.paymentStatus === 'paid' ? 'Đã thu tiền' : 'Chưa thanh toán'}
                                    </span>
                                </div>
                                {order.payosOrderId && (
                                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                        <span className="text-[10px] font-medium text-slate-500 uppercase">Mã PayOS:</span>
                                        <span className="text-[10px] font-mono text-slate-300">{order.payosOrderId}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Thao tác nhanh</div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => handlePaymentUpdate('paid')}
                                        disabled={isUpdating || order.paymentStatus === 'paid'}
                                        className="py-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-30"
                                    >
                                        Ghi nhận Đã trả
                                    </button>
                                    <button
                                        onClick={() => handlePaymentUpdate('pending')}
                                        disabled={isUpdating || order.paymentStatus === 'pending'}
                                        className="py-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all disabled:opacity-30"
                                    >
                                        Ghi nhận Chưa trả
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes Card */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-4 text-sm flex items-center gap-2">
                            <Mail className="h-4 w-4 text-primary" />
                            Ghi chú đơn hàng
                        </h3>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            disabled={isUpdating}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm text-slate-600 focus:ring-0 focus:border-primary transition-all outline-none resize-none h-32"
                            placeholder="Thêm ghi chú nội bộ cho đơn hàng này..."
                        />
                        <button
                            onClick={handleSaveNotes}
                            disabled={isUpdating}
                            className="w-full mt-4 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200 disabled:opacity-50"
                        >
                            {isUpdating ? 'Đang lưu...' : 'Lưu ghi chú'}
                        </button>
                    </div>
                </aside>
            </main>
        </div>
    )
}
