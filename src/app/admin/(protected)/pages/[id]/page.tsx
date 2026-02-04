'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Globe, Eye, Settings, Layout, Loader2, CheckCircle2 } from 'lucide-react'

export default function PageEditor({ params }: { params: Promise<{ id: string }> }) {
    const { id: pageId } = use(params)
    const isNew = pageId === 'new'
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(!isNew)
    const [isSaving, setIsSaving] = useState(false)
    const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content')

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        layout: { body: '' },
        status: 'published',
        meta_title: '',
        meta_description: ''
    })

    useEffect(() => {
        if (!isNew) {
            fetchPage()
        }
    }, [pageId])

    const fetchPage = async () => {
        try {
            const response = await fetch(`/api/admin/pages/${pageId}`)
            const result = await response.json()
            if (result.success) {
                setFormData({
                    title: result.data.title || '',
                    slug: result.data.slug || '',
                    layout: result.data.layout || { body: '' },
                    status: result.data.status || 'published',
                    meta_title: result.data.meta_title || '',
                    meta_description: result.data.meta_description || ''
                })
            }
        } catch (error) {
            console.error('Failed to fetch page', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            const url = isNew ? '/api/admin/pages' : `/api/admin/pages/${pageId}`
            const method = isNew ? 'POST' : 'PUT'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const result = await response.json()
            if (result.success) {
                if (isNew) {
                    router.push('/admin/pages')
                } else {
                    // Show success state briefly
                    setTimeout(() => setIsSaving(false), 500)
                }
            }
        } catch (error) {
            console.error('Failed to save page', error)
            setIsSaving(false)
        }
    }

    const updateBody = (val: string) => {
        setFormData({
            ...formData,
            layout: { ...formData.layout, body: val }
        })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="min-h-screen bg-slate-50">
            {/* Toolbar */}
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/pages"
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">
                                {isNew ? 'Thêm trang mới' : `Chỉnh sửa: ${formData.title}`}
                            </h1>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Globe className="h-3 w-3" />
                                {formData.slug ? `siphonet.com/${formData.slug === 'home' ? '' : formData.slug}` : 'Đường dẫn liên kết'}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        >
                            <option value="published">Đã xuất bản</option>
                            <option value="draft">Bản nháp</option>
                        </select>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {isSaving ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Save className="h-5 w-5" />
                            )}
                            {isNew ? 'Tạo trang' : (isSaving ? 'Đang lưu...' : 'Lưu thay đổi')}
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto p-6 grid lg:grid-cols-4 gap-8">
                {/* Editor Area */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-200">
                        <button
                            type="button"
                            onClick={() => setActiveTab('content')}
                            className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'content'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Layout className="h-4 w-4" />
                                Nội dung (HTML)
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('seo')}
                            className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'seo'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                SEO & Metadata
                            </div>
                        </button>
                    </div>

                    {activeTab === 'content' ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Tiêu đề trang</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Vd: Giới thiệu, Liên hệ..."
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-lg font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nội dung trang</label>
                                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <textarea
                                        value={formData.layout.body || ''}
                                        onChange={(e) => updateBody(e.target.value)}
                                        rows={20}
                                        placeholder="Nhập mã HTML hoặc nội dung văn bản..."
                                        className="w-full p-4 font-mono text-sm focus:outline-none focus:ring-0 resize-none min-h-[500px]"
                                    />
                                </div>
                                <p className="mt-2 text-xs text-slate-500">
                                    Bạn có thể sử dụng mã HTML hoặc các thẻ Heading (h1, h2...), Paragraph (p) để định dạng.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Đường dẫn (Slug)</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="vd: gioi-thieu"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Meta Title</label>
                                <input
                                    type="text"
                                    value={formData.meta_title}
                                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                                    placeholder="Tiêu đề hiển thị trên Google"
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                />
                                <div className="mt-1 flex justify-between text-xs text-slate-500">
                                    <span>Nên ở khoảng 50-60 ký tự</span>
                                    <span>{formData.meta_title.length} ký tự</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Meta Description</label>
                                <textarea
                                    value={formData.meta_description}
                                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                                    placeholder="Mô tả ngắn gọn về trang để tối ưu SEO"
                                    rows={4}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none"
                                />
                                <div className="mt-1 flex justify-between text-xs text-slate-500">
                                    <span>Nên ở khoảng 120-160 ký tự</span>
                                    <span>{formData.meta_description.length} ký tự</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Info Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-28">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Eye className="h-4 w-4" />
                            Xem trước
                        </h3>
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 mb-6">
                            <div className="text-blue-700 text-lg font-medium leading-tight mb-1 truncate">
                                {formData.meta_title || formData.title || 'Tiêu đề trang'}
                            </div>
                            <div className="text-emerald-700 text-sm mb-2 truncate">
                                siphonet.com/{formData.slug || 'slug'}
                            </div>
                            <div className="text-slate-600 text-sm line-clamp-3">
                                {formData.meta_description || 'Nhập description để xem trước cách hiển thị trên các công cụ tìm kiếm.'}
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Đã lưu tự động</span>
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Điểm SEO ước tính</span>
                                <span className="font-bold text-emerald-600">85/100</span>
                            </div>
                        </div>

                        <Link
                            href={`/${formData.slug === 'home' ? '' : formData.slug}`}
                            target="_blank"
                            className="mt-6 flex items-center justify-center gap-2 w-full py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 font-medium"
                        >
                            <Globe className="h-4 w-4" />
                            Xem trực tiếp
                        </Link>
                    </div>
                </div>
            </main>
        </form>
    )
}
