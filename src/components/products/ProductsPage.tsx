'use client'

import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, Grid3x3, List, ArrowUpDown, Star, TrendingUp, Zap, Shield, Award } from 'lucide-react'
import { ProductCard } from '@/components/products/ProductCard'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name' | 'popular'

export function ProductsPage() {
    const [products, setProducts] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingProducts, setIsLoadingProducts] = useState(false)

    // Filters
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000])
    const [minRating, setMinRating] = useState<number>(0)
    const [sortBy, setSortBy] = useState<SortOption>('newest')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery)
        }, 500)
        return () => clearTimeout(timer)
    }, [searchQuery])

    // Load initial data (Categories)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // We can use the test endpoint or a dedicated categories endpoint
                // For now let's query directly via supabase client if available, 
                // but since we are in client component, let's use the products API to verify connection 
                // or just fetch from a new simple route. 
                // Actually, let's just make a quick ad-hoc fetch for categories from supabase directly 
                // IF we exported it, but we only have it in lib.
                // Let's create a Fetch for categories later. For now, let's use the mockCategories if we don't have API.
                // Wait, I can allow the API to return categories too.
                // Let's stick to fetching products first, and maybe categories from an API.

                // Let's assume we will build /api/categories later.
                // For this step, I'll fetch categories from the database using a direct query via a new API route or just use the products API 
                // which returns joined data, but not list of categories.
                // I will add a simple get categories logic here.

                // Temporary: Fetch categories from Supabase via client-side query 
                // (requires exposing supabase to client, which we did in lib/supabase.ts)
                const { data } = await supabase.from('categories').select('*')
                if (data) setCategories(data)
            } catch (error) {
                console.error('Failed to fetch categories', error)
            }
        }
        fetchCategories()
    }, [])

    // Fetch Products when filters change
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoadingProducts(true)
            try {
                // Initial query
                let query = supabase
                    .from('products')
                    .select(`
                        *,
                        categories (
                            id,
                            name,
                            slug
                        )
                    `)
                    .eq('status', 'published')

                // Apply category filter
                if (selectedCategory !== 'all') {
                    // We need to find the category ID for the slug
                    const cat = categories.find(c => c.slug === selectedCategory)
                    if (cat) {
                        query = query.eq('category_id', cat.id)
                    }
                }

                // Apply search filter
                if (debouncedSearch) {
                    query = query.ilike('name', `%${debouncedSearch}%`)
                }

                // Apply price filter
                if (priceRange[0] > 0) {
                    query = query.gte('price', priceRange[0])
                }
                if (priceRange[1] < 100000000) {
                    query = query.lte('price', priceRange[1])
                }

                // Apply sorting
                switch (sortBy) {
                    case 'price-asc':
                        query = query.order('price', { ascending: true })
                        break
                    case 'price-desc':
                        query = query.order('price', { ascending: false })
                        break
                    case 'name':
                        query = query.order('name', { ascending: true })
                        break
                    case 'popular':
                        query = query.order('featured', { ascending: false })
                        break
                    case 'newest':
                    default:
                        query = query.order('created_at', { ascending: false })
                        break
                }

                const { data, error } = await query

                if (error) throw error

                if (data) {
                    // Transform data to match local interface if needed
                    const transformed = data.map((p: any) => ({
                        ...p,
                        category: p.categories?.name || '',
                        price: parseFloat(p.price),
                        images: p.images || [],
                        rating: 4.5
                    }))
                    setProducts(transformed)
                }
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                setIsLoading(false)
                setIsLoadingProducts(false)
            }
        }

        fetchProducts()
    }, [selectedCategory, debouncedSearch, priceRange, minRating, sortBy, categories])

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
                        {categories.map((category) => (
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
                                    Hiển thị <span className="text-accent font-bold">{products.length}</span> sản phẩm
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
                        {isLoadingProducts ? (
                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="bg-white rounded-2xl p-4 h-96 animate-pulse">
                                        <div className="w-full h-48 bg-slate-200 rounded-xl mb-4"></div>
                                        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                                        <div className="h-8 bg-slate-200 rounded w-full mt-auto"></div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className={`grid gap-6 ${viewMode === 'grid'
                                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                                : 'grid-cols-1'
                                }`}>
                                {products.map((product: any, index: number) => (
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
