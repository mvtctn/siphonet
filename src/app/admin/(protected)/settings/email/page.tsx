'use client'

import { useState, useEffect } from 'react'
import { Save, Mail, ShieldCheck, Server, Send, Loader2, CheckCircle2 } from 'lucide-react'

export default function EmailSettings() {
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [config, setConfig] = useState({
        host: '',
        port: 587,
        user: '',
        pass: '',
        from_name: 'Siphonet',
        receive_email: ''
    })

    useEffect(() => {
        fetchConfig()
    }, [])

    const fetchConfig = async () => {
        try {
            const response = await fetch('/api/admin/settings/email')
            const result = await response.json()
            if (result.success && result.data?.value) {
                setConfig(result.data.value)
            }
        } catch (error) {
            console.error('Failed to fetch email config', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            const response = await fetch('/api/admin/settings/email', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value: config })
            })
            const result = await response.json()
            if (result.success) {
                setShowSuccess(true)
                setTimeout(() => setShowSuccess(false), 3000)
            }
        } catch (error) {
            console.error('Failed to save config', error)
            alert('Lỗi khi lưu cấu hình')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Mail className="text-primary" /> Cấu hình Email (SMTP)
                </h1>
                <p className="text-slate-500">Thiết lập tài khoản gửi và nhận mail liên hệ từ khách hàng.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* SMTP Outgoing */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Server size={20} className="text-blue-500" /> Máy chủ gửi Mail (SMTP)
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">SMTP Host</label>
                                <input
                                    type="text"
                                    value={config.host}
                                    onChange={(e) => setConfig({ ...config, host: e.target.value })}
                                    placeholder="smtp.gmail.com"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">SMTP Port</label>
                                <input
                                    type="number"
                                    value={config.port}
                                    onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value) })}
                                    placeholder="587"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Tài khoản (Email)</label>
                                <input
                                    type="email"
                                    value={config.user}
                                    onChange={(e) => setConfig({ ...config, user: e.target.value })}
                                    placeholder="your-email@gmail.com"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Mật khẩu ứng dụng</label>
                                <input
                                    type="password"
                                    value={config.pass}
                                    onChange={(e) => setConfig({ ...config, pass: e.target.value })}
                                    placeholder="••••••••••••"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-mono"
                                />
                                <p className="mt-2 text-xs text-slate-400">Đối với Gmail, hãy sử dụng "Mật khẩu ứng dụng" (App Password).</p>
                            </div>
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Send size={20} className="text-emerald-500" /> Cấu hình nhận thông báo
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Tên người gửi hiển thị</label>
                                <input
                                    type="text"
                                    value={config.from_name}
                                    onChange={(e) => setConfig({ ...config, from_name: e.target.value })}
                                    placeholder="Siphonet Admin"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Email nhận thông báo</label>
                                <input
                                    type="email"
                                    value={config.receive_email}
                                    onChange={(e) => setConfig({ ...config, receive_email: e.target.value })}
                                    placeholder="admin@siphonet.com"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                />
                                <p className="mt-2 text-xs text-slate-400">Tất cả mail liên hệ từ website sẽ được chuyển tiếp đến email này.</p>
                            </div>

                            <div className="pt-6 mt-6 border-t border-slate-100">
                                <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl text-sm leading-relaxed">
                                    <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold mb-1 underline">Mẹo bảo mật:</p>
                                        Sử dụng mật khẩu ứng dụng thay vì mật khẩu chính của tài khoản để đảm bảo an toàn.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 items-center pt-4">
                    {showSuccess && (
                        <div className="flex items-center gap-2 text-emerald-600 font-bold animate-in fade-in slide-in-from-right-4">
                            <CheckCircle2 size={20} />
                            Đã lưu thành công!
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-600 shadow-xl shadow-primary/20 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save size={20} />}
                        Lưu cấu hình
                    </button>
                </div>
            </form>
        </div>
    )
}
