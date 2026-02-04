'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X, Save, Tag, Filter, Loader2 } from 'lucide-react'

interface Category {
    id: string
    name: string
    slug: string
    type: 'product' | 'post'
    created_at?: string
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null)
    const [filterType, setFilterType] = useState<'all' | 'product' | 'post'>('all')

    const fetchCategories = async () => {
        setLoading(true)
        try {
            const url = filterType === 'all'
                ? '/api/admin/categories'
                : `/api/admin/categories?type=${filterType}`

            const res = await fetch(url)
            const data = await res.json()
            if (data.success) {
                setCategories(data.data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [filterType])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingCategory) return

        try {
            const isUpdate = !!editingCategory.id
            const res = await fetch('/api/admin/categories', {
                method: isUpdate ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingCategory)
            })
            const data = await res.json()
            if (data.success) {
                setIsModalOpen(false)
                fetchCategories()
            } else {
                alert(data.error)
            }
        } catch (error) {
            alert('Lỗi khi lưu')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Xóa danh mục này?')) return
        try {
            await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' })
            fetchCategories()
        } catch (error) {
            alert('Lỗi khi xóa')
        }
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Tag className="text-primary" /> Quản lý Danh mục
                    </h1>
                    <p className="text-slate-500">Phân loại sản phẩm và bài viết</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCategory({ name: '', slug: '', type: 'product' })
                        setIsModalOpen(true)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-600 transition-all font-medium"
                >
                    <Plus size={20} /> Thêm mới
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-4 items-center">
                <Filter size={18} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-700">Lọc theo:</span>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setFilterType('all')}
                        className={`px-3 py-1.5 text-sm rounded-md transition-all ${filterType === 'all' ? 'bg-white shadow-sm font-medium text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Tất cả
                    </button>
                    <button
                        onClick={() => setFilterType('product')}
                        className={`px-3 py-1.5 text-sm rounded-md transition-all ${filterType === 'product' ? 'bg-white shadow-sm font-medium text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Sản phẩm
                    </button>
                    <button
                        onClick={() => setFilterType('post')}
                        className={`px-3 py-1.5 text-sm rounded-md transition-all ${filterType === 'post' ? 'bg-white shadow-sm font-medium text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Bài viết
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-700">Tên danh mục</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Slug (Đường dẫn)</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Loại</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan={4} className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-slate-400" /></td></tr>
                        ) : categories.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-slate-500">Chưa có danh mục nào</td></tr>
                        ) : (
                            categories.map(cat => (
                                <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{cat.name}</td>
                                    <td className="px-6 py-4 text-slate-500 font-mono text-sm">{cat.slug}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cat.type === 'product' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                            {cat.type === 'product' ? 'Sản phẩm' : 'Bài viết'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => { setEditingCategory(cat); setIsModalOpen(true) }}
                                                className="p-2 text-slate-400 hover:text-primary transition-colors"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
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

            {/* Modal */}
            {isModalOpen && editingCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800">
                                {editingCategory.id ? 'Sửa danh mục' : 'Thêm danh mục mới'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tên danh mục</label>
                                <input
                                    required
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    value={editingCategory.name}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                                <input
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm"
                                    value={editingCategory.slug}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                                    placeholder="Tu-dong-tao-neu-trong"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Loại danh mục</label>
                                <select
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    value={editingCategory.type}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, type: e.target.value as any })}
                                >
                                    <option value="product">Sản phẩm</option>
                                    <option value="post">Bài viết (Tin tức)</option>
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Hủy</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 font-medium shadow-lg shadow-primary/20">Lưu lại</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
