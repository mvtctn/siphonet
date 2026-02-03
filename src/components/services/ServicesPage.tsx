import Link from 'next/link'
import { mockServices } from '@/lib/mock-data'
import { Lightbulb, Wrench, Settings, Hammer, ArrowRight, CheckCircle } from 'lucide-react'

const iconMap = {
    Lightbulb,
    Wrench,
    Settings,
    Hammer,
}

export function ServicesPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Page Header */}
            <div className="relative bg-gradient-to-br from-primary via-primary-800 to-slate-900 text-white py-20">
                <div className="container mx-auto px-4 relative">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Dịch vụ của chúng tôi
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl">
                        Giải pháp toàn diện từ tư vấn thiết kế đến vận hành bảo trì lâu dài
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {mockServices.map((service, index) => {
                        const Icon = iconMap[service.icon as keyof typeof iconMap] || Lightbulb

                        return (
                            <div
                                key={service.id}
                                className="group bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="p-8">
                                    {/* Icon */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-xl bg-gradient-navy-cyan flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Icon className="h-8 w-8 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-accent font-medium mb-1">
                                                Dịch vụ {index + 1}
                                            </div>
                                            <h2 className="text-2xl font-bold text-slate-900 group-hover:text-accent transition-colors">
                                                {service.title}
                                            </h2>
                                        </div>
                                    </div>

                                    <p className="text-slate-600 mb-6 leading-relaxed">
                                        {service.description}
                                    </p>

                                    {/* Features */}
                                    <div className="space-y-3 mb-6">
                                        {service.features.map((feature, fIndex) => (
                                            <div key={fIndex} className="flex items-start gap-3">
                                                <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                                                <span className="text-slate-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <Link
                                        href="/lien-he"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-800 text-white font-medium rounded-lg transition-colors"
                                    >
                                        Liên hệ tư vấn
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Why Choose Us */}
                <div className="bg-gradient-to-br from-slate-50 to-cyan-50 rounded-2xl p-12">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
                        Tại sao chọn Siphonet?
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold">15+</span>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">
                                Năm kinh nghiệm
                            </h3>
                            <p className="text-slate-600">
                                Chuyên sâu trong lĩnh vực M&E và xử lý nước
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold">500+</span>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">
                                Dự án hoàn thành
                            </h3>
                            <p className="text-slate-600">
                                Phục vụ khách hàng dân dụng và công nghiệp
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold">24/7</span>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">
                                Hỗ trợ khách hàng
                            </h3>
                            <p className="text-slate-600">
                                Đội ngũ kỹ thuật sẵn sàng hỗ trợ mọi lúc
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
