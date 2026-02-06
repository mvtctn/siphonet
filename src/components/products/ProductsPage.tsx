'use client'

import { useState, useEffect, Suspense } from 'react'
import { Search, Grid3x3, List, ArrowUpDown, Star, Package, X, SlidersHorizontal } from 'lucide-react'
import { ProductCard } from '@/components/products/ProductCard'
import { useSearchParams, useRouter } from 'next/navigation'
import { ProductSidebar } from '@/components/products/ProductSidebar'

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name' | 'popular'

interface ProductsPageProps {
    initialCategory?: string
}

export function ProductsPage({ initialCategory = 'all' }: ProductsPageProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const urlSearch = searchParams.get('search') || ''

    const [products, setProducts] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingProducts, setIsLoadingProducts] = useState(false)

    // Filters
    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory)
    const [searchQuery, setSearchQuery] = useState(urlSearch)
    const [debouncedSearch, setDebouncedSearch] = useState(urlSearch)
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000])
    const [minRating, setMinRating] = useState<number>(0)
    const [sortBy, setSortBy] = useState<SortOption>('newest')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

    // Update selectedCategory if prop changes (for category pages)
    useEffect(() => {
        setSelectedCategory(initialCategory)
        setIsMobileFilterOpen(false)
    }, [initialCategory])

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
                const response = await fetch('/api/categories')
                const result = await response.json()
                if (result.success) {
                    setCategories(result.data)
                }
            } catch (error) {
                console.error('Failed to fetch categories', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchCategories()
    }, [])

    // Fetch Products when filters change
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoadingProducts(true)
            try {
                const params = new URLSearchParams()
                if (selectedCategory !== 'all') {
                    const cat = categories.find(c => c.slug === selectedCategory || c.id === selectedCategory)
                    if (cat) params.append('category', cat.id)
                }
                if (debouncedSearch) params.append('search', debouncedSearch)
                params.append('minPrice', priceRange[0].toString())
                params.append('maxPrice', priceRange[1].toString())
                params.append('sortBy', sortBy)

                const response = await fetch(`/api/products?${params.toString()}`)
                const result = await response.json()
                if (result.success) setProducts(result.data)
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                setIsLoadingProducts(false)
            }
        }

        if (!isLoading) fetchProducts()
    }, [selectedCategory, debouncedSearch, priceRange, minRating, sortBy, categories, isLoading])

    const handleCategoryChange = (slug: string) => {
        setSelectedCategory(slug)
        if (slug === 'all') {
            router.push('/san-pham')
        } else {
            router.push(`/san-pham/danh-muc/${slug}`)
        }
    }

    const handleReset = () => {
        setSelectedCategory('all')
        setSearchQuery('')
        setPriceRange([0, 100000000])
        setMinRating(0)
        setIsMobileFilterOpen(false)
        router.push('/san-pham')
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Mobile Filter Drawer Overlay */}
            {isMobileFilterOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] transition-opacity duration-300"
                    onClick={() => setIsMobileFilterOpen(false)}
                />
            )}

            {/* Mobile Filter Drawer Content */}
            <div className={`fixed top-0 right-0 w-[85%] max-w-[400px] h-full bg-white z-[101] shadow-2xl transition-transform duration-500 ease-out transform ${isMobileFilterOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Bộ lọc sản phẩm</h2>
                        <button
                            onClick={() => setIsMobileFilterOpen(false)}
                            className="p-3 bg-slate-100 text-slate-500 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <ProductSidebar
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                        priceRange={priceRange}
                        onPriceChange={setPriceRange}
                        minRating={minRating}
                        onRatingChange={setMinRating}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onReset={handleReset}
                    />
                </div>
            </div>

            {/* Header Section */}
            <div className="bg-white border-b border-slate-100">
                <div className="max-w-[1400px] mx-auto px-6 py-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-8 w-1 bg-primary rounded-full" />
                                <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Cửa hàng trực tuyến</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                                {selectedCategory === 'all'
                                    ? 'Tất cả sản phẩm'
                                    : categories.find(c => c.slug === selectedCategory)?.name || 'Danh mục sản phẩm'
                                }
                            </h1>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="bg-slate-50 p-1 rounded-2xl border border-slate-100 flex gap-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <Grid3x3 className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <List className="h-5 w-5" />
                                </button>
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                                className="bg-white border border-slate-200 rounded-2xl px-6 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                            >
                                <option value="newest">Mới nhất</option>
                                <option value="popular">Phổ biến nhất</option>
                                <option value="price-asc">Giá: Thấp đến Cao</option>
                                <option value="price-desc">Giá: Cao xuống Thấp</option>
                                <option value="name">Tên sản phẩm A-Z</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-[280px_1fr] gap-12 items-start">
                    {/* Sidebar */}
                    <div className="sticky top-24 hidden lg:block">
                        <ProductSidebar
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onCategoryChange={handleCategoryChange}
                            priceRange={priceRange}
                            onPriceChange={setPriceRange}
                            minRating={minRating}
                            onRatingChange={setMinRating}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            onReset={handleReset}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="space-y-8">
                        {/* Mobile Header (Search & Count) */}
                        <div className="lg:hidden bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm nhanh..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none"
                                />
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
                                <span>Kết quả: {products.length}</span>
                                <button
                                    onClick={() => setIsMobileFilterOpen(true)}
                                    className="text-primary flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full"
                                >
                                    <SlidersHorizontal className="h-3.5 w-3.5" />
                                    <span>Mở bộ lọc</span>
                                </button>
                            </div>
                        </div>

                        {/* Desktop Search Info */}
                        <div className="hidden lg:flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                <span>Tìm thấy</span>
                                <span className="text-slate-900 font-bold">{products.length}</span>
                                <span>sản phẩm cho yêu cầu của bạn</span>
                            </div>
                        </div>

                        {/* Products Grid */}
                        {isLoadingProducts ? (
                            <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="bg-white rounded-[2rem] p-6 h-[450px] animate-pulse border border-slate-50">
                                        <div className="w-full aspect-square bg-slate-100 rounded-2xl mb-6" />
                                        <div className="h-6 bg-slate-100 rounded-full w-3/4 mb-4" />
                                        <div className="h-4 bg-slate-100 rounded-full w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                                {products.map((product, index) => (
                                    <div
                                        key={product.id}
                                        className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <ProductCard product={{
                                            ...product,
                                            category: product.categories?.name || 'Sản phẩm'
                                        }} viewMode={viewMode} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-100">
                                <div className="max-w-md mx-auto">
                                    <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
                                        <Search size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">
                                        Không tìm thấy sản phẩm
                                    </h3>
                                    <p className="text-slate-500 font-medium mb-8">
                                        Rất tiếc, chúng tôi không tìm thấy kết quả phù hợp với lựa chọn của bạn. Vui lòng thử lại với bộ lọc khác.
                                    </p>
                                    <button
                                        onClick={handleReset}
                                        className="px-10 py-4 bg-primary text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary/20 active:scale-95"
                                    >
                                        Xóa tất cả bộ lọc
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                input[type='range']::-webkit-slider-thumb {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    background: #2563eb;
                    border: 4px solid #fff;
                    border-radius: 50%;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                input[type='range']::-webkit-slider-thumb:hover {
                    transform: scale(1.15);
                    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
                }
            `}</style>
        </div>
    )
}
