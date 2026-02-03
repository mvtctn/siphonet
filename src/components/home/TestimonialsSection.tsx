import { mockTestimonials } from '@/lib/mock-data'
import { Quote, Star } from 'lucide-react'

export function TestimonialsSection() {
    return (
        <section className="py-20 bg-gradient-to-br from-primary via-primary-800 to-slate-900 text-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 text-accent text-sm font-medium mb-4">
                        Khách hàng nói gì
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Phản hồi từ khách hàng
                    </h2>
                    <p className="text-lg text-slate-300">
                        Sự hài lòng của khách hàng là thành công của chúng tôi
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockTestimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="p-6 rounded-xl bg-white/10 backdrop-blur border border-white/10 hover:bg-white/15 transition-colors"
                        >
                            {/* Quote Icon */}
                            <div className="mb-4">
                                <Quote className="h-10 w-10 text-accent" />
                            </div>

                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${i < testimonial.rating
                                                ? 'fill-accent text-accent'
                                                : 'text-white/30'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <p className="text-slate-200 mb-6 leading-relaxed">
                                "{testimonial.testimonial}"
                            </p>

                            {/* Client Info */}
                            <div className="pt-4 border-t border-white/10">
                                <div className="font-semibold text-white mb-1">
                                    {testimonial.clientName}
                                </div>
                                <div className="text-sm text-slate-300">
                                    {testimonial.clientPosition}
                                </div>
                                <div className="text-sm text-accent">
                                    {testimonial.clientCompany}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
