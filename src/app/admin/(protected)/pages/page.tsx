'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Trash2, Globe, FileText, Search, Loader2 } from 'lucide-react'

export default function AdminPages() {
    const [pages, setPages] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchPages()
    }, [])

    const fetchPages = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/admin/pages')
            const result = await response.json()
            if (result.success) {
                setPages(result.data)
            }
        } catch (error) {
            console.error('Failed to fetch pages', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredPages = pages.filter(page =>
        page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.slug.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa trang này?')) return

        try {
            const response = await fetch(`/api/admin/pages/${id}`, {
                method: 'DELETE'
            })
            const result = await response.json()
            if (result.success) {
                setPages(pages.filter(p => p.id !== id))
            }
        } catch (error) {
            console.error('Failed to delete page', error)
        }
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý trang tĩnh</h1>
                    <p className="text-slate-500">Quản lý nội dung và SEO cho các trang trên website</p>
                </div>
                <Link
                    href="/admin/pages/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                >
                    <Plus className="h-5 w-5" />
                    Thêm trang mới
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm trang..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
            </div>

            {/* Pages Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 flex flex-col items-center justify-center text-slate-500">
                        <Loader2 className="h-8 w-8 animate-spin mb-4" />
                        <p>Đang tải danh sách trang...</p>
                    </div>
                ) : filteredPages.length > 0 ? (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 font-semibold text-slate-700">Trang</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Đường dẫn (Slug)</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Trạng thái</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Cập nhật</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredPages.map((page) => (
                                <tr key={page.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 text-slate-900 font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            {page.title}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <code className="px-2 py-1 bg-slate-100 rounded text-sm text-slate-600">
                                            /{page.slug}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${page.status === 'published'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {page.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(page.updated_at).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/${page.slug === 'home' ? '' : page.slug}`}
                                                target="_blank"
                                                className="p-2 text-slate-400 hover:text-primary transition-colors"
                                                title="Xem trang"
                                            >
                                                <Globe className="h-5 w-5" />
                                            </Link>
                                            <Link
                                                href={`/admin/pages/${page.id}`}
                                                className="p-2 text-slate-400 hover:text-amber-600 transition-colors"
                                                title="Chỉnh sửa"
                                            >
                                                <Edit2 className="h-5 w-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(page.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                                                title="Xóa"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-12 text-center text-slate-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>Không tìm thấy trang nào</p>
                    </div>
                )}
            </div>
        </div>
    )
}
