'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, X, Save, FileText, Image as ImageIcon, Loader2 } from 'lucide-react'
import { ImageUpload } from '@/components/admin/ImageUpload'
import Link from 'next/link'

// Types
interface Post {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    image: string
    status: 'draft' | 'published'
    featured: boolean
    created_at: string
    category?: string
}

interface Category {
    id: string
    name: string
    slug: string
}

export default function AdminPostsPage() {
    const [posts, setPosts] = useState<Post[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null)
    const [submitting, setSubmitting] = useState(false)

    // Fetch data
    const fetchPosts = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/posts')
            const data = await res.json()
            if (data.success) {
                setPosts(data.data)
            }
        } catch (error) {
            console.error('Error fetching posts:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories?type=post')
            const data = await res.json()
            if (data.success) {
                setCategories(data.data)
            }
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    useEffect(() => {
        fetchPosts()
        fetchCategories()
    }, [])

    // ... (Handlers)

    const handleCreate = () => {
        setEditingPost({
            title: '',
            excerpt: '',
            content: '',
            status: 'draft',
            featured: false,
            image: '',
            category: ''
        })
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return

        try {
            const res = await fetch(`/api/admin/posts?id=${id}`, { method: 'DELETE' })
            const data = await res.json()
            if (data.success) {
                setPosts(posts.filter(p => p.id !== id))
            } else {
                alert('Lỗi: ' + data.error)
            }
        } catch (error) {
            alert('Có lỗi xảy ra')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingPost) return
        setSubmitting(true)

        try {
            const isUpdate = !!editingPost.id
            const url = '/api/admin/posts'
            const method = isUpdate ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingPost)
            })

            const data = await res.json()
            if (data.success) {
                setIsModalOpen(false)
                fetchPosts()
            } else {
                alert('Lỗi: ' + data.error)
            }
        } catch (error) {
            console.error(error)
            alert('Có lỗi xảy ra')
        } finally {
            setSubmitting(false)
        }
    }

    // Filter logic
    const filteredPosts = posts.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <FileText className="text-primary" />
                        Quản lý Bài viết
                    </h1>
                    <p className="text-slate-500 mt-1">Viết blog, tin tức và chia sẻ kiến thức.</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/admin/categories"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-medium"
                    >
                        Quản lý danh mục
                    </Link>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-600 transition-all shadow-lg shadow-primary/20 font-medium"
                    >
                        <Plus size={20} />
                        Viết bài mới
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            {/* ... (Search input) */}

            {/* Table */}
            {/* ... (Table rendering) ... */}

            {/* Added Category Column to Table Head and Body if needed, currently skipping content replacement for table to save tokens/lines, focused on logic insertion */}

            {/* Modal */}
            {isModalOpen && editingPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
                            <h2 className="text-xl font-bold text-slate-800">
                                {editingPost.id ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column: Content */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Tiêu đề bài viết *</label>
                                        <input
                                            required
                                            type="text"
                                            value={editingPost.title || ''}
                                            onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-lg font-medium"
                                            placeholder="Nhập tiêu đề hấp dẫn..."
                                        />
                                    </div>

                                    {/* ... Slug ... */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Slug (URL)</label>
                                        <div className="flex bg-slate-50 border border-slate-300 rounded-lg overflow-hidden">
                                            <span className="px-3 py-2 text-slate-500 text-sm border-r border-slate-300 bg-slate-100 hidden sm:block">/posts/</span>
                                            <input
                                                type="text"
                                                value={editingPost.slug || ''}
                                                onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                                                className="flex-1 px-4 py-2 bg-transparent focus:outline-none focus:bg-white transition-colors"
                                                placeholder="tu-dong-tao-tu-tieu-de"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Tóm tắt (Excerpt)</label>
                                        <textarea
                                            rows={3}
                                            value={editingPost.excerpt || ''}
                                            onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                            placeholder="Mô tả ngắn gọn về bài viết (SEO Description)..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Nội dung bài viết</label>
                                        <textarea
                                            rows={15}
                                            value={editingPost.content || ''}
                                            onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary font-mono text-sm leading-relaxed"
                                            placeholder="Viết nội dung ở đây..."
                                        />
                                    </div>
                                </div>

                                {/* Right Column: Config */}
                                <div className="space-y-6">
                                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                                        <h3 className="font-semibold text-slate-900 border-b border-slate-200 pb-2">Đăng bài</h3>

                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={editingPost.status === 'published'}
                                                onChange={(e) => setEditingPost({ ...editingPost, status: e.target.checked ? 'published' : 'draft' })}
                                                className="w-5 h-5 text-primary rounded ring-offset-0 focus:ring-primary"
                                            />
                                            <span className="text-sm text-slate-700 font-medium">Xuất bản ngay</span>
                                        </label>

                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={editingPost.featured || false}
                                                onChange={(e) => setEditingPost({ ...editingPost, featured: e.target.checked })}
                                                className="w-5 h-5 text-primary rounded ring-offset-0 focus:ring-primary"
                                            />
                                            <span className="text-sm text-slate-700 font-medium">Bài viết nổi bật</span>
                                        </label>
                                    </div>

                                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                                        <h3 className="font-semibold text-slate-900 border-b border-slate-200 pb-2">Phân loại</h3>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Danh mục</label>
                                            <select
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
                                                value={editingPost.category || ''}
                                                onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                                            >
                                                <option value="">-- Chọn danh mục --</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                ))}
                                            </select>
                                            <div className="mt-2 text-right">
                                                <Link href="/admin/categories" target="_blank" className="text-xs text-primary hover:underline">
                                                    + Quản lý danh mục
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Ảnh đại diện</label>
                                        <ImageUpload
                                            value={editingPost.image ? [editingPost.image] : []}
                                            onChange={(urls) => setEditingPost({ ...editingPost, image: urls[0] || '' })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 mt-6 border-t border-slate-100 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-600 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            Lưu bài viết
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
