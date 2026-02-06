'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Trash2, Globe, FileText, Search, Loader2, Filter, MoreHorizontal, User, Calendar, CheckCircle2 } from 'lucide-react'

type PageStatus = 'all' | 'published' | 'draft' | 'trash'

export default function AdminPages() {
    const [pages, setPages] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<PageStatus>('all')

    useEffect(() => {
        fetchPages()
    }, [statusFilter])

    const fetchPages = async () => {
        setIsLoading(true)
        try {
            const url = statusFilter === 'trash' ? '/api/admin/pages?trash=true' : '/api/admin/pages'
            const response = await fetch(url)
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

    const filteredPages = pages.filter(page => {
        const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            page.slug.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === 'all' || statusFilter === 'trash' || page.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const handleDelete = async (id: string, permanent = false) => {
        const msg = permanent ? 'Bạn có chắc chắn muốn XÓA VĨNH VIỄN trang này?' : 'Bạn có chắc chắn muốn đưa trang này vào thùng rác?'
        if (!confirm(msg)) return

        try {
            const url = permanent ? `/api/admin/pages/${id}?permanent=true` : `/api/admin/pages/${id}`
            const response = await fetch(url, {
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

    const handleRestore = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/pages/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ restore: true })
            })
            const result = await response.json()
            if (result.success) {
                setPages(pages.filter(p => p.id !== id))
            }
        } catch (error) {
            console.error('Failed to restore page', error)
        }
    }

    const counts = {
        all: pages.length,
        published: pages.filter(p => p.status === 'published').length,
        draft: pages.filter(p => p.status === 'draft').length,
        trash: pages.filter(p => p.deleted_at).length
    }

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Trang tĩnh</h1>
                    <p className="text-slate-500 mt-1">Xây dựng và quản lý các trang nội dung cho website</p>
                </div>
                <Link
                    href="/admin/pages/new"
                    className="group inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary/20 active:scale-95"
                >
                    <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                    <span className="font-semibold">Thêm trang mới</span>
                </Link>
            </div>

            {/* Quick Filters - WordPress Style but Modern */}
            <div className="flex flex-wrap items-center gap-6 mb-6 text-sm font-medium">
                <button
                    onClick={() => setStatusFilter('all')}
                    className={`pb-2 border-b-2 transition-colors ${statusFilter === 'all' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
                >
                    Tất cả <span className="ml-1 text-slate-400 font-normal">({counts.all})</span>
                </button>
                <button
                    onClick={() => setStatusFilter('published')}
                    className={`pb-2 border-b-2 transition-colors ${statusFilter === 'published' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
                >
                    Đã xuất bản <span className="ml-1 text-slate-400 font-normal">({counts.published})</span>
                </button>
                <button
                    onClick={() => setStatusFilter('draft')}
                    className={`pb-2 border-b-2 transition-colors ${statusFilter === 'draft' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
                >
                    Bản nháp <span className="ml-1 text-slate-400 font-normal">({counts.draft})</span>
                </button>
                <button
                    onClick={() => setStatusFilter('trash')}
                    className={`pb-2 border-b-2 transition-colors ${statusFilter === 'trash' ? 'border-red-500 text-red-500' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
                >
                    Thùng rác <span className="ml-1 text-slate-400 font-normal">({counts.trash})</span>
                </button>
            </div>

            {/* Table Controls */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo tiêu đề hoặc đường dẫn..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <select className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10">
                        <option>Hành động hàng loạt</option>
                        <option>Xóa</option>
                        <option>Chuyển thành bản nháp</option>
                    </select>
                    <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 active:bg-slate-100 transition-colors">
                        Áp dụng
                    </button>
                </div>
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {isLoading ? (
                    <div className="p-20 flex flex-col items-center justify-center text-slate-500">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                        <p className="font-medium">Đang tải dữ liệu...</p>
                    </div>
                ) : filteredPages.length > 0 ? (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200">
                                <th className="w-12 px-6 py-4">
                                    <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4" />
                                </th>
                                <th className="px-6 py-4 font-bold text-slate-700 text-sm uppercase tracking-wider">Tiêu đề trang</th>
                                <th className="px-6 py-4 font-bold text-slate-700 text-sm uppercase tracking-wider">Đường dẫn</th>
                                <th className="px-6 py-4 font-bold text-slate-700 text-sm uppercase tracking-wider">SEO</th>
                                <th className="px-6 py-4 font-bold text-slate-700 text-sm uppercase tracking-wider">Ngày cập nhật</th>
                                <th className="px-6 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredPages.map((page) => (
                                <tr key={page.id} className="hover:bg-slate-50/80 transition-all group">
                                    <td className="px-6 py-5">
                                        <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4" />
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/admin/pages/${page.id}`}
                                                    className="text-[15px] font-bold text-slate-900 hover:text-primary transition-colors"
                                                >
                                                    {page.title}
                                                </Link>
                                                {page.status === 'draft' && (
                                                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded-md tracking-wider">
                                                        Bản nháp
                                                    </span>
                                                )}
                                            </div>
                                            {/* Quick Actions on Hover */}
                                            <div className="flex items-center gap-3 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                                {statusFilter === 'trash' ? (
                                                    <>
                                                        <button onClick={() => handleRestore(page.id)} className="text-emerald-500 hover:underline font-medium">Khôi phục</button>
                                                        <span className="text-slate-300">|</span>
                                                        <button onClick={() => handleDelete(page.id, true)} className="text-red-600 hover:underline font-medium">Xóa vĩnh viễn</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Link href={`/admin/pages/${page.id}`} className="text-primary hover:underline font-medium">Chỉnh sửa</Link>
                                                        <span className="text-slate-300">|</span>
                                                        <button onClick={() => handleDelete(page.id)} className="text-red-500 hover:underline font-medium">Xóa</button>
                                                        <span className="text-slate-300">|</span>
                                                        <Link href={`/${page.slug === 'home' ? '' : page.slug}`} target="_blank" className="text-slate-500 hover:underline font-medium">Xem trang</Link>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1.5 text-sm text-slate-500 font-mono bg-slate-100/50 px-2 py-1 rounded-md w-fit">
                                            <Globe className="h-3.5 w-3.5" />
                                            /{page.slug}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2.5 w-2.5 rounded-full ${page.meta_description ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-400'}`} />
                                            <span className="text-sm font-medium text-slate-600">
                                                {page.meta_description ? 'Tốt' : 'Cần tối ưu'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col text-sm">
                                            <span className="text-slate-800 font-medium">
                                                {new Date(page.updated_at).toLocaleDateString('vi-VN')}
                                            </span>
                                            <span className="text-slate-400 text-xs">
                                                {new Date(page.updated_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end items-center gap-1">
                                            <Link
                                                href={`/admin/pages/${page.id}`}
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-xl transition-all"
                                                title="Sửa"
                                            >
                                                <Edit2 className="h-5 w-5" />
                                            </Link>
                                            <button
                                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all"
                                                title="Tùy chọn"
                                            >
                                                <MoreHorizontal className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-24 text-center">
                        <div className="inline-flex p-6 bg-slate-50 rounded-full mb-6">
                            <FileText className="h-12 w-12 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy trang nào</h3>
                        <p className="text-slate-500 max-w-xs mx-auto">Thử thay đổi từ khóa tìm kiếm hoặc tạo một trang mới ngay bây giờ.</p>
                        <Link
                            href="/admin/pages/new"
                            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary/20"
                        >
                            <Plus className="h-5 w-5" />
                            Tạo trang đầu tiên
                        </Link>
                    </div>
                )}
            </div>

            <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                <p>Hiển thị {filteredPages.length} trên tổng số {pages.length} trang</p>
                <div className="flex items-center gap-1">
                    <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg opacity-50 cursor-not-allowed">Trước</button>
                    <button className="px-3 py-1.5 bg-primary text-white rounded-lg font-bold">1</button>
                    <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Sau</button>
                </div>
            </div>
        </div>
    )
}
