import { mockServices } from '@/lib/mock-data'
import { Lightbulb, Wrench, Settings, Hammer } from 'lucide-react'

const iconMap = {
    Lightbulb,
    Wrench,
    Settings,
    Hammer,
}

export function ServicesSection() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                        Dịch vụ của chúng tôi
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Giải pháp toàn diện
                    </h2>
                    <p className="text-lg text-slate-600">
                        Từ tư vấn thiết kế đến vận hành bảo trì lâu dài
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mockServices.map((service) => {
                        const Icon = iconMap[service.icon as keyof typeof iconMap] || Lightbulb

                        return (
                            <div
                                key={service.id}
                                className="group p-6 rounded-xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 hover:border-accent hover:shadow-lg transition-all duration-300"
                            >
                                {/* Icon */}
                                <div className="w-14 h-14 rounded-lg bg-gradient-navy-cyan flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Icon className="h-7 w-7 text-white" />
                                </div>

                                <h3 className="font-bold text-lg text-slate-900 mb-3 group-hover:text-accent transition-colors">
                                    {service.title}
                                </h3>

                                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                                    {service.description}
                                </p>

                                {/* Features List */}
                                <ul className="space-y-2">
                                    {service.features.slice(0, 3).map((feature, index) => (
                                        <li key={index} className="flex items-center gap-2 text-sm text-slate-600">
                                            <div className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
