import Link from 'next/link'
import { ArrowRight, Zap, Shield, Award } from 'lucide-react'

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-800 to-slate-900 text-white">
            <div className="container mx-auto px-4 pt-12 pb-20 md:pt-16 md:pb-28 relative">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 text-accent text-sm font-medium mb-6">
                            <Zap className="h-4 w-4" />
                            <span>Giải pháp M&E chuyên nghiệp</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            Thiết bị Cơ Điện &
                            <span className="text-gradient-navy-cyan block mt-2">
                                Xử Lý Nước
                            </span>
                        </h1>

                        <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                            Nhà cung cấp, lắp đặt thiết bị M&E, hệ thống cấp thoát nước và xử lý nước cho công trình dân dụng và công nghiệp.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/san-pham"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent hover:bg-accent-600 text-white font-semibold rounded-lg transition-all hover:scale-105 shadow-lg shadow-accent/30"
                            >
                                Xem sản phẩm
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                            <Link
                                href="/lien-he"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-100 text-primary font-semibold rounded-lg transition-all hover:scale-105 shadow-lg"
                            >
                                Liên hệ tư vấn
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/10">
                            <div>
                                <div className="text-3xl font-bold text-accent mb-1">500+</div>
                                <div className="text-sm text-slate-300">Dự án hoàn thành</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-accent mb-1">15+</div>
                                <div className="text-sm text-slate-300">Năm kinh nghiệm</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-accent mb-1">100%</div>
                                <div className="text-sm text-slate-300">Khách hàng hài lòng</div>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="mt-12 lg:mt-0">
                        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                            <div className="p-6 rounded-xl bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-accent/20 text-accent">
                                        <Zap className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Công nghệ hiện đại</h3>
                                        <p className="text-slate-300 text-sm">
                                            Thiết bị nhập khẩu chính hãng từ các thương hiệu hàng đầu thế giới
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-xl bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-accent/20 text-accent">
                                        <Shield className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Bảo hành dài hạn</h3>
                                        <p className="text-slate-300 text-sm">
                                            Bảo hành chính hãng 12-36 tháng, hỗ trợ bảo trì trọn đời
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-xl bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-accent/20 text-accent">
                                        <Award className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Đội ngũ chuyên nghiệp</h3>
                                        <p className="text-slate-300 text-sm">
                                            Kỹ sư giàu kinh nghiệm, thi công đúng tiêu chuẩn kỹ thuật
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                    <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 80C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
                </svg>
            </div>
        </section>
    )
}
