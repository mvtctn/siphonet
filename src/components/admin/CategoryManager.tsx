'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X, Filter, Loader2, Tag } from 'lucide-react'

interface Category {
    id: string
    name: string
    slug: string
    type: 'product' | 'post'
    created_at?: string
}

interface CategoryManagerProps {
    type?: 'product' | 'post' // Nếu truyền vào thì fix cứng loại này
}

export function CategoryManager({ type }: CategoryManagerProps) {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null)
    const [filterType, setFilterType] = useState<'all' | 'product' | 'post'>(type || 'all')

    const fetchCategories = async () => {
        setLoading(true)
        try {
            // Nếu có props type thì luôn query theo type đó
            const queryType = type || filterType
            const url = queryType === 'all'
                ? '/api/admin/categories'
                : `/api/admin/categories?type=${queryType}`

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
        // Nếu props type thay đổi (hiếm) hoặc filter nội bộ đổi
        if (type) setFilterType(type)
        fetchCategories()
    }, [filterType, type])

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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        <Tag size={18} /> Danh sách Danh mục
                    </h3>

                    {/* Chỉ hiện filter nếu không bị fix cứng type */}
                    {!type && (
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button onClick={() => setFilterType('all')} className={`px-3 py-1 text-xs rounded-md transition-all ${filterType === 'all' ? 'bg-white shadow-sm font-bold text-slate-800' : 'text-slate-500'}`}>All</button>
                            <button onClick={() => setFilterType('product')} className={`px-3 py-1 text-xs rounded-md transition-all ${filterType === 'product' ? 'bg-white shadow-sm font-bold text-slate-800' : 'text-slate-500'}`}>SP</button>
                            <button onClick={() => setFilterType('post')} className={`px-3 py-1 text-xs rounded-md transition-all ${filterType === 'post' ? 'bg-white shadow-sm font-bold text-slate-800' : 'text-slate-500'}`}>Post</button>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => {
                        setEditingCategory({ name: '', slug: '', type: type || 'product' })
                        setIsModalOpen(true)
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-600 transition-colors"
                >
                    <Plus size={16} /> Thêm mới
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-3 font-semibold text-slate-600 text-sm">Tên danh mục</th>
                            <th className="px-6 py-3 font-semibold text-slate-600 text-sm">Slug</th>
                            {!type && <th className="px-6 py-3 font-semibold text-slate-600 text-sm">Loại</th>}
                            <th className="px-6 py-3 font-semibold text-slate-600 text-sm text-right">Thao tác</th>
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
                                    <td className="px-6 py-3 font-medium text-slate-900">{cat.name}</td>
                                    <td className="px-6 py-3 text-slate-500 font-mono text-xs">{cat.slug}</td>
                                    {!type && (
                                        <td className="px-6 py-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${cat.type === 'product' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                                                }`}>
                                                {cat.type}
                                            </span>
                                        </td>
                                    )}
                                    <td className="px-6 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => { setEditingCategory(cat); setIsModalOpen(true) }}
                                                className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
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
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">
                                {editingCategory.id ? 'Sửa danh mục' : 'Thêm danh mục'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tên danh mục</label>
                                <input
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    value={editingCategory.name}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                                <input
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm"
                                    value={editingCategory.slug}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                                    placeholder="tu-dong-tao"
                                />
                            </div>
                            {!type && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Loại</label>
                                    <select
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        value={editingCategory.type}
                                        onChange={(e) => setEditingCategory({ ...editingCategory, type: e.target.value as any })}
                                    >
                                        <option value="product">Product</option>
                                        <option value="post">Post</option>
                                    </select>
                                </div>
                            )}
                            <div className="pt-2 flex justify-end gap-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm">Hủy</button>
                                <button type="submit" className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 font-medium text-sm">Lưu lại</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
