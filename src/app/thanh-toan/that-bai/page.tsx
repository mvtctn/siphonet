
'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { XCircle, RefreshCw, ArrowLeft, Phone } from 'lucide-react'
import Link from 'next/link'

export default function FailurePage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Header />
            <div className="max-w-2xl mx-auto py-20 px-4 text-center">
                <div className="inline-flex items-center justify-center p-4 bg-rose-50 text-rose-500 rounded-full mb-8">
                    <XCircle className="h-16 w-16" />
                </div>
                <h1 className="text-4xl font-black text-rose-900 mb-4 tracking-tight uppercase border-b-4 border-rose-200 inline-block pb-2">Thanh toán thất bại</h1>
                <p className="text-slate-600 mb-8 text-lg font-medium"> Rất tiếc, đã có lỗi xảy ra trong quá trình thanh toán. Bạn có thể thử lại hoặc chọn phương thức khác.</p>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl mb-12">
                    <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-widest text-xs">Cần hỗ trợ?</h3>
                    <div className="flex items-center justify-center gap-6">
                        <div className="flex flex-col items-center">
                            <div className="p-3 bg-blue-50 text-blue-500 rounded-full mb-2">
                                <Phone className="h-6 w-6" />
                            </div>
                            <span className="font-bold text-sm">Hotline: 09xx xxx xxx</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/thanh-toan"
                        className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="h-5 w-5" />
                        Thử lại
                    </Link>
                    <Link
                        href="/gio-hang"
                        className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-900 font-extrabold rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Quay về giỏ hàng
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    )
}
