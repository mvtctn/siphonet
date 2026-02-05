
'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CheckCircle2, Package, ArrowRight, Home } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SuccessContent() {
    const searchParams = useSearchParams()
    const orderCode = searchParams.get('order')

    return (
        <div className="max-w-2xl mx-auto py-20 px-4 text-center">
            <div className="inline-flex items-center justify-center p-4 bg-emerald-50 text-emerald-500 rounded-full mb-8">
                <CheckCircle2 className="h-16 w-16" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight uppercase border-b-4 border-primary inline-block pb-2">Đặt hàng thành công!</h1>
            <p className="text-slate-600 mb-8 text-lg font-medium"> Cảm ơn bạn đã tin tưởng Siphonet. Đơn hàng của bạn đang được xử lý.</p>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl mb-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Package className="h-24 w-24" />
                </div>
                <div className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Mã đơn hàng</div>
                <div className="text-4xl font-black text-primary mb-6">#{orderCode || 'N/A'}</div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Chúng tôi đã gửi thông tin chi tiết đơn hàng vào email của bạn. Đội ngũ kỹ sư sẽ sớm liên hệ để xác nhận.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                    href="/admin/dashboard" // For testing purposes, or user can go to home
                    className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                    <Home className="h-5 w-5" />
                    Về trang chủ
                </Link>
                <Link
                    href="/san-pham"
                    className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-black rounded-2xl hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
                >
                    Tiếp tục mua hàng
                    <ArrowRight className="h-5 w-5" />
                </Link>
            </div>
        </div>
    )
}

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Header />
            <Suspense fallback={<div className="py-40 text-center"><Loader2 className="animate-spin inline-block mr-2" /> Đang tải...</div>}>
                <SuccessContent />
            </Suspense>
            <Footer />
        </div>
    )
}

import { Loader2 } from 'lucide-react'
