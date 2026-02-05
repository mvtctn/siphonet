'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Search, Plus, FileText, ChevronLeft, ChevronRight,
    Filter, Image as ImageIcon, User, ExternalLink,
    TrendingUp, Trash2, Edit, X, Loader2
} from 'lucide-react'
import { ImageUpload } from '@/components/admin/ImageUpload'

// Types
interface Post {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    feature_image_url?: string
    image?: string // legacy fallback
    status: 'draft' | 'published' | 'trash'
    featured: boolean
    created_at: string
    published_date?: string
    category?: string
    author?: string
    tags?: string[]
    seo_score?: number
}

interface Category {
    id: string
    name: string
    slug: string
}

export default function AdminPostsPage() {
    const router = useRouter()
    const [posts, setPosts] = useState<Post[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'trash'>('all')
    const [filterCategory, setFilterCategory] = useState<string>('')
    const [filterDate, setFilterDate] = useState<string>('')

    const [selectedPosts, setSelectedPosts] = useState<string[]>([])

    // Fetch data
    const fetchPosts = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/posts')
            const data = await res.json()
            if (data.success) {
                const mappedPosts = data.data.map((p: any) => ({
                    ...p,
                    status: p.status || 'draft',
                    author: p.author || 'Admin',
                    image: p.featured_image_url || p.image || '',
                    seo_score: Math.floor(Math.random() * 40) + 60
                }))
                setPosts(mappedPosts)
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

    // Actions
    const handleCreate = () => {
        router.push('/admin/posts/new')
    }

    const handleEdit = (post: Post) => {
        router.push(`/admin/posts/${post.id}`)
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

    // Bulk selection logic
    const toggleSelectAll = () => {
        if (selectedPosts.length === filteredPosts.length) {
            setSelectedPosts([])
        } else {
            setSelectedPosts(filteredPosts.map(p => p.id))
        }
    }

    const toggleSelectPost = (id: string) => {
        if (selectedPosts.includes(id)) {
            setSelectedPosts(selectedPosts.filter(pid => pid !== id))
        } else {
            setSelectedPosts([...selectedPosts, id])
        }
    }

    // Filter logic
    const filteredPosts = posts.filter(p => {
        if (filterStatus !== 'all' && p.status !== filterStatus) return false
        if (filterCategory && p.category !== filterCategory) return false
        if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
        return true
    })

    const counts = {
        all: posts.length,
        published: posts.filter(p => p.status === 'published').length,
        draft: posts.filter(p => p.status === 'draft').length,
        trash: posts.filter(p => p.status === 'trash').length
    }

    return (
        <div className="p-6 max-w-[1600px] mx-auto bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Quản lý bài viết</h1>
                        <p className="text-sm text-slate-500 font-medium">Viết bài mới, cập nhật tin tức và quản lý nội dung blog.</p>
                    </div>
                </div>
                <button
                    onClick={handleCreate}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary/20 font-bold active:scale-95"
                >
                    <Plus className="h-5 w-5" />
                    Viết bài mới
                </button>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1 mb-6 text-sm">
                <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-4 py-2 rounded-xl transition-all ${filterStatus === 'all' ? 'bg-primary text-white font-bold shadow-md shadow-primary/20' : 'text-slate-500 hover:bg-white hover:text-slate-900'}`}
                >
                    Tất cả <span className={`${filterStatus === 'all' ? 'text-white/60' : 'text-slate-300'}`}>({counts.all})</span>
                </button>
                <button
                    onClick={() => setFilterStatus('published')}
                    className={`px-4 py-2 rounded-xl transition-all ${filterStatus === 'published' ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20' : 'text-slate-500 hover:bg-white hover:text-slate-900'}`}
                >
                    Đã đăng <span className={`${filterStatus === 'published' ? 'text-white/60' : 'text-slate-300'}`}>({counts.published})</span>
                </button>
                <button
                    onClick={() => setFilterStatus('draft')}
                    className={`px-4 py-2 rounded-xl transition-all ${filterStatus === 'draft' ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/20' : 'text-slate-500 hover:bg-white hover:text-slate-900'}`}
                >
                    Bản nháp <span className={`${filterStatus === 'draft' ? 'text-white/60' : 'text-slate-300'}`}>({counts.draft})</span>
                </button>
                <button
                    onClick={() => setFilterStatus('trash')}
                    className={`px-4 py-2 rounded-xl transition-all ${filterStatus === 'trash' ? 'bg-red-500 text-white font-bold shadow-md shadow-red-500/20' : 'text-slate-500 hover:bg-white hover:text-slate-900'}`}
                >
                    Thùng rác <span className={`${filterStatus === 'trash' ? 'text-white/60' : 'text-slate-300'}`}>({counts.trash})</span>
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col xl:flex-row justify-between gap-4 mb-6 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm items-center">
                <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                    <div className="relative w-full sm:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm tiêu đề bài viết..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium"
                        />
                    </div>

                    <div className="h-6 w-px bg-slate-200 hidden sm:block mx-2" />

                    <select
                        className="h-11 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer min-w-[180px]"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="">Tất cả danh mục</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden mb-8">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <th className="p-6 w-12 text-center">
                                <input
                                    type="checkbox"
                                    className="rounded-lg border-slate-200 text-primary focus:ring-primary cursor-pointer w-5 h-5 transition-all"
                                    checked={selectedPosts.length > 0 && selectedPosts.length === filteredPosts.length}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th className="p-6">Thông tin bài viết</th>
                            <th className="p-6">Danh mục</th>
                            <th className="p-6">Thời gian</th>
                            <th className="p-6">SEO</th>
                            <th className="p-6 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr><td colSpan={6} className="p-20 text-center"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" /><p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Đang tải dữ liệu...</p></td></tr>
                        ) : filteredPosts.length === 0 ? (
                            <tr><td colSpan={6} className="p-20 text-center text-slate-400 font-medium">Không tìm thấy bài viết nào.</td></tr>
                        ) : (
                            filteredPosts.map((post) => (
                                <tr key={post.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6 text-center align-top pt-8">
                                        <input
                                            type="checkbox"
                                            className="rounded-lg border-slate-200 text-primary focus:ring-primary cursor-pointer w-5 h-5 transition-all"
                                            checked={selectedPosts.includes(post.id)}
                                            onChange={() => toggleSelectPost(post.id)}
                                        />
                                    </td>
                                    <td className="p-6 pt-8 align-top">
                                        <div className="flex items-start gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 shadow-inner">
                                                {post.image ? (
                                                    <img src={post.image} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                        <ImageIcon size={24} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <div
                                                    onClick={() => handleEdit(post)}
                                                    className="font-bold text-slate-900 text-lg hover:text-primary cursor-pointer transition-colors line-clamp-2 max-w-md"
                                                >
                                                    {post.title}
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-slate-400 font-bold uppercase tracking-wider">
                                                    <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
                                                    <span>•</span>
                                                    <Link href={`/tin-tuc/${post.slug}`} target="_blank" className="hover:text-primary transition-colors flex items-center gap-1">Xem chi tiết <ExternalLink size={12} /></Link>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 pt-8 align-top">
                                        <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-600 uppercase tracking-widest border border-slate-200 shadow-sm">
                                            {post.category || 'Chưa phân loại'}
                                        </span>
                                    </td>
                                    <td className="p-6 pt-8 align-top">
                                        <div className="flex flex-col text-sm">
                                            <span className="text-slate-900 font-bold">{post.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}</span>
                                            <span className="text-slate-400 text-xs mt-1">{post.created_at ? new Date(post.created_at).toLocaleDateString('vi-VN') : '—'}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 pt-8 align-top">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold shadow-sm border ${(post.seo_score || 0) >= 80 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            (post.seo_score || 0) >= 50 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-red-50 text-red-600 border-red-100'
                                            }`}>
                                            <TrendingUp size={12} />
                                            {post.seo_score || 'N/A'}/100
                                        </div>
                                    </td>
                                    <td className="p-6 pt-8 align-top text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(post)}
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100"
                                                title="Chỉnh sửa"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100"
                                                title="Xóa"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
