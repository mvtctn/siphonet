'use client'

import { useState, useEffect, use, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft, Save, Globe, Eye, Settings, Layout, Loader2,
    CheckCircle2, Image as ImageIcon, ExternalLink, Hash,
    Type, AlignLeft, List, Bold, Italic, Link as LinkIcon,
    ChevronRight, Calendar, User, Info, Smartphone
} from 'lucide-react'
import { ImageUpload } from '@/components/admin/ImageUpload'

export default function PageEditor({ params }: { params: Promise<{ id: string }> }) {
    const { id: pageId } = use(params)
    const isNew = pageId === 'new'
    const router = useRouter()
    const contentRef = useRef<HTMLTextAreaElement>(null)

    const [editorMode, setEditorMode] = useState<'html' | 'visual'>('html')
    const visualRef = useRef<HTMLDivElement>(null)

    const [isLoading, setIsLoading] = useState(!isNew)
    const [isSaving, setIsSaving] = useState(false)
    const [activeSidebarTab, setActiveSidebarTab] = useState<'settings' | 'seo' | 'images'>('settings')

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        layout: {
            body: '',
            images: [] as string[]
        },
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
                    layout: {
                        body: result.data.layout?.body || '',
                        images: result.data.layout?.images || []
                    },
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

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault()
        setIsSaving(true)

        // If in visual mode, sync content before saving
        const finalBody = editorMode === 'visual' && visualRef.current
            ? visualRef.current.innerHTML
            : formData.layout.body

        try {
            const url = isNew ? '/api/admin/pages' : `/api/admin/pages/${pageId}`
            const method = isNew ? 'POST' : 'PUT'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    layout: { ...formData.layout, body: finalBody }
                })
            })

            const result = await response.json()
            if (result.success) {
                if (isNew) {
                    router.push('/admin/pages')
                } else {
                    setTimeout(() => setIsSaving(false), 500)
                }
            }
        } catch (error) {
            console.error('Failed to save page', error)
            setIsSaving(false)
        }
    }

    const execCommand = (command: string, value: string = '') => {
        if (editorMode === 'visual') {
            document.execCommand(command, false, value)
        } else {
            // Mapping commands to HTML tags for HTML mode
            const tags: Record<string, [string, string]> = {
                'bold': ['<strong>', '</strong>'],
                'italic': ['<em>', '</em>'],
                'formatBlock:h2': ['<h2>', '</h2>'],
                'formatBlock:h3': ['<h3>', '</h3>'],
                'formatBlock:p': ['<p>', '</p>'],
                'insertUnorderedList': ['<ul><li>', '</li></ul>'],
                'createLink': ['<a href="#">', '</a>'],
            }
            const [open, close] = tags[command] || tags[`${command}:${value}`] || ['', '']
            insertTag(open, close)
        }
    }

    const insertTag = (open: string, close: string) => {
        if (!contentRef.current) return
        const start = contentRef.current.selectionStart
        const end = contentRef.current.selectionEnd
        const text = contentRef.current.value
        const selectedText = text.substring(start, end)
        const newText = text.substring(0, start) + open + selectedText + close + text.substring(end)

        setFormData({ ...formData, layout: { ...formData.layout, body: newText } })

        // Refocus after state update
        setTimeout(() => {
            if (contentRef.current) {
                contentRef.current.focus()
                contentRef.current.setSelectionRange(start + open.length, end + open.length)
            }
        }, 0)
    }

    const toggleMode = (mode: 'html' | 'visual') => {
        if (mode === editorMode) return

        if (mode === 'html' && visualRef.current) {
            setFormData({
                ...formData,
                layout: { ...formData.layout, body: visualRef.current.innerHTML }
            })
        }
        setEditorMode(mode)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
                    <p className="text-slate-500 font-medium">Đang chuẩn bị trình biên tập...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Header / Bar */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/pages"
                            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div className="h-6 w-px bg-slate-200 mx-2" />
                        <h1 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                            {isNew ? 'Trang mới' : 'Biên tập trang'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href={`/${formData.slug === 'home' ? '' : formData.slug}`}
                            target="_blank"
                            className="hidden md:flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 font-bold text-sm transition-colors"
                        >
                            <Eye className="h-4 w-4" />
                            Xem trước
                        </Link>
                        <button
                            onClick={() => handleSubmit()}
                            disabled={isSaving}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 font-bold text-sm active:scale-95"
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {isNew ? 'Đăng ngay' : 'Cập nhật'}
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-[1600px] mx-auto p-6 md:p-8 grid lg:grid-cols-[1fr_380px] gap-8 items-start">
                {/* Main Content Area */}
                <div className="space-y-6">
                    {/* Title & Slug Area */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Nhập tiêu đề trang hẫ dẫn..."
                            className="w-full text-4xl font-extrabold text-slate-900 border-none focus:ring-0 placeholder:text-slate-200 p-0"
                        />

                        {/* Visual Permalink Editor */}
                        <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 border-dashed">
                            <Hash className="h-4 w-4 text-slate-300" />
                            <span className="font-medium">Đường dẫn:</span>
                            <span className="text-slate-400">siphonet.com/</span>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="bg-transparent border-none p-0 focus:ring-0 text-primary font-bold min-w-[50px] underline decoration-primary/30 underline-offset-4"
                                placeholder="..."
                            />
                            <button className="ml-auto text-xs text-primary font-bold hover:underline">Tự động tạo</button>
                        </div>
                    </div>

                    {/* Content Editor Area */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[700px] flex flex-col">
                        {/* Editor Toolbar */}
                        <div className="bg-slate-50/50 border-b border-slate-100 px-4 py-3 flex flex-wrap items-center gap-1.5">
                            <button onClick={() => execCommand('formatBlock', 'h2')} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="Đầu đề 2"><Hash className="h-4 w-4" /></button>
                            <button onClick={() => execCommand('formatBlock', 'h3')} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="Đầu đề 3"><Type className="h-4 w-4" /></button>
                            <div className="w-px h-6 bg-slate-200 mx-1" />
                            <button onClick={() => execCommand('formatBlock', 'p')} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="Đoạn văn"><AlignLeft className="h-4 w-4" /></button>
                            <button onClick={() => execCommand('bold')} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="In đậm"><Bold className="h-4 w-4" /></button>
                            <button onClick={() => execCommand('italic')} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="In nghiêng"><Italic className="h-4 w-4" /></button>
                            <div className="w-px h-6 bg-slate-200 mx-1" />
                            <button onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="Danh sách"><List className="h-4 w-4" /></button>
                            <button onClick={() => execCommand('createLink', prompt('Nhập địa chỉ liên kết:') || '#')} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="Liên kết"><LinkIcon className="h-4 w-4" /></button>

                            <div className="ml-auto flex items-center gap-3">
                                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Chế độ:</span>
                                <div className="flex bg-slate-200 p-1 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => toggleMode('html')}
                                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${editorMode === 'html' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        HTML
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => toggleMode('visual')}
                                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${editorMode === 'visual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Visual
                                    </button>
                                </div>
                            </div>
                        </div>

                        {editorMode === 'html' ? (
                            <textarea
                                ref={contentRef}
                                value={formData.layout.body || ''}
                                onChange={(e) => setFormData({ ...formData, layout: { ...formData.layout, body: e.target.value } })}
                                className="w-full flex-1 p-8 text-lg text-slate-700 font-serif leading-relaxed focus:ring-0 border-none resize-none placeholder:text-slate-200 min-h-[600px]"
                                placeholder="Kể câu chuyện của bạn ở đây... (Sử dụng các nút ở thanh công cụ để định dạng)"
                            />
                        ) : (
                            <div
                                ref={visualRef}
                                contentEditable
                                dangerouslySetInnerHTML={{ __html: formData.layout.body || '' }}
                                className="w-full flex-1 p-8 text-lg text-slate-700 font-serif leading-relaxed focus:outline-none min-h-[600px] prose max-w-none"
                                onBlur={(e) => setFormData({ ...formData, layout: { ...formData.layout, body: e.currentTarget.innerHTML } })}
                            />
                        )}
                    </div>
                </div>

                {/* Sidebar Configuration */}
                <aside className="sticky top-[88px] space-y-6">
                    {/* Status & Visibility Card */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Trạng thái</h3>
                            <div className={`h-2.5 w-2.5 rounded-full ${formData.status === 'published' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Calendar className="h-4 w-4" />
                                    <span>Xuất bản:</span>
                                </div>
                                <span className="font-bold text-slate-900">{isNew ? 'Ngay lập tức' : 'Đã đăng'}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <User className="h-4 w-4" />
                                    <span>Tác giả:</span>
                                </div>
                                <span className="font-bold text-slate-900">Quản trị viên</span>
                            </div>
                        </div>

                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer"
                        >
                            <option value="published">Đã công khai (Hiển thị)</option>
                            <option value="draft">Bản nháp (Ẩn)</option>
                        </select>
                    </div>

                    {/* SEO & Social Card */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">SEO Metadata</h3>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                                <CheckCircle2 className="h-3 w-3" />
                                92/100
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Tiêu đề SEO</label>
                                <input
                                    type="text"
                                    value={formData.meta_title}
                                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                                    placeholder="Tiêu đề hiển thị trên Google..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                />
                                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full bg-emerald-500 transition-all`} style={{ width: `${Math.min((formData.meta_title.length / 60) * 100, 100)}%` }} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Mô tả ngắn (SEO)</label>
                                <textarea
                                    value={formData.meta_description}
                                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                                    placeholder="Nội dung tóm tắt để thu hút người dùng click..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none"
                                />
                                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                                    <span>Tối ưu: 120-160 ký tự</span>
                                    <span className={formData.meta_description.length > 160 ? 'text-red-500' : 'text-emerald-500'}>{formData.meta_description.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Images & Assets Card */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Thư viện ảnh</h3>
                        </div>
                        <div className="p-6">
                            <ImageUpload
                                value={formData.layout.images || []}
                                onChange={(urls) => setFormData({
                                    ...formData,
                                    layout: { ...formData.layout, images: urls }
                                })}
                            />

                            {formData.layout.images && formData.layout.images.length > 0 && (
                                <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <Info className="h-3 w-3" />
                                        Mẹo: Copy link ảnh để chèn vào nội dung
                                    </p>
                                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                                        {formData.layout.images.map((url, i) => (
                                            <div key={i} className="flex items-center gap-2 group">
                                                <div className="flex-1 truncate font-mono text-[10px] text-slate-400 bg-white border border-slate-100 p-1.5 rounded-lg group-hover:text-primary transition-colors">
                                                    {url}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(url)
                                                        alert('Đã copy link ảnh!')
                                                    }}
                                                    className="p-1.5 text-primary hover:bg-primary/10 rounded-lg"
                                                >
                                                    <Save className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Help / View Card */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl shadow-xl text-white">
                        <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-primary" />
                            Tối ưu trên di động
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                            Trang này sẽ được tự động tối ưu hóa để hiển thị tốt nhất trên thiết bị di động.
                        </p>
                        <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all">
                            Cấu hình nâng cao
                        </button>
                    </div>
                </aside>
            </main>
        </div>
    )
}
