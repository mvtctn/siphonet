
'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useCartStore } from '@/store/useCartStore'
import {
    CreditCard,
    Truck,
    ShieldCheck,
    ChevronRight,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    Building2,
    MapPin,
    Phone,
    Mail,
    User
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
    const router = useRouter()
    const { items: cartItems, getSubtotal, clearCart } = useCartStore()
    const [isHydrated, setIsHydrated] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<'PayOS' | 'COD' | 'Bank Transfer'>('PayOS')

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        notes: ''
    })

    useEffect(() => {
        setIsHydrated(true)
    }, [])

    if (!isHydrated) return null

    const subtotal = getSubtotal()
    const shipping = subtotal > 0 ? 500000 : 0
    const total = subtotal + shipping

    if (cartItems.length === 0 && !isLoading) {
        router.push('/gio-hang')
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch('/api/orders/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer: formData,
                    items: cartItems,
                    paymentMethod
                })
            })

            const result = await response.json()

            if (result.success) {
                // Clear cart
                clearCart()

                if (result.data.paymentLink && paymentMethod === 'PayOS') {
                    // Redirect to PayOS checkout
                    window.location.href = result.data.paymentLink
                } else {
                    // Redirect to success page for COD/Bank Transfer
                    router.push(`/thanh-toan/thanh-cong?order=${result.data.orderCode}`)
                }
            } else {
                alert(result.message || 'Có lỗi xảy ra, vui lòng thử lại.')
            }
        } catch (error) {
            console.error('Checkout error:', error)
            alert('Lỗi kết nối, vui lòng thử lại sau.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Header />

            <main className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-8 font-medium">
                        <Link href="/gio-hang" className="hover:text-primary transition-colors">Giỏ hàng</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-slate-900 font-bold">Thanh toán</span>
                    </div>

                    <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-12 items-start">
                        {/* Left Column: Form */}
                        <div className="lg:col-span-3 space-y-10">
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Thông tin giao hàng</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Họ và tên *</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                            placeholder="Nguyễn Văn A"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Email *</label>
                                        <input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                            placeholder="a@gmail.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Số điện thoại *</label>
                                        <input
                                            required
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                            placeholder="09xx xxx xxx"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Công ty (nếu có)</label>
                                        <input
                                            type="text"
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                            placeholder="Tên công ty / Đơn vị"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Địa chỉ nhận hàng *</label>
                                        <textarea
                                            required
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            rows={3}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium resize-none"
                                            placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                                        />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <CreditCard className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Phương thức thanh toán</h2>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { id: 'PayOS', label: 'Thanh toán QR (PayOS VietQR)', desc: 'Tạo mã QR tự động, xác nhận thanh toán tức thì.', icon: CheckCircle2 },
                                        { id: 'Bank Transfer', label: 'Chuyển khoản thủ công', desc: 'Chuyển khoản qua số tài khoản công ty Siphonet.', icon: Building2 },
                                        { id: 'COD', label: 'Thanh toán khi nhận hàng (COD)', desc: 'Thanh toán bằng tiền mặt khi shipper giao hàng.', icon: Truck }
                                    ].map((method) => (
                                        <div
                                            key={method.id}
                                            onClick={() => setPaymentMethod(method.id as any)}
                                            className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex items-start gap-4 ${paymentMethod === method.id
                                                    ? 'border-primary bg-primary/[0.03]'
                                                    : 'border-slate-100 bg-white hover:border-slate-200'
                                                }`}
                                        >
                                            <div className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-primary' : 'border-slate-300'
                                                }`}>
                                                {paymentMethod === method.id && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-bold text-slate-900">{method.label}</div>
                                                <div className="text-sm text-slate-500 mt-1">{method.desc}</div>
                                            </div>
                                            <method.icon className={`h-6 w-6 ${paymentMethod === method.id ? 'text-primary' : 'text-slate-200'}`} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="h-24 w-24" />
                                </div>

                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 mb-8">Tóm tắt đơn hàng</h3>

                                <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="h-16 w-16 bg-white/10 rounded-2xl p-2 shrink-0 border border-white/5">
                                                <div className="relative w-full h-full">
                                                    <Image src={item.image} alt={item.name} fill className="object-cover rounded-xl" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-sm truncate">{item.name}</div>
                                                <div className="text-xs text-slate-400 mt-1">Số lượng: x{item.quantity}</div>
                                            </div>
                                            <div className="font-bold text-sm text-primary">
                                                {new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)}đ
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 pt-6 border-t border-white/10">
                                    <div className="flex justify-between text-sm text-slate-400">
                                        <span>Tạm tính</span>
                                        <span className="font-bold text-white">{new Intl.NumberFormat('vi-VN').format(subtotal)}đ</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-400">
                                        <span>Phí vận chuyển</span>
                                        <span className="text-emerald-400 font-bold italic">Miễn phí</span>
                                    </div>
                                    <div className="pt-6 mt-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Tổng cộng</span>
                                            <span className="text-3xl font-black text-primary drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">
                                                {new Intl.NumberFormat('vi-VN').format(total)}đ
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className={`w-full mt-10 py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${isLoading
                                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                            : 'bg-primary text-white hover:bg-white hover:text-slate-900 shadow-lg shadow-primary/30 active:scale-95'
                                        }`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        <>
                                            Xác nhận đặt hàng
                                            <ChevronRight className="h-5 w-5" />
                                        </>
                                    )}
                                </button>

                                <p className="text-[10px] text-slate-500 text-center mt-6 uppercase font-bold tracking-widest leading-relaxed">
                                    Bằng cách bấm nút này, bạn đồng ý với <br /> các điều khoản & chính sách của Siphonet
                                </p>
                            </div>

                            {/* Trust badges */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                                    <ShieldCheck className="h-6 w-6 text-emerald-500 mb-2" />
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Bảo mật SSL</span>
                                </div>
                                <div className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                                    <Truck className="h-6 w-6 text-blue-500 mb-2" />
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Giao hàng toàn quốc</span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    )
}
