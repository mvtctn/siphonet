'use client'

import { mockFAQs } from '@/lib/mock-data'
import { Plus, Minus } from 'lucide-react'
import { useState } from 'react'

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)
    const featuredFAQs = mockFAQs.filter(faq => faq.featured)

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        Câu hỏi thường gặp
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Giải đáp thắc mắc
                    </h2>
                    <p className="text-lg text-slate-600">
                        Những câu hỏi khách hàng quan tâm nhất về sản phẩm và dịch vụ
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="max-w-3xl mx-auto space-y-4">
                    {featuredFAQs.map((faq, index) => (
                        <div
                            key={faq.id}
                            className="border border-slate-200 rounded-xl overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                            >
                                <span className="font-semibold text-lg text-slate-900 pr-4">
                                    {faq.question}
                                </span>
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === index ? 'bg-accent text-white' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {openIndex === index ? (
                                        <Minus className="h-5 w-5" />
                                    ) : (
                                        <Plus className="h-5 w-5" />
                                    )}
                                </div>
                            </button>

                            {openIndex === index && (
                                <div className="px-6 pb-6">
                                    <p className="text-slate-600 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
