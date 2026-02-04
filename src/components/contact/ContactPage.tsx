'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from 'lucide-react'

export function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    })

    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('submitting')

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const result = await response.json()
            if (result.success) {
                setStatus('success')
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
                alert('Cảm ơn bạn! Tin nhắn của bạn đã được gửi thành công.')
            } else {
                setStatus('error')
                alert(result.error || 'Có lỗi xảy ra, vui lòng thử lại.')
            }
        } catch (error) {
            setStatus('error')
            alert('Lỗi kết nối máy chủ.')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-primary mb-4">Liên hệ với chúng tôi</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Đội ngũ chuyên gia của chúng tôi sẵn sàng tư vấn và hỗ trợ bạn
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {/* Contact Info Cards */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-accent/10 rounded-lg">
                                    <Phone className="h-6 w-6 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-primary mb-2">Điện thoại</h3>
                                    <p className="text-slate-600">0913 381 683</p>
                                    <p className="text-slate-600">0914 427 463</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-accent/10 rounded-lg">
                                    <Mail className="h-6 w-6 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-primary mb-2">Email</h3>
                                    <p className="text-slate-600">siphonetjsc@gmail.com</p>
                                    <p className="text-slate-600">info@siphonet.vn</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-accent/10 rounded-lg">
                                    <MapPin className="h-6 w-6 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-primary mb-2">Địa chỉ</h3>
                                    <p className="text-slate-600">
                                        Tầng 4, Tòa nhà N07-B1, Khu đô thị mới Dịch Vọng, Quận Cầu Giấy, Hà Nội
                                    </p>
                                    <p className="text-slate-500 text-sm mt-2">
                                        MST: 0111350715
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-accent/10 rounded-lg">
                                    <Clock className="h-6 w-6 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-primary mb-2">Giờ làm việc</h3>
                                    <p className="text-slate-600">Thứ 2 - Thứ 6: 8:00 - 17:30</p>
                                    <p className="text-slate-600">Thứ 7: 8:00 - 12:00</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-8 rounded-xl shadow-md">
                            <h2 className="text-2xl font-bold text-primary mb-6">Gửi tin nhắn cho chúng tôi</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Họ và tên *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                            placeholder="Nguyễn Văn A"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Số điện thoại *
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                            placeholder="0909 123 456"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Chủ đề
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                            placeholder="Tư vấn sản phẩm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Nội dung *
                                    </label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                                        placeholder="Nhập nội dung tin nhắn của bạn..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'submitting'}
                                    className="w-full md:w-auto px-8 py-3 bg-accent hover:bg-accent-600 text-white font-semibold rounded-lg transition-all hover:scale-105 shadow-lg shadow-accent/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    {status === 'submitting' ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <Send className="h-5 w-5" />
                                    )}
                                    {status === 'submitting' ? 'Đang gửi...' : 'Gửi tin nhắn'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
