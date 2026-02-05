'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Globe, Search, BarChart3, Share2 } from 'lucide-react'

interface SettingsData {
    site_info: {
        title: string
        description: string
        email: string
        phone: string
        address: string
    }
    seo: {
        meta_title: string
        meta_description: string
        keywords: string
    }
    analytics: {
        google_analytics_id: string
        google_console_id: string
        facebook_pixel: string
    }
    social: {
        facebook: string
        zalo: string
        youtube: string
    }
    chat_bubble: {
        enabled: boolean
        zalo: string
        messenger: string
        whatsapp: string
    }
}

const defaultSettings: SettingsData = {
    site_info: { title: '', description: '', email: '', phone: '', address: '' },
    seo: { meta_title: '', meta_description: '', keywords: '' },
    analytics: { google_analytics_id: '', google_console_id: '', facebook_pixel: '' },
    social: { facebook: '', zalo: '', youtube: '' },
    chat_bubble: { enabled: true, zalo: '', messenger: '', whatsapp: '' }
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<SettingsData>(defaultSettings)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState<'general' | 'seo' | 'analytics' | 'social' | 'chat'>('general')

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/admin/settings')
                const data = await res.json()
                if (data.success && data.data) {
                    // Merge with default to ensure structure
                    setSettings({ ...defaultSettings, ...data.data })
                }
            } catch (error) {
                console.error('Failed to load settings', error)
            } finally {
                setLoading(false)
            }
        }
        fetchSettings()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            })
            const data = await res.json()
            if (data.success) {
                alert('Đã lưu cấu hình thành công!')
            } else {
                alert('Lỗi: ' + data.error)
            }
        } catch (error) {
            alert('Có lỗi xảy ra')
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (section: keyof SettingsData, field: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }))
    }

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Cấu hình Website</h1>
                    <p className="text-slate-500">Quản lý thông tin chung, SEO và mã theo dõi</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-600 transition-all shadow-lg shadow-primary/20 font-medium"
                >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Lưu cấu hình
                </button>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Sidebar Menu */}
                <div className="col-span-12 md:col-span-3">
                    <nav className="space-y-1">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'general' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <Globe size={18} /> Thông tin chung
                        </button>
                        <button
                            onClick={() => setActiveTab('seo')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'seo' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <Search size={18} /> Cấu hình SEO
                        </button>
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'analytics' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <BarChart3 size={18} /> Mã theo dõi (Analytics)
                        </button>
                        <button
                            onClick={() => setActiveTab('social')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'social' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <Share2 size={18} /> Mạng xã hội
                        </button>
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'chat' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <Share2 size={18} /> Bong bóng Chat
                        </button>
                    </nav>
                </div>

                {/* Content */}
                <div className="col-span-12 md:col-span-9 space-y-6">
                    {/* General Settings */}
                    {activeTab === 'general' && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-lg font-bold text-slate-800 mb-6 border-b pb-4">Thông tin website</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tên Website (Title)</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        value={settings.site_info.title}
                                        onChange={(e) => handleChange('site_info', 'title', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả ngắn</label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        value={settings.site_info.description}
                                        onChange={(e) => handleChange('site_info', 'description', e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Email liên hệ</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            value={settings.site_info.email}
                                            onChange={(e) => handleChange('site_info', 'email', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Hotline</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            value={settings.site_info.phone}
                                            onChange={(e) => handleChange('site_info', 'phone', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Địa chỉ</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        value={settings.site_info.address}
                                        onChange={(e) => handleChange('site_info', 'address', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SEO Settings */}
                    {activeTab === 'seo' && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-lg font-bold text-slate-800 mb-6 border-b pb-4">Cấu hình SEO mặc định</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title mặc định</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        value={settings.seo.meta_title}
                                        onChange={(e) => handleChange('seo', 'meta_title', e.target.value)}
                                        placeholder="Siphonet - Thiết bị Cơ Điện & Xử Lý Nước"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description mặc định</label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        value={settings.seo.meta_description}
                                        onChange={(e) => handleChange('seo', 'meta_description', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Keywords (từ khóa)</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        value={settings.seo.keywords}
                                        onChange={(e) => handleChange('seo', 'keywords', e.target.value)}
                                        placeholder="bơm nước, xử lý nước, cơ điện, siphonet..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Analytics Settings */}
                    {activeTab === 'analytics' && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-lg font-bold text-slate-800 mb-6 border-b pb-4">Google Analytics & Console</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Google Analytics ID (G-XXXXXXX)</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
                                        value={settings.analytics.google_analytics_id}
                                        onChange={(e) => handleChange('analytics', 'google_analytics_id', e.target.value)}
                                        placeholder="G-ABC123456"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Mã đo lường GA4</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Google Search Console Verification Code</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
                                        value={settings.analytics.google_console_id}
                                        onChange={(e) => handleChange('analytics', 'google_console_id', e.target.value)}
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Thẻ meta name="google-site-verification"</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Facebook Pixel ID</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
                                        value={settings.analytics.facebook_pixel}
                                        onChange={(e) => handleChange('analytics', 'facebook_pixel', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Social Settings */}
                    {activeTab === 'social' && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-lg font-bold text-slate-800 mb-6 border-b pb-4">Liên kết mạng xã hội</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Facebook Fanpage URL</label>
                                    <input
                                        type="url"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        value={settings.social.facebook}
                                        onChange={(e) => handleChange('social', 'facebook', e.target.value)}
                                        placeholder="https://facebook.com/siphonet"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Zalo Pay/OA Link</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        value={settings.social.zalo}
                                        onChange={(e) => handleChange('social', 'zalo', e.target.value)}
                                        placeholder="https://zalo.me/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Youtube Channel</label>
                                    <input
                                        type="url"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        value={settings.social.youtube}
                                        onChange={(e) => handleChange('social', 'youtube', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Chat Bubble Settings */}
                    {activeTab === 'chat' && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-lg font-bold text-slate-800 mb-6 border-b pb-4">Cấu hình Bong bóng Chat</h2>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div>
                                        <h3 className="font-bold text-slate-900">Hiển thị Bong bóng Chat</h3>
                                        <p className="text-xs text-slate-500">Bật/tắt cụm nút liên hệ nhanh ở góc màn hình</p>
                                    </div>
                                    <button
                                        onClick={() => handleChange('chat_bubble', 'enabled', !settings.chat_bubble.enabled)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.chat_bubble.enabled ? 'bg-primary' : 'bg-slate-300'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.chat_bubble.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Link Zalo (zalo.me/...)</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            value={settings.chat_bubble.zalo}
                                            onChange={(e) => handleChange('chat_bubble', 'zalo', e.target.value)}
                                            placeholder="https://zalo.me/0913381683"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Link Messenger (m.me/...)</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            value={settings.chat_bubble.messenger}
                                            onChange={(e) => handleChange('chat_bubble', 'messenger', e.target.value)}
                                            placeholder="https://m.me/siphonetjsc"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Số WhatsApp</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            value={settings.chat_bubble.whatsapp}
                                            onChange={(e) => handleChange('chat_bubble', 'whatsapp', e.target.value)}
                                            placeholder="84913381683"
                                        />
                                        <p className="text-[10px] text-slate-500 mt-1">Ghi mã quốc gia trước (ví dụ: 84913...)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
