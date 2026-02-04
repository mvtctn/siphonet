import Link from 'next/link'
import { Phone, Mail, ArrowRight } from 'lucide-react'

export function CTASection() {
    return (
        <section className="py-20 bg-gradient-to-r from-accent via-cyan-500 to-cyan-600 text-white">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Bạn cần tư vấn về thiết bị M&E?
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn 24/7
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                        <a
                            href="tel:0913381683"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-accent hover:bg-slate-100 font-medium rounded-lg transition-colors"
                        >
                            <Phone className="h-5 w-5" />
                            0913381683
                        </a>

                        <a
                            href="mailto:info@siphonet.com"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-accent hover:bg-slate-100 font-medium rounded-lg transition-colors"
                        >
                            <Mail className="h-5 w-5" />
                            info@siphonet.com
                        </a>
                    </div>

                    <Link
                        href="/lien-he"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-800 text-white font-medium rounded-lg transition-colors"
                    >
                        Gửi yêu cầu báo giá
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
