'use client'

import { useState, useEffect } from 'react'
import { Star, Search, Plus, Trash2, Loader2, Package, ArrowLeft, MoveUp, MoveDown, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

interface Product {
    id: string
    name: string
    sku: string
    price: number
    featured: boolean
    images: string[]
    categories?: { name: string }
}

export default function FeaturedProductsPage() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
    const [allProducts, setAllProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showSelector, setShowSelector] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/products')
            const data = await res.json()
            if (data.success) {
                setAllProducts(data.data)
                setFeaturedProducts(data.data.filter((p: Product) => p.featured))
            }
        } catch (error) {
            console.error('Failed to fetch products', error)
        } finally {
            setLoading(false)
        }
    }

    const toggleFeatured = async (product: Product) => {
        const newValue = !product.featured

        // Optimistic update
        setAllProducts(allProducts.map(p => p.id === product.id ? { ...p, featured: newValue } : p))
        if (newValue) {
            setFeaturedProducts([...featuredProducts, { ...product, featured: true }])
        } else {
            setFeaturedProducts(featuredProducts.filter(p => p.id !== product.id))
        }

        try {
            const res = await fetch('/api/admin/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: product.id, featured: newValue })
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

    const filteredSelectorProducts = allProducts.filter(p =>
        !p.featured && p.name.toLowerCase().includes(search.toLowerCase())
    )

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/admin/products" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Star className="text-yellow-400 fill-yellow-400" />
                            Sản phẩm nổi bật
                        </h1>
                    </div>
                    <p className="text-slate-500 ml-10">Quản lý danh sách sản phẩm hiển thị tại mục Tiêu biểu trên trang chủ.</p>
                </div>

                <button
                    onClick={() => setShowSelector(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-600 transition-all shadow-lg shadow-primary/20 font-bold ml-10 md:ml-0"
                >
                    <Plus size={20} />
                    Thêm sản phẩm tiêu biểu
                </button>
            </div>

            {loading ? (
                <div className="py-20 text-center">
                    <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary mb-4" />
                    <p className="text-slate-500">Đang tải danh sách...</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    {featuredProducts.length === 0 ? (
                        <div className="p-16 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star size={40} className="text-slate-200" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">Chưa có sản phẩm tiêu biểu</h3>
                            <p className="text-slate-500 mb-6 font-medium">Chọn sản phẩm từ danh sách để hiển thị chúng trên trang chủ.</p>
                            <button
                                onClick={() => setShowSelector(true)}
                                className="px-6 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl font-bold transition-all"
                            >
                                Chọn sản phẩm ngay
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            <div className="p-4 px-8 bg-slate-50 flex justify-between items-center">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Đang hiển thị {featuredProducts.length} sản phẩm
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium italic">
                                    * Các sản phẩm mới nhất sẽ được ưu tiên hiển thị trước
                                </span>
                            </div>
                            {featuredProducts.map((product, index) => (
                                <div key={product.id} className="group p-6 px-8 flex items-center gap-6 hover:bg-slate-50 transition-colors">
                                    <div className="w-8 font-mono text-slate-300 font-bold text-lg">
                                        {(index + 1).toString().padStart(2, '0')}
                                    </div>
                                    <div className="h-20 w-20 bg-white rounded-xl border border-slate-100 overflow-hidden flex items-center justify-center p-2 flex-shrink-0 shadow-sm">
                                        {product.images?.[0] ? (
                                            <img src={product.images[0]} alt={product.name} className="h-full w-full object-contain" />
                                        ) : (
                                            <Package size={24} className="text-slate-200" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] uppercase font-bold text-primary tracking-widest">{product.categories?.name || 'Sản phẩm'}</span>
                                            {index < 6 && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase">Đang hiển thị</span>}
                                        </div>
                                        <h3 className="font-bold text-slate-900 truncate text-lg group-hover:text-primary transition-colors">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                                            <span className="font-medium text-red-600">{formatCurrency(product.price)}</span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span>SKU: {product.sku || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => toggleFeatured(product)}
                                            className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            title="Gỡ khỏi danh mục tiêu biểu"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Product Selector Modal */}
            {showSelector && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowSelector(false)} />
                    <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Chọn sản phẩm tiêu biểu</h2>
                                <p className="text-sm text-slate-500 font-medium">Tìm và thêm sản phẩm vào danh sách nổi bật</p>
                            </div>
                            <button onClick={() => setShowSelector(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                                <Plus size={24} className="rotate-45" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="relative mb-6">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Tìm theo tên hoặc SKU..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-700"
                                />
                            </div>

                            <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                <div className="space-y-2">
                                    {filteredSelectorProducts.length === 0 ? (
                                        <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                            Không có sản phẩm nào khả dụng.
                                        </div>
                                    ) : (
                                        filteredSelectorProducts.map(product => (
                                            <div key={product.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                                                <div className="h-12 w-12 bg-white rounded-lg border border-slate-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                                                    {product.images?.[0] ? (
                                                        <img src={product.images[0]} alt={product.name} className="h-full w-full object-contain" />
                                                    ) : (
                                                        <Package size={20} className="text-slate-200" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-slate-900 truncate group-hover:text-primary transition-colors">{product.name}</h4>
                                                    <p className="text-xs text-slate-500 font-medium">SKU: {product.sku || 'N/A'}</p>
                                                </div>
                                                <button
                                                    onClick={() => toggleFeatured(product)}
                                                    className="p-2.5 bg-slate-100 text-slate-600 hover:bg-primary hover:text-white rounded-xl transition-all"
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 flex justify-end">
                            <button
                                onClick={() => setShowSelector(false)}
                                className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                            >
                                Hoàn tất
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    )
}
