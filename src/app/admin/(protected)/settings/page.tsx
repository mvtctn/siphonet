'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Globe, Search, BarChart3, Share2, Settings, Image as ImageIcon } from 'lucide-react'
import { ImageUpload } from '@/components/admin/ImageUpload'

interface SettingsData {
    site_info: {
        title: string
        description: string
        email: string
        phone: string
        address: string
        logo_url: string
        favicon_url: string
        working_hours: string
        map_embed_url: string
    }
    seo: {
        meta_title: string
        meta_description: string
        keywords: string
    }
    analytics: {
        google_analytics_script: string
        google_console_id: string
        facebook_pixel: string
    }
    social: {
        facebook: string
        zalo: string
        youtube: string
        linkedin: string
    }
    chat_bubble: {
        enabled: boolean
        zalo: string
        messenger: string
        whatsapp: string
    }
}

const defaultSettings: SettingsData = {
    site_info: {
        title: '',
        description: '',
        email: '',
        phone: '',
        address: '',
        logo_url: '',
        favicon_url: '',
        working_hours: 'Thứ 2 - Thứ 6: 8:00 - 17:30 | Thứ 7: 8:00 - 12:00',
        map_embed_url: ''
    },
    seo: { meta_title: '', meta_description: '', keywords: '' },
    analytics: { google_analytics_script: '', google_console_id: '', facebook_pixel: '' },
    social: { facebook: '', zalo: '', youtube: '', linkedin: '' },
    chat_bubble: { enabled: true, zalo: '', messenger: '', whatsapp: '' }
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<SettingsData>(defaultSettings)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState<'general' | 'media' | 'seo' | 'analytics' | 'social' | 'chat'>('general')

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/admin/settings')
                const data = await res.json()
                if (data.success && data.data) {
                    // Deep merge with default to ensure structure
                    const mergedSettings = { ...defaultSettings }
                    Object.keys(data.data).forEach(key => {
                        if (mergedSettings[key as keyof SettingsData]) {
                            mergedSettings[key as keyof SettingsData] = {
                                ...mergedSettings[key as keyof SettingsData],
                                ...data.data[key]
                            } as any
                        }
                    })
                    setSettings(mergedSettings)
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

    if (loading) return (
        <div className="p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-primary h-12 w-12" />
            <p className="text-slate-500 font-medium">Đang tải cấu hình...</p>
        </div>
    )

    return (
        <div className="p-6 max-w-6xl mx-auto bg-slate-50/50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <Settings className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Cấu hình hệ thống</h1>
                        <p className="text-slate-500 font-medium">Tùy chỉnh thông tin website, nhận diện thương hiệu và SEO.</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-white rounded-2xl hover:bg-primary-600 transition-all shadow-xl shadow-primary/20 font-bold active:scale-95 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {saving ? 'Đang lưu...' : 'Lưu tất cả cấu hình'}
                </button>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Sidebar Navigation */}
                <div className="col-span-12 lg:col-span-3">
                    <div className="bg-white p-2 rounded-3xl border border-slate-200 shadow-sm sticky top-24">
                        <div className="space-y-1">
                            {[
                                { id: 'general', label: 'Thông tin chung', icon: Globe },
                                { id: 'media', label: 'Logo & Hình ảnh', icon: ImageIcon },
                                { id: 'seo', label: 'Tối ưu SEO', icon: Search },
                                { id: 'analytics', label: 'Mã theo dõi', icon: BarChart3 },
                                { id: 'social', label: 'Mạng xã hội', icon: Share2 },
                                { id: 'chat', label: 'Bong bóng Chat', icon: Share2 },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-bold rounded-2xl transition-all ${activeTab === tab.id
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="col-span-12 lg:col-span-9 space-y-6">
                    {/* General Settings */}
                    {activeTab === 'general' && (
                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-primary rounded-full" />
                                Thông tin chung website
                            </h2>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Tên Website / Thương hiệu</label>
                                        <input
                                            type="text"
                                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                                            value={settings.site_info.title}
                                            onChange={(e) => handleChange('site_info', 'title', e.target.value)}
                                            placeholder="Siphonet"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Hotline liên hệ</label>
                                        <input
                                            type="text"
                                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                                            value={settings.site_info.phone}
                                            onChange={(e) => handleChange('site_info', 'phone', e.target.value)}
                                            placeholder="0913 381 683"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700">Mô tả ngắn (Tagline)</label>
                                    <textarea
                                        rows={2}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                                        value={settings.site_info.description}
                                        onChange={(e) => handleChange('site_info', 'description', e.target.value)}
                                        placeholder="Thiết bị Cơ Điện & Xử Lý Nước"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Email công ty</label>
                                        <input
                                            type="email"
                                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium font-mono"
                                            value={settings.site_info.email}
                                            onChange={(e) => handleChange('site_info', 'email', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Giờ làm việc</label>
                                        <input
                                            type="text"
                                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium font-mono text-xs"
                                            value={settings.site_info.working_hours}
                                            onChange={(e) => handleChange('site_info', 'working_hours', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700">Địa chỉ văn phòng</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                                        value={settings.site_info.address}
                                        onChange={(e) => handleChange('site_info', 'address', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700">Google Maps Embed URL</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium text-xs font-mono"
                                        value={settings.site_info.map_embed_url}
                                        onChange={(e) => handleChange('site_info', 'map_embed_url', e.target.value)}
                                        placeholder="https://www.google.com/maps/embed?..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Media Settings */}
                    {activeTab === 'media' && (
                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-primary rounded-full" />
                                Nhận diện thương hiệu (Logo & Icon)
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Logo Chính</h3>
                                        <p className="text-[10px] text-slate-400 font-bold italic">Khuyên dùng: PNG transparent (200x50px hoặc 4:1)</p>
                                    </div>
                                    <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center gap-6">
                                        <div className="h-24 w-full bg-white rounded-2xl shadow-inner flex items-center justify-center p-4 border border-slate-100">
                                            {settings.site_info.logo_url ? (
                                                <img src={settings.site_info.logo_url} className="h-full w-auto object-contain" alt="Logo preview" />
                                            ) : (
                                                <ImageIcon className="text-slate-200 h-12 w-12" />
                                            )}
                                        </div>
                                        <ImageUpload
                                            value={settings.site_info.logo_url ? [settings.site_info.logo_url] : []}
                                            onChange={(urls) => handleChange('site_info', 'logo_url', urls[0] || '')}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Favicon</h3>
                                        <p className="text-[10px] text-slate-400 font-bold italic">Khuyên dùng: PNG/ICO (32x32px)</p>
                                    </div>
                                    <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center gap-6">
                                        <div className="h-24 w-24 bg-white rounded-2xl shadow-inner flex items-center justify-center p-6 border border-slate-100">
                                            {settings.site_info.favicon_url ? (
                                                <img src={settings.site_info.favicon_url} className="h-full w-full object-contain" alt="Favicon preview" />
                                            ) : (
                                                <ImageIcon className="text-slate-200 h-8 w-8" />
                                            )}
                                        </div>
                                        <ImageUpload
                                            value={settings.site_info.favicon_url ? [settings.site_info.favicon_url] : []}
                                            onChange={(urls) => handleChange('site_info', 'favicon_url', urls[0] || '')}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SEO Settings */}
                    {activeTab === 'seo' && (
                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-primary rounded-full" />
                                Tối ưu công cụ tìm kiếm (SEO)
                            </h2>
                            <div className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700">Meta Title mặc định</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                                        value={settings.seo.meta_title}
                                        onChange={(e) => handleChange('seo', 'meta_title', e.target.value)}
                                        placeholder="Siphonet - Thiết bị Cơ Điện & Xử Lý Nước"
                                    />
                                    <p className="text-[10px] text-slate-400 font-medium">Tiêu đề xuất hiện trên tab trình duyệt và kết quả tìm kiếm (Dưới 60 ký tự).</p>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700">Meta Description mặc định</label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                                        value={settings.seo.meta_description}
                                        onChange={(e) => handleChange('seo', 'meta_description', e.target.value)}
                                        placeholder="Mô tả về website của bạn..."
                                    />
                                    <p className="text-[10px] text-slate-400 font-medium">Đoạn tóm tắt nội dung website (Dưới 160 ký tự).</p>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700">Keywords (Từ khóa)</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium text-xs font-mono"
                                        value={settings.seo.keywords}
                                        onChange={(e) => handleChange('seo', 'keywords', e.target.value)}
                                        placeholder="bơm nước, xử lý nước, siphonet, m&e..."
                                    />
                                    <p className="text-[10px] text-slate-400 font-medium">Các từ khóa chính cách nhau bởi dấu phẩy (,).</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Analytics Settings */}
                    {activeTab === 'analytics' && (
                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-primary rounded-full" />
                                Tracking & Analytics
                            </h2>
                            <div className="space-y-6">
                                <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl flex items-start gap-4">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                                        <Globe size={20} />
                                    </div>
                                    <p className="text-sm text-blue-700 font-medium leading-relaxed">
                                        Các đoạn mã này sẽ được chèn tự động vào thẻ <strong>&lt;head&gt;</strong> của website để theo dõi lưu lượng và chuyển đổi.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5 col-span-full">
                                        <label className="text-sm font-bold text-slate-700">Mã Google Analytics (Toàn bộ code)</label>
                                        <textarea
                                            rows={8}
                                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium text-xs font-mono"
                                            value={settings.analytics.google_analytics_script}
                                            onChange={(e) => handleChange('analytics', 'google_analytics_script', e.target.value)}
                                            placeholder="<!-- Google tag (gtag.js) -->\n<script async src='...'></script>\n<script>\n  ...\n</script>"
                                        />
                                        <p className="text-[10px] text-slate-400 font-medium italic">Sao chép và dán toàn bộ đoạn mã Google cung cấp vào đây.</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Facebook Pixel ID</label>
                                        <input
                                            type="text"
                                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold text-xs font-mono"
                                            value={settings.analytics.facebook_pixel}
                                            onChange={(e) => handleChange('analytics', 'facebook_pixel', e.target.value)}
                                            placeholder="123456789012345"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700">Google Search Console Identification Code</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium text-xs font-mono"
                                        value={settings.analytics.google_console_id}
                                        onChange={(e) => handleChange('analytics', 'google_console_id', e.target.value)}
                                        placeholder='meta name="google-site-verification" content="..."'
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Social Settings */}
                    {activeTab === 'social' && (
                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-primary rounded-full" />
                                Mạng xã hội & Cộng đồng
                            </h2>
                            <div className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700">Facebook Page URL</label>
                                    <input
                                        type="url"
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                                        value={settings.social.facebook}
                                        onChange={(e) => handleChange('social', 'facebook', e.target.value)}
                                        placeholder="https://facebook.com/siphonet"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700">YouTube Channel URL</label>
                                    <input
                                        type="url"
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                                        value={settings.social.youtube}
                                        onChange={(e) => handleChange('social', 'youtube', e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Zalo Official Account Link</label>
                                        <input
                                            type="text"
                                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                                            value={settings.social.zalo}
                                            onChange={(e) => handleChange('social', 'zalo', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">LinkedIn Company URL</label>
                                        <input
                                            type="url"
                                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                                            value={settings.social.linkedin}
                                            onChange={(e) => handleChange('social', 'linkedin', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Chat Settings */}
                    {activeTab === 'chat' && (
                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-primary rounded-full" />
                                Nút liên hệ nhanh (Chat Bubble)
                            </h2>
                            <div className="space-y-8">
                                <div className="p-6 bg-primary/5 border border-primary/10 rounded-3xl flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-white rounded-xl shadow-sm text-primary">
                                            <Share2 size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">Bật cụm nút liên hệ</h3>
                                            <p className="text-xs text-slate-500 font-medium">Kích hoạt bong bóng chat ở góc dưới màn hình website.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleChange('chat_bubble', 'enabled', !settings.chat_bubble.enabled)}
                                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all focus:outline-none ${settings.chat_bubble.enabled ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-slate-300 shadow-inner'}`}
                                    >
                                        <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${settings.chat_bubble.enabled ? 'translate-x-[1.65rem]' : 'translate-x-1'}`} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Zalo URL</label>
                                        <input
                                            type="text"
                                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium font-mono text-xs"
                                            value={settings.chat_bubble.zalo}
                                            onChange={(e) => handleChange('chat_bubble', 'zalo', e.target.value)}
                                            placeholder="https://zalo.me/0913381683"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Messenger Link</label>
                                        <input
                                            type="text"
                                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium font-mono text-xs"
                                            value={settings.chat_bubble.messenger}
                                            onChange={(e) => handleChange('chat_bubble', 'messenger', e.target.value)}
                                            placeholder="https://m.me/siphonet"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">WhatsApp Number</label>
                                        <input
                                            type="text"
                                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium font-mono text-xs"
                                            value={settings.chat_bubble.whatsapp}
                                            onChange={(e) => handleChange('chat_bubble', 'whatsapp', e.target.value)}
                                            placeholder="84913381683"
                                        />
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
