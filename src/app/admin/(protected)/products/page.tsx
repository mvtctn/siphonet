'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Plus, Search, Edit, Trash2, Image as ImageIcon,
    Package, Tag, Loader2, Star, ChevronLeft,
    ChevronRight, ExternalLink, RefreshCw, X
} from 'lucide-react'

interface Category {
    id: string
    name: string
    slug: string
}

interface Product {
    id: string
    name: string
    sku: string
    price: number
    status: 'published' | 'draft' | 'trash'
    featured: boolean
    category_id: string
    categories?: {
        name: string
    }
    images: any[]
    created_at: string
}

export default function AdminProductsPage() {
    const router = useRouter()
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'trash'>('all')
    const [selectedCategory, setSelectedCategory] = useState('')

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories?type=product')
            const data = await res.json()
            if (data.success) setCategories(data.data)
        } catch (error) { console.error(error) }
    }

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const url = filterStatus === 'trash' ? '/api/admin/products?trash=true' : '/api/admin/products'
            const res = await fetch(url)
            const data = await res.json()
            if (data.success) {
                const mappedData = data.data.map((p: any) => ({
                    ...p,
                    status: p.status || 'draft'
                }))
                setProducts(mappedData)
            }
        } catch (error) { console.error(error) }
        finally { setLoading(false) }
    }

    useEffect(() => {
        fetchProducts()
        fetchCategories()
    }, [filterStatus])

    const handleDelete = async (id: string, permanent = false) => {
        const msg = permanent ? 'Bạn có chắc chắn muốn XÓA VĨNH VIỄN sản phẩm này?' : 'Bạn có chắc chắn muốn đưa sản phẩm này vào thùng rác?'
        if (!confirm(msg)) return
        try {
            const url = permanent ? `/api/admin/products?id=${id}&permanent=true` : `/api/admin/products?id=${id}`
            const res = await fetch(url, { method: 'DELETE' })
            const data = await res.json()
            if (data.success) {
                setProducts(products.filter(p => p.id !== id))
            } else {
                alert('Lỗi: ' + data.error)
            }
        } catch (error) { alert('Có lỗi xảy ra') }
    }

    const handleRestore = async (id: string) => {
        try {
            const res = await fetch('/api/admin/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, restore: true })
            })
            const data = await res.json()
            if (data.success) {
                setProducts(products.filter(p => p.id !== id))
            } else {
                alert('Lỗi: ' + data.error)
            }
        } catch (error) { alert('Có lỗi xảy ra') }
    }

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
        const matchesCategory = selectedCategory ? p.category_id === selectedCategory : true

        if (filterStatus === 'all') return matchesSearch && matchesCategory
        if (filterStatus === 'trash') return matchesSearch && matchesCategory
        return matchesSearch && matchesCategory && p.status === filterStatus
    })

    const updateProductField = async (id: string, field: string, value: any) => {
        setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p))
        try {
            const res = await fetch('/api/admin/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, [field]: value })
            })
            const data = await res.json()
            if (!data.success) {
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

    const counts = {
        all: products.length,
        published: products.filter(p => p.status === 'published').length,
        draft: products.filter(p => p.status === 'draft').length,
        trash: products.filter(p => p.status === 'trash').length
    }

    return (
        <div className="p-6 max-w-[1600px] mx-auto bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                        <Package className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Danh sách sản phẩm</h1>
                        <p className="text-sm text-slate-500 font-medium">Quản lý kho hàng, cập nhật giá và thông tin sản phẩm.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/admin/categories"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-bold shadow-sm"
                    >
                        <Tag size={18} />
                        Danh mục
                    </Link>
                    <Link
                        href="/admin/products/create"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary/20 font-bold"
                    >
                        <Plus size={20} />
                        Thêm mới
                    </Link>
                </div>
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
                    Đang bán <span className={`${filterStatus === 'published' ? 'text-white/60' : 'text-slate-300'}`}>({counts.published})</span>
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
                            placeholder="Tìm tên hoặc SKU..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium"
                        />
                    </div>

                    <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1" />

                    <select
                        className="h-11 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer min-w-[180px]"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">Tất cả danh mục</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchProducts}
                        className="p-2.5 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-xl transition-all"
                        title="Làm mới"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden mb-8">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <th className="p-6">Sản phẩm</th>
                                <th className="p-6">Danh mục</th>
                                <th className="p-6">Giá bán</th>
                                <th className="p-6">Trạng thái</th>
                                <th className="p-6 text-center">Nổi bật</th>
                                <th className="p-6 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-20 text-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Đang tải dữ liệu...</p>
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-20 text-center text-slate-400 font-medium">
                                        Không tìm thấy sản phẩm nào.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 shadow-inner group-hover:border-primary/20 transition-colors">
                                                    {product.images && product.images.length > 0 ? (
                                                        <img
                                                            src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                            <ImageIcon size={24} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <Link
                                                        href={`/admin/products/${product.id}`}
                                                        className="font-bold text-slate-900 hover:text-primary transition-colors line-clamp-1"
                                                    >
                                                        {product.name}
                                                    </Link>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                                        SKU: {product.sku || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-600 uppercase tracking-widest border border-slate-200 shadow-sm">
                                                {product.categories?.name || 'Chưa phân loại'}
                                            </span>
                                        </td>
                                        <td className="p-6 grayscale group-hover:grayscale-0 transition-all font-bold text-slate-700">
                                            {formatCurrency(product.price)}
                                        </td>
                                        <td className="p-6">
                                            <button
                                                onClick={() => updateProductField(product.id, 'status', product.status === 'published' ? 'draft' : 'published')}
                                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${product.status === 'published'
                                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                                                    }`}
                                            >
                                                {product.status === 'published' ? 'Đang bán' : 'Bản nháp'}
                                            </button>
                                        </td>
                                        <td className="p-6 text-center">
                                            <button
                                                onClick={() => updateProductField(product.id, 'featured', !product.featured)}
                                                className={`transition-all ${product.featured ? 'text-yellow-400 drop-shadow-sm scale-110' : 'text-slate-200 hover:text-slate-300'}`}
                                            >
                                                <Star size={20} fill={product.featured ? "currentColor" : "none"} />
                                            </button>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {filterStatus === 'trash' ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleRestore(product.id)}
                                                            className="p-2 text-emerald-500 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100"
                                                            title="Khôi phục"
                                                        >
                                                            <RefreshCw size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product.id, true)}
                                                            className="p-2 text-red-500 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100"
                                                            title="Xóa vĩnh viễn"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Link
                                                            href={`/admin/products/${product.id}`}
                                                            className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100"
                                                            title="Chỉnh sửa"
                                                        >
                                                            <Edit size={18} />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(product.id)}
                                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100"
                                                            title="Xóa"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Summary */}
            {!loading && (
                <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    <p>Hiển thị {filteredProducts.length} sản phẩm</p>
                </div>
            )}
        </div>
    )
}
