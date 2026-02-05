'use client'

import { useState, useEffect, use, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft, Save, Eye, Layout, Loader2,
    CheckCircle2, Image as ImageIcon, Hash,
    Type, AlignLeft, List, Bold, Italic, Link as LinkIcon,
    Calendar, User, Info, Smartphone, Tag, Globe, Settings, X
} from 'lucide-react'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { MediaLibrary } from '@/components/admin/MediaLibrary'

export default function PostEditor({ params }: { params: Promise<{ id: string }> }) {
    const { id: postId } = use(params)
    const isNew = postId === 'new'
    const router = useRouter()
    const contentRef = useRef<HTMLTextAreaElement>(null)

    const [editorMode, setEditorMode] = useState<'html' | 'visual'>('visual')
    const visualRef = useRef<HTMLDivElement>(null)

    const [isLoading, setIsLoading] = useState(!isNew)
    const [isSaving, setIsSaving] = useState(false)
    const [isShowLibraryModal, setIsShowLibraryModal] = useState(false)
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([])

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        category: '',
        featured_image_url: '',
        status: 'draft',
        author: '',
        tags: [] as string[],
        meta_title: '',
        meta_description: '',
        focus_keywords: ''
    })

    useEffect(() => {
        fetchCategories()
        if (!isNew) {
            fetchPost()
        }
    }, [postId])

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories?type=post')
            const data = await res.json()
            if (data.success) setCategories(data.data)
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    const fetchPost = async () => {
        try {
            const response = await fetch(`/api/admin/posts?id=${postId}`)
            const result = await response.json()
            if (result.success && result.data) {
                const post = result.data
                setFormData({
                    title: post.title || '',
                    slug: post.slug || '',
                    content: post.content || '',
                    excerpt: post.excerpt || '',
                    category: post.category || '',
                    featured_image_url: post.featured_image_url || '',
                    status: post.status || 'draft',
                    author: post.author || '',
                    tags: post.tags || [],
                    meta_title: post.meta_title || '',
                    meta_description: post.meta_description || '',
                    focus_keywords: post.focus_keywords || ''
                })
            }
        } catch (error) {
            console.error('Failed to fetch post', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault()
        setIsSaving(true)

        // Sync visual content
        const finalContent = editorMode === 'visual' && visualRef.current
            ? visualRef.current.innerHTML
            : formData.content

        try {
            const url = '/api/admin/posts'
            const method = isNew ? 'POST' : 'PUT'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    id: isNew ? undefined : postId,
                    content: finalContent,
                    image: formData.featured_image_url // Map back to what API expects
                })
            })

            const result = await response.json()
            if (result.success) {
                if (isNew) {
                    router.push('/admin/posts')
                } else {
                    setTimeout(() => setIsSaving(false), 500)
                }
            } else {
                alert('Lỗi: ' + result.error)
                setIsSaving(false)
            }
        } catch (error) {
            console.error('Failed to save post', error)
            alert('Có lỗi xảy ra khi lưu')
            setIsSaving(false)
        }
    }

    const execCommand = (command: string, value: string = '') => {
        if (editorMode === 'visual') {
            document.execCommand(command, false, value)
        } else {
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

        setFormData({ ...formData, content: newText })
        setTimeout(() => {
            if (contentRef.current) {
                contentRef.current.focus()
                contentRef.current.setSelectionRange(start + open.length, end + open.length)
            }
        }, 0)
    }

    const generateSlug = () => {
        const slug = formData.title
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .replace(/([^0-9a-z-\s])/g, '')
            .replace(/(\s+)/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '')

        setFormData({ ...formData, slug })
    }

    const handleInsertMedia = (url: string) => {
        const html = `<img src="${url}" alt="" class="max-w-full h-auto rounded-2xl shadow-lg my-8 mx-auto block" />\n`

        if (editorMode === 'visual') {
            document.execCommand('insertHTML', false, html)
        } else {
            insertTag(html, '')
        }
        setIsShowLibraryModal(false)
    }

    const toggleMode = (mode: 'html' | 'visual') => {
        if (mode === editorMode) return
        if (mode === 'html' && visualRef.current) {
            setFormData({ ...formData, content: visualRef.current.innerHTML })
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
                            href="/admin/posts"
                            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div className="h-6 w-px bg-slate-200 mx-2" />
                        <h1 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                            {isNew ? 'Bài viết mới' : 'Biên tập bài viết'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href={`/tin-tuc/${formData.slug}`}
                            target="_blank"
                            className="hidden md:flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 font-bold text-sm transition-colors"
                        >
                            <Eye className="h-4 w-4" />
                            Xem thử
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
                <div className="space-y-6">
                    {/* Title & Slug */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Nhập tiêu đề bài viết..."
                            className="w-full text-4xl font-extrabold text-slate-900 border-none focus:ring-0 placeholder:text-slate-200 p-0"
                        />
                        <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 border-dashed">
                            <Hash className="h-4 w-4 text-slate-300" />
                            <span className="font-medium">Đường dẫn:</span>
                            <span className="text-slate-400">siphonet.com/tin-tuc/</span>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="bg-transparent border-none p-0 focus:ring-0 text-primary font-bold min-w-[50px] underline decoration-primary/30 underline-offset-4"
                                placeholder="..."
                            />
                            <button
                                onClick={generateSlug}
                                className="ml-auto text-xs text-primary font-bold hover:underline"
                            >
                                Tự động tạo
                            </button>
                        </div>
                    </div>

                    {/* Content Editor */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[700px] flex flex-col">
                        <div className="bg-slate-50/50 border-b border-slate-100 px-4 py-3 flex flex-wrap items-center gap-1.5">
                            <button onClick={() => execCommand('formatBlock', 'h2')} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="Đầu đề 2"><Hash className="h-4 w-4" /></button>
                            <button onClick={() => execCommand('formatBlock', 'h3')} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="Đầu đề 3"><Type className="h-4 w-4" /></button>
                            <div className="w-px h-6 bg-slate-200 mx-1" />
                            <button onClick={() => execCommand('bold')} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="In đậm"><Bold className="h-4 w-4" /></button>
                            <button onClick={() => execCommand('italic')} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="In nghiêng"><Italic className="h-4 w-4" /></button>
                            <div className="w-px h-6 bg-slate-200 mx-1" />
                            <button onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="Danh sách"><List className="h-4 w-4" /></button>
                            <button onClick={() => execCommand('createLink', prompt('Nhập địa chỉ liên kết:') || '#')} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="Liên kết"><LinkIcon className="h-4 w-4" /></button>
                            <button onClick={() => setIsShowLibraryModal(true)} className="p-2 hover:bg-white rounded-lg text-emerald-600 transition-all hover:text-emerald-700 active:scale-90" title="Chèn ảnh từ thư viện"><ImageIcon className="h-4 w-4" /></button>

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
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="w-full flex-1 p-8 text-lg text-slate-700 font-serif leading-relaxed focus:ring-0 border-none resize-none placeholder:text-slate-200 min-h-[600px]"
                                placeholder="Viết nội dung bài viết ở đây..."
                            />
                        ) : (
                            <div
                                ref={visualRef}
                                contentEditable
                                dangerouslySetInnerHTML={{ __html: formData.content }}
                                className="w-full flex-1 p-8 text-lg text-slate-700 font-serif leading-relaxed focus:outline-none min-h-[600px] prose max-w-none"
                                onBlur={(e) => setFormData({ ...formData, content: e.currentTarget.innerHTML })}
                            />
                        )}
                    </div>

                    {/* Excerpt */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-3">
                        <label className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <AlignLeft className="h-4 w-4 text-primary" />
                            Tóm tắt bài viết
                        </label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            rows={3}
                            placeholder="Nhập đoạn giới thiệu ngắn cho bài viết..."
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none shadow-inner"
                        />
                    </div>
                </div>

                <aside className="sticky top-[88px] space-y-6">
                    {/* Status & Options */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Trạng thái</h3>
                            <div className={`h-2.5 w-2.5 rounded-full ${formData.status === 'published' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                        </div>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer"
                        >
                            <option value="published">Đã công khai</option>
                            <option value="draft">Bản nháp</option>
                        </select>
                    </div>

                    {/* Author & Tags */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-5">
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Tác giả</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                        placeholder="Tên tác giả..."
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Thẻ (Tags)</label>
                                <div className="relative group">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        value={formData.tags.join(', ')}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                                        placeholder="Công nghệ, Siphonet..."
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-2 font-medium italic">Phân cách bằng dấu phẩy</p>
                            </div>
                        </div>
                    </div>

                    {/* Category Selection */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Danh mục</h3>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer"
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Featured Image */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Ảnh đại diện</h3>
                            <ImageIcon className="h-4 w-4 text-slate-400" />
                        </div>
                        <div className="p-6">
                            <ImageUpload
                                value={formData.featured_image_url ? [formData.featured_image_url] : []}
                                onChange={(urls) => setFormData({ ...formData, featured_image_url: urls[0] || '' })}
                            />
                        </div>
                    </div>

                    {/* SEO Meta */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">SEO Metadata</h3>
                            <Globe className="h-4 w-4 text-slate-400" />
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Tiêu đề SEO</label>
                                <input
                                    type="text"
                                    value={formData.meta_title}
                                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                />
                                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full bg-emerald-500 transition-all`} style={{ width: `${Math.min((formData.meta_title.length / 60) * 100, 100)}%` }} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Mô tả SEO</label>
                                <textarea
                                    value={formData.meta_description}
                                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all resize-none font-medium"
                                />
                                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                                    <span>Tối ưu: 120-160 ký tự</span>
                                    <span className={formData.meta_description.length > 160 ? 'text-red-500' : 'text-emerald-500'}>{formData.meta_description.length}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Từ khóa chính</label>
                                <textarea
                                    value={formData.focus_keywords}
                                    onChange={(e) => setFormData({ ...formData, focus_keywords: e.target.value })}
                                    rows={2}
                                    placeholder="Cách thoát nước siphonet, hệ thống thoát nước..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all resize-none font-medium"
                                />
                            </div>
                        </div>
                    </div>
                </aside>
            </main>

            {/* Library Modal */}
            {isShowLibraryModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-[40px] w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-white/20">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Thư viện Media</h2>
                                <p className="text-sm text-slate-500 font-medium">Chọn một ảnh để chèn vào bài viết của bạn.</p>
                            </div>
                            <button
                                onClick={() => setIsShowLibraryModal(false)}
                                className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                            >
                                <X size={28} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden p-8">
                            <MediaLibrary onSelect={handleInsertMedia} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
