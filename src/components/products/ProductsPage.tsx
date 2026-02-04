'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal, Grid3x3, List, ArrowUpDown, Star, TrendingUp, Zap, Shield, Award } from 'lucide-react'
import { ProductCard } from '@/components/products/ProductCard'
import { mockProducts, mockCategories } from '@/lib/mock-data'
import Link from 'next/link'

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name' | 'popular'

export function ProductsPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000])
    const [minRating, setMinRating] = useState<number>(0)
    const [sortBy, setSortBy] = useState<SortOption>('newest')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    // Filter and sort products
    const filteredProducts = mockProducts
        .filter((product) => {
            const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
            const matchesRating = (product.rating || 0) >= minRating
            return matchesCategory && matchesSearch && matchesPrice && matchesRating
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-asc': return a.price - b.price
                case 'price-desc': return b.price - a.price
                case 'name': return a.name.localeCompare(b.name)
                case 'popular': return (b.rating || 0) - (a.rating || 0)
                default: return 0
            }
        })

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
            {/* Hero Banner */}
            <div className="relative bg-gradient-to-r from-primary via-blue-600 to-cyan-600 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-300 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                            <Zap className="h-4 w-4 text-yellow-300" />
                            <span className="text-white text-sm font-medium">Sản phẩm chính hãng</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            Thiết bị M&E <br />
                            <span className="text-cyan-200">Chất lượng hàng đầu</span>
                        </h1>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl">
                            Cung cấp thiết bị cơ điện chính hãng từ các thương hiệu uy tín thế giới.
                            Cam kết chất lượng, giá cạnh tranh và dịch vụ tận tâm.
                        </p>

                        {/* Trust badges */}
                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center gap-2 text-white">
                                <Shield className="h-5 w-5 text-cyan-200" />
                                <span className="font-medium">Bảo hành chính hãng</span>
                            </div>
                            <div className="flex items-center gap-2 text-white">
                                <Award className="h-5 w-5 text-cyan-200" />
                                <span className="font-medium">Chứng nhận quốc tế</span>
                            </div>
                            <div className="flex items-center gap-2 text-white">
                                <TrendingUp className="h-5 w-5 text-cyan-200" />
                                <span className="font-medium">Tư vấn miễn phí</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Quick Navigation */}
            <div className="border-b bg-white shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 overflow-x-auto py-4 scrollbar-hide">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`flex-shrink-0 px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${selectedCategory === 'all'
                                    ? 'bg-accent text-white shadow-lg shadow-accent/30 scale-105'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            Tất cả
                        </button>
                        {mockCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex-shrink-0 px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${selectedCategory === category.id
                                        ? 'bg-accent text-white shadow-lg shadow-accent/30 scale-105'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Advanced Sidebar Filters */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sticky top-28 space-y-8">
                            <div className="flex items-center gap-2 pb-4 border-b">
                                <SlidersHorizontal className="h-5 w-5 text-accent" />
                                <h2 className="font-bold text-lg">Bộ lọc nâng cao</h2>
                            </div>

                            {/* Search */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-3">
                                    Tìm kiếm sản phẩm
                                </label>
                                <div className="relative group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-accent transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Nhập tên sản phẩm..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-3">
                                    Khoảng giá
                                </label>
                                <div className="space-y-3">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100000000"
                                        step="1000000"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                        className="w-full accent-accent"
                                    />
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">0đ</span>
                                        <span className="font-semibold text-accent">
                                            {new Intl.NumberFormat('vi-VN').format(priceRange[1])}đ
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Rating Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-3">
                                    Đánh giá tối thiểu
                                </label>
                                <div className="space-y-2">
                                    {[5, 4, 3].map((rating) => (
                                        <button
                                            key={rating}
                                            onClick={() => setMinRating(rating === minRating ? 0 : rating)}
                                            className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${minRating === rating
                                                    ? 'bg-accent text-white shadow-md'
                                                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                                                }`}
                                        >
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: rating }).map((_, i) => (
                                                    <Star key={i} className={`h-4 w-4 ${minRating === rating ? 'fill-white' : 'fill-yellow-400'} ${minRating === rating ? 'text-white' : 'text-yellow-400'}`} />
                                                ))}
                                            </div>
                                            <span className="text-sm font-medium">trở lên</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Reset Filters */}
                            <button
                                onClick={() => {
                                    setSelectedCategory('all')
                                    setSearchQuery('')
                                    setPriceRange([0, 100000000])
                                    setMinRating(0)
                                }}
                                className="w-full px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    </aside>

                    {/* Products Section */}
                    <main className="lg:col-span-3 space-y-6">
                        {/* Toolbar */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                {/* Results count */}
                                <p className="text-slate-600 font-medium">
                                    Hiển thị <span className="text-accent font-bold">{filteredProducts.length}</span> sản phẩm
                                </p>

                                <div className="flex items-center gap-3">
                                    {/* Sort */}
                                    <div className="flex items-center gap-2">
                                        <ArrowUpDown className="h-4 w-4 text-slate-500" />
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                        >
                                            <option value="newest">Mới nhất</option>
                                            <option value="popular">Phổ biến</option>
                                            <option value="price-asc">Giá: Thấp → Cao</option>
                                            <option value="price-desc">Giá: Cao → Thấp</option>
                                            <option value="name">Tên A-Z</option>
                                        </select>
                                    </div>

                                    {/* View mode toggle */}
                                    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-accent' : 'text-slate-500'
                                                }`}
                                        >
                                            <Grid3x3 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-accent' : 'text-slate-500'
                                                }`}
                                        >
                                            <List className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products Grid/List */}
                        {filteredProducts.length > 0 ? (
                            <div className={`grid gap-6 ${viewMode === 'grid'
                                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                                    : 'grid-cols-1'
                                }`}>
                                {filteredProducts.map((product, index) => (
                                    <div
                                        key={product.id}
                                        className="animate-fade-in"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <ProductCard product={product} viewMode={viewMode} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                                <div className="max-w-md mx-auto">
                                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Search className="h-12 w-12 text-slate-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-700 mb-2">
                                        Không tìm thấy sản phẩm
                                    </h3>
                                    <p className="text-slate-500 mb-6">
                                        Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSelectedCategory('all')
                                            setSearchQuery('')
                                            setPriceRange([0, 100000000])
                                            setMinRating(0)
                                        }}
                                        className="px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors font-medium"
                                    >
                                        Xóa tất cả bộ lọc
                                    </button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }

                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }

                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    )
}
