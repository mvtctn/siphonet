'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, X, Save, Layers, Loader2, Globe } from 'lucide-react'

// Types
interface Page {
    id: string
    title: string
    slug: string
    content: string
    status: 'draft' | 'published'
    meta_title?: string
    meta_description?: string
    updated_at: string
}

export default function AdminPagesPage() {
    const [pages, setPages] = useState<Page[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingPage, setEditingPage] = useState<Partial<Page> | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const fetchPages = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/pages')
            const data = await res.json()
            if (data.success) setPages(data.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchPages() }, [])

    const handleEdit = (page: Page) => {
        setEditingPage(page)
        setIsModalOpen(true)
    }

    const handleCreate = () => {
        setEditingPage({
            title: '',
            slug: '',
            content: '',
            status: 'published',
            meta_title: '',
            meta_description: ''
        })
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Xóa trang này?')) return
        try {
            const res = await fetch(`/api/admin/pages?id=${id}`, { method: 'DELETE' })
            if (res.ok) fetchPages()
        } catch (error) {
            alert('Lỗi khi xóa')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingPage) return
        setSubmitting(true)

        try {
            const isUpdate = !!editingPage.id
            const res = await fetch('/api/admin/pages', {
                method: isUpdate ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingPage)
            })
            const data = await res.json()
            if (data.success) {
                setIsModalOpen(false)
                fetchPages()
            } else {
                alert(data.error)
            }
        } catch (error) {
            alert('Có lỗi xảy ra')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Layers className="text-primary" /> Quản lý Trang tĩnh
                    </h1>
                    <p className="text-slate-500">Các trang thông tin như Giới thiệu, Liên hệ, Chính sách.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-600 transition-all shadow-lg shadow-primary/20 font-medium"
                >
                    <Plus size={20} /> Thêm trang mới
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-700">Tên trang</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Đường dẫn (Slug)</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Trạng thái</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan={4} className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-slate-400" /></td></tr>
                        ) : pages.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-slate-500">Chưa có trang nào</td></tr>
                        ) : (
                            pages.map(page => (
                                <tr key={page.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{page.title}</td>
                                    <td className="px-6 py-4 text-slate-500 font-mono text-sm">/{page.slug}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${page.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {page.status === 'published' ? 'Công khai' : 'Nháp'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleEdit(page)} className="p-2 text-slate-400 hover:text-primary transition-colors">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(page.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
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

            {/* Modal */}
            {isModalOpen && editingPage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
                            <h2 className="text-xl font-bold text-slate-800">
                                {editingPage.id ? 'Chỉnh sửa trang' : 'Thêm trang mới'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Tiêu đề trang *</label>
                                        <input
                                            required
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            value={editingPage.title || ''}
                                            onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Nội dung</label>
                                        <textarea
                                            rows={15}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm leading-relaxed"
                                            value={editingPage.content || ''}
                                            onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                                            placeholder="Nội dung trang (HTML hoặc Text)..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                                        <h3 className="font-semibold text-slate-900">Cấu hình</h3>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
                                            <input
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 bg-white"
                                                value={editingPage.slug || ''}
                                                onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                                                placeholder="tu-dong-tao"
                                            />
                                        </div>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={editingPage.status === 'published'}
                                                onChange={(e) => setEditingPage({ ...editingPage, status: e.target.checked ? 'published' : 'draft' })}
                                                className="w-4 h-4 text-primary rounded focus:ring-primary"
                                            />
                                            <span className="text-sm font-medium text-slate-700">Công khai (Published)</span>
                                        </label>
                                    </div>

                                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                                        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                            <Globe size={16} className="text-slate-400" /> SEO Metadata
                                        </h3>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Meta Title</label>
                                            <input
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                                value={editingPage.meta_title || ''}
                                                onChange={(e) => setEditingPage({ ...editingPage, meta_title: e.target.value })}
                                                placeholder={editingPage.title}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Meta Description</label>
                                            <textarea
                                                rows={3}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                                value={editingPage.meta_description || ''}
                                                onChange={(e) => setEditingPage({ ...editingPage, meta_description: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50">Hủy</button>
                                <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 shadow-lg shadow-primary/20 flex items-center gap-2">
                                    {submitting && <Loader2 className="animate-spin" size={16} />} Lưu trang
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
