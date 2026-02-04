'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Send, FileText, CheckCircle2, Clock, Shield, TrendingUp } from 'lucide-react'

export default function QuotePage() {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        productCategory: '',
        quantity: '',
        description: '',
        budget: '',
        timeline: ''
    })
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Quote request:', formData)
        setIsSubmitted(true)
        // TODO: Implement actual form submission
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    if (isSubmitted) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 flex items-center justify-center py-12 px-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">Yêu cầu đã được gửi!</h2>
                        <p className="text-slate-600 mb-6">
                            Cảm ơn bạn đã gửi yêu cầu báo giá. Đội ngũ chuyên gia của chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ.
                        </p>
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-600 transition-colors"
                        >
                            Gửi yêu cầu khác
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 py-12">
                <div className="container mx-auto px-4">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold mb-4">
                            <FileText className="h-4 w-4" />
                            Yêu cầu báo giá
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                            Nhận báo giá tốt nhất
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Gửi yêu cầu của bạn và nhận báo giá chi tiết từ đội ngũ chuyên gia của chúng tôi
                        </p>
                    </div>

                    <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
                        {/* Benefits */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="font-bold text-lg text-slate-900 mb-4">Tại sao chọn chúng tôi?</h3>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-accent/10 rounded-lg flex-shrink-0">
                                            <Clock className="h-5 w-5 text-accent" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 mb-1">Phản hồi nhanh</h4>
                                            <p className="text-sm text-slate-600">Báo giá trong vòng 24 giờ</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-cyan-100 rounded-lg flex-shrink-0">
                                            <TrendingUp className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 mb-1">Giá cạnh tranh</h4>
                                            <p className="text-sm text-slate-600">Cam kết giá tốt nhất thị trường</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                                            <Shield className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 mb-1">Bảo hành chính hãng</h4>
                                            <p className="text-sm text-slate-600">12-36 tháng tùy sản phẩm</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                            <CheckCircle2 className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 mb-1">Tư vấn chuyên nghiệp</h4>
                                            <p className="text-sm text-slate-600">Đội ngũ kỹ thuật giàu kinh nghiệm</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-primary to-cyan-600 rounded-2xl shadow-lg p-6 text-white">
                                <h3 className="font-bold text-lg mb-3">Liên hệ trực tiếp</h3>
                                <div className="space-y-3 text-sm">
                                    <p>📞 Hotline: <strong>024 3200 1234</strong></p>
                                    <p>📧 Email: <strong>siphonetjsc@gmail.com</strong></p>
                                    <p>⏰ Thứ 2 - Thứ 6: 8:00 - 17:30</p>
                                </div>
                            </div>
                        </div>

                        {/* Quote Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-xl p-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Điền thông tin yêu cầu</h2>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Personal Info */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Họ và tên <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                                placeholder="Nguyễn Văn A"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Công ty/Tổ chức
                                            </label>
                                            <input
                                                type="text"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                                placeholder="Tên công ty"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Email <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Số điện thoại <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                                placeholder="0909 123 456"
                                            />
                                        </div>
                                    </div>

                                    {/* Project Details */}
                                    <div className="pt-4 border-t border-slate-200">
                                        <h3 className="font-semibold text-lg text-slate-900 mb-4">Thông tin dự án</h3>

                                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Danh mục sản phẩm <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    name="productCategory"
                                                    required
                                                    value={formData.productCategory}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                                >
                                                    <option value="">Chọn danh mục</option>
                                                    <option value="co-dien">Thiết bị Cơ Điện</option>
                                                    <option value="cap-nuoc">Thiết bị Cấp Nước</option>
                                                    <option value="xu-ly-nuoc">Thiết bị Xử Lý Nước</option>
                                                    <option value="khac">Khác</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Số lượng dự kiến
                                                </label>
                                                <input
                                                    type="text"
                                                    name="quantity"
                                                    value={formData.quantity}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                                    placeholder="VD: 10 bộ, 50 cái..."
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Ngân sách dự kiến
                                                </label>
                                                <select
                                                    name="budget"
                                                    value={formData.budget}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                                >
                                                    <option value="">Chọn mức ngân sách</option>
                                                    <option value="duoi-50">Dưới 50 triệu</option>
                                                    <option value="50-200">50 - 200 triệu</option>
                                                    <option value="200-500">200 - 500 triệu</option>
                                                    <option value="tren-500">Trên 500 triệu</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Thời gian triển khai
                                                </label>
                                                <select
                                                    name="timeline"
                                                    value={formData.timeline}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                                >
                                                    <option value="">Chọn thời gian</option>
                                                    <option value="gap">Càng sớm càng tốt</option>
                                                    <option value="1-thang">Trong 1 tháng tới</option>
                                                    <option value="2-3-thang">2-3 tháng tới</option>
                                                    <option value="chua-xac-dinh">Chưa xác định</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Mô tả chi tiết yêu cầu <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                name="description"
                                                required
                                                rows={6}
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none"
                                                placeholder="Vui lòng mô tả chi tiết về dự án, yêu cầu kỹ thuật, số lượng cần thiết..."
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-accent to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-xl shadow-accent/30 flex items-center justify-center gap-2"
                                        >
                                            <Send className="h-5 w-5" />
                                            Gửi yêu cầu báo giá
                                        </button>
                                        <p className="text-xs text-slate-500 mt-3">
                                            Bằng việc gửi form này, bạn đồng ý với chính sách bảo mật thông tin của chúng tôi.
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
