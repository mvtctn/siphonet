'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Edit, Trash2, Image as ImageIcon, Package, Tag, Loader2 } from 'lucide-react'
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

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Package className="text-primary" />
                        Quản lý Sản phẩm
                    </h1>
                    <p className="text-slate-500 mt-1">Danh sách sản phẩm và quản lý kho hàng.</p>
                </div>

                <div className="flex gap-3">
                    <Link
                        href="/admin/categories"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-medium"
                    >
                        <Tag size={18} />
                        Quản lý danh mục
                    </Link>
                    <Link
                        href="/admin/products/create"
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-600 transition-all shadow-lg shadow-primary/20 font-medium"
                    >
                        <Plus size={20} />
                        Thêm sản phẩm
                    </Link>
                </div>
            </div>

            {/* Products Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm tên, SKU..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="relative min-w-[200px]">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <select
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none shadow-sm cursor-pointer"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">Tất cả danh mục</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700">Sản phẩm</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Danh mục</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Giá bán</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Trạng thái</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={5} className="p-12 text-center text-slate-500"><Loader2 className="animate-spin mx-auto mb-2" />Đang tải...</td></tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-slate-500">
                                    Chưa có sản phẩm nào. <Link href="/admin/products/create" className="text-primary hover:underline">Thêm ngay!</Link>
                                </td></tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-16 w-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shrink-0 relative bg-white">
                                                    {product.images && product.images.length > 0 ? (
                                                        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-slate-300">
                                                            <ImageIcon size={24} />
                                                        </div>
                                                    )}
                                                    {product.featured && <div className="absolute top-0 right-0 bg-yellow-400 w-3 h-3 rounded-bl-lg z-10 shadow-sm" title="Nổi bật" />}
                                                </div>
                                                <div>
                                                    <Link href={`/admin/products/${product.id}`} className="font-medium text-slate-900 line-clamp-2 max-w-xs hover:text-primary transition-colors">
                                                        {product.name}
                                                    </Link>
                                                    <div className="text-xs text-slate-500 font-mono mt-1">SKU: {product.sku || '---'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                                                {categories.find(c => c.id === product.category_id)?.name || 'Chưa phân loại'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="font-medium text-slate-900">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                            </div>
                                            {product.old_price && (
                                                <div className="text-xs text-slate-400 line-through">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.old_price)}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${product.status === 'published'
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : 'bg-slate-50 text-slate-600 border-slate-200'
                                                }`}>
                                                {product.status === 'published' ? 'Đang bán' : 'Nháp'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/admin/products/${product.id}`}
                                                    className="p-2 text-slate-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        </div>
    )
}
