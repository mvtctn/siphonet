'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Edit, Trash2, Image as ImageIcon, Package, Tag, Loader2, Settings, Star } from 'lucide-react'
import { CategoryManager } from '@/components/admin/CategoryManager'
import Link from 'next/link'

interface Category {
    id: string
    name: string
    slug: string
    type?: 'product' | 'post'
}

interface Product {
    id: string
    name: string
    sku: string
    price: number
    old_price: number
    status: 'published' | 'draft'
    featured: boolean
    category_id: string
    images: string[]
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')

    // Fetch Lists
    const fetchSelectCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories?type=product')
            const data = await res.json()
            if (data.success) setCategories(data.data)
        } catch (error) { console.error(error) }
    }

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/products')
            const data = await res.json()
            if (data.success) setProducts(data.data)
        } catch (error) { console.error(error) }
        finally { setLoading(false) }
    }

    useEffect(() => {
        fetchProducts()
        fetchSelectCategories()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return
        try {
            const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' })
            const data = await res.json()
            if (data.success) {
                setProducts(products.filter(p => p.id !== id))
            } else {
                alert('Lỗi: ' + data.error)
            }
        } catch (error) { alert('Có lỗi xảy ra') }
    }

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase())
        const matchesCategory = selectedCategory ? p.category_id === selectedCategory : true
        return matchesSearch && matchesCategory
    })

    const updateProductField = async (id: string, field: string, value: any) => {
        // Optimistic update
        setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p))

        try {
            const res = await fetch('/api/admin/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, [field]: value })
            })
            const data = await res.json()
            if (!data.success) {
                // Revert on failure
                alert('Cập nhật thất bại: ' + data.error)
                fetchProducts()
            }
        } catch (error) {
            console.error(error)
            fetchProducts()
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
    }

    return (
        <div className="p-6 max-w-[1600px] mx-auto text-sm">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Package className="text-primary" />
                        Danh sách sản phẩm
                    </h1>
                    <div className="flex items-center gap-2 text-slate-500 mt-1 text-xs">
                        <Link href="/admin/dashboard" className="hover:text-primary">Trang chủ</Link>
                        <span>/</span>
                        <span>Sản phẩm</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Link
                        href="/admin/categories"
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-medium shadow-sm"
                    >
                        <Tag size={16} />
                        Quản lý danh mục
                    </Link>
                    <Link
                        href="/admin/products/featured"
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-yellow-200 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-all font-medium shadow-sm"
                    >
                        <Star size={16} fill="currentColor" />
                        Sản phẩm nổi bật
                    </Link>
                    <Link
                        href="/admin/products/create"
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-all shadow-md shadow-primary/20 font-medium"
                    >
                        <Plus size={16} />
                        Thêm mới
                    </Link>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-t-xl border border-slate-200 border-b-0 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <input
                            type="text"
                            placeholder="Nhập từ khóa tìm kiếm..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-3 pr-10 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    </div>
                    <select
                        className="py-2 pl-3 pr-8 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">Chủ đề (Tất cả)</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-2 bg-cyan-600 text-white rounded-md text-sm font-medium hover:bg-cyan-700 transition-colors flex items-center gap-2">
                        <Package size={14} /> Cập nhật
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-cyan-600 text-white text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-3 py-3 w-10 text-center border-r border-cyan-500">
                                    <input type="checkbox" className="rounded border-white/30 text-primary focus:ring-0 cursor-pointer" />
                                </th>
                                <th className="px-3 py-3 w-12 text-center border-r border-cyan-500">Stt</th>
                                <th className="px-3 py-3 w-32 text-center border-r border-cyan-500">Hình ảnh</th>
                                <th className="px-4 py-3 border-r border-cyan-500">Tên sản phẩm</th>
                                <th className="px-3 py-3 w-40 text-center border-r border-cyan-500">Đặc điểm</th>
                                <th className="px-2 py-3 w-20 text-center border-r border-cyan-500" title="Tiêu biểu">Tiêu biểu</th>
                                <th className="px-2 py-3 w-20 text-center border-r border-cyan-500" title="Hiển thị">Hiển thị</th>
                                <th className="px-2 py-3 w-24 text-center">Tác vụ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {loading ? (
                                <tr><td colSpan={8} className="p-12 text-center text-slate-500"><Loader2 className="animate-spin mx-auto mb-2" />Đang tải...</td></tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr><td colSpan={8} className="p-8 text-center text-slate-500">Không tìm thấy sản phẩm nào.</td></tr>
                            ) : (
                                filteredProducts.map((product, index) => (
                                    <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-3 py-3 text-center border-r border-slate-100">
                                            <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer" />
                                        </td>
                                        <td className="px-3 py-3 text-center border-r border-slate-100 font-mono text-slate-500">
                                            {index + 1}
                                        </td>
                                        <td className="px-3 py-3 text-center border-r border-slate-100">
                                            <div className="h-16 w-16 mx-auto bg-slate-100 rounded border border-slate-200 overflow-hidden flex items-center justify-center">
                                                {product.images && product.images.length > 0 ? (
                                                    <img src={product.images[0]} alt={product.name} className="h-full w-full object-contain" />
                                                ) : (
                                                    <ImageIcon size={20} className="text-slate-300" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 border-r border-slate-100">
                                            <Link href={`/admin/products/${product.id}`} className="font-semibold text-slate-700 hover:text-primary mb-1 block line-clamp-2">
                                                {product.name}
                                            </Link>
                                            <div className="text-red-600 font-bold text-sm">
                                                {formatCurrency(product.price)}
                                            </div>
                                            <Link href={`/admin/products/${product.id}`} className="inline-flex items-center gap-1 text-xs text-cyan-600 hover:underline mt-1">
                                                <Settings size={12} /> Cấu hình tính năng
                                            </Link>
                                        </td>
                                        <td className="px-3 py-3 text-center border-r border-slate-100">
                                            <div className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded inline-block max-w-[150px] truncate">
                                                {categories.find(c => c.id === product.category_id)?.name || 'Chưa phân loại'}
                                            </div>
                                        </td>
                                        <td className="px-2 py-3 text-center border-r border-slate-100">
                                            <button
                                                onClick={() => updateProductField(product.id, 'featured', !product.featured)}
                                                className={`p-1 rounded hover:bg-slate-100 transition-colors ${product.featured ? 'text-yellow-400' : 'text-slate-200'}`}
                                                title={product.featured ? 'Đang bật Tiêu biểu' : 'Không tiêu biểu'}
                                            >
                                                <Star size={20} fill={product.featured ? "currentColor" : "none"} />
                                            </button>
                                        </td>
                                        <td className="px-2 py-3 text-center border-r border-slate-100">
                                            <button
                                                onClick={() => updateProductField(product.id, 'status', product.status === 'published' ? 'draft' : 'published')}
                                                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                                style={{ backgroundColor: product.status === 'published' ? '#0891b2' : '#e2e8f0' }}
                                            >
                                                <span
                                                    className={`${product.status === 'published' ? 'translate-x-6' : 'translate-x-1'
                                                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                                />
                                            </button>
                                        </td>
                                        <td className="px-2 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    href={`/admin/products/${product.id}`}
                                                    className="p-1.5 text-cyan-600 hover:bg-cyan-50 rounded transition-colors border border-cyan-200"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors border border-red-200"
                                                    title="Xóa"
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
            </div>
            {/* Pagination (Static for now as mostly requested) */}
            <div className="mt-4 flex justify-between items-center text-slate-500 text-xs">
                <div>Hiển thị {filteredProducts.length} sản phẩm</div>
            </div>
        </div>
    )
}
