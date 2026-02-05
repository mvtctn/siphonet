'use client'

import { AlertTriangle, RefreshCcw, Home, Ghost } from 'lucide-react'
import Link from 'next/link'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html lang="vi">
            <body className="antialiased bg-slate-950 text-slate-200">
                <main className="flex min-h-screen items-center justify-center p-6 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

                    <div className="relative max-w-xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                        {/* Logo/Icon */}
                        <div className="inline-flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl mb-4 group relative">
                            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Ghost className="h-16 w-16 text-primary relative animate-bounce" />
                        </div>

                        {/* Text Content */}
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase border-b-4 border-primary inline-block pb-2">
                                Hệ thống tê liệt
                            </h1>
                            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md mx-auto">
                                Có vẻ như một lỗi nghiêm trọng đã xảy ra trong lõi hệ thống Siphonet. Các kỹ sư đang được thông báo.
                            </p>
                        </div>

                        {/* Error Detail (Glassy) */}
                        <div className="bg-slate-900/80 backdrop-blur-md border border-white/5 p-6 rounded-3xl text-left font-mono text-xs overflow-hidden group">
                            <div className="flex items-center gap-2 mb-3 text-red-400 font-bold uppercase tracking-widest text-[10px]">
                                <AlertTriangle className="h-3 w-3" />
                                Báo cáo sự cố hệ thống (Kernel Panic)
                            </div>
                            <div className="text-slate-300 break-all bg-black/40 p-4 rounded-xl border border-white/5">
                                {error.message || 'Lỗi không xác định'}
                                {error.digest && <div className="mt-2 text-slate-500">Digest: {error.digest}</div>}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <button
                                onClick={() => {
                                    if (typeof reset === 'function') {
                                        reset()
                                    } else {
                                        window.location.reload()
                                    }
                                }}
                                className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-black rounded-2xl hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] transition-all flex items-center justify-center gap-3 active:scale-95 group"
                            >
                                <RefreshCcw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                                Thử khởi động lại
                            </button>
                            <Link
                                href="/"
                                className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 active:scale-95"
                            >
                                <Home className="h-5 w-5" />
                                Về trang chủ
                            </Link>
                        </div>

                        {/* Footer Branding */}
                        <div className="pt-12">
                            <span className="text-[10px] font-black uppercase text-slate-600 tracking-[0.5em]">
                                Secure Core System • Siphonet Technologies
                            </span>
                        </div>
                    </div>
                </main>
            </body>
        </html>
    )
}
