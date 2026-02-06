'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal, ChevronRight, Star, X } from 'lucide-react'
import Link from 'next/link'

interface Category {
    id: string
    name: string
    slug: string
}

interface ProductSidebarProps {
    categories: Category[]
    selectedCategory: string
    onCategoryChange: (categorySlug: string) => void
    priceRange: [number, number]
    onPriceChange: (range: [number, number]) => void
    minRating: number
    onRatingChange: (rating: number) => void
    searchQuery: string
    onSearchChange: (query: string) => void
    onReset: () => void
}

export function ProductSidebar({
    categories,
    selectedCategory,
    onCategoryChange,
    priceRange,
    onPriceChange,
    minRating,
    onRatingChange,
    searchQuery,
    onSearchChange,
    onReset
}: ProductSidebarProps) {
    const [isSearchFocused, setIsSearchFocused] = useState(false)

    return (
        <aside className="space-y-8">
            {/* Search Section - Mobile & Desktop */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Search className="h-3.5 w-3.5 text-primary" />
                    Tìm kiếm
                </h3>
                <div className={`relative transition-all duration-300 ${isSearchFocused ? 'ring-2 ring-primary/20' : ''}`}>
                    <input
                        type="text"
                        placeholder="Nhập tên thiết bị..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:bg-white transition-all"
                    />
                    {searchQuery ? (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-red-500 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    ) : (
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    )}
                </div>
            </div>

            {/* Categories Section */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                    Danh mục
                </h3>
                <div className="space-y-1">
                    <button
                        onClick={() => onCategoryChange('all')}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${selectedCategory === 'all'
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                            }`}
                    >
                        <span className="font-semibold text-sm">Tất cả sản phẩm</span>
                        <ChevronRight className={`h-4 w-4 transition-transform ${selectedCategory === 'all' ? 'rotate-90' : 'group-hover:translate-x-1 opacity-50'}`} />
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => onCategoryChange(category.slug)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${selectedCategory === category.slug
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                                }`}
                        >
                            <span className="font-medium text-sm">{category.name}</span>
                            <ChevronRight className={`h-4 w-4 transition-transform ${selectedCategory === category.slug ? 'rotate-90' : 'group-hover:translate-x-1 opacity-50'}`} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Filter */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Khoảng giá</h3>
                <div className="space-y-4">
                    <input
                        type="range"
                        min="0"
                        max="100000000"
                        step="1000000"
                        value={priceRange[1]}
                        onChange={(e) => onPriceChange([0, parseInt(e.target.value)])}
                        className="w-full accent-primary h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-400">0đ</span>
                        <span className="text-xs font-semibold text-primary bg-primary/5 px-3 py-1.5 rounded-full">
                            Dưới {new Intl.NumberFormat('vi-VN').format(priceRange[1])}đ
                        </span>
                    </div>
                </div>
            </div>

            {/* Rating Filter */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Đánh giá</h3>
                <div className="space-y-2">
                    {[5, 4, 3].map((rating) => (
                        <button
                            key={rating}
                            onClick={() => onRatingChange(rating === minRating ? 0 : rating)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all ${minRating === rating
                                ? 'bg-amber-50 text-amber-600 border border-amber-200'
                                : 'bg-slate-50 text-slate-600 border border-transparent hover:bg-slate-100'
                                }`}
                        >
                            <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-3.5 w-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider italic">Trở lên</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Reset Button */}
            <button
                onClick={onReset}
                className="w-full py-4 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors"
            >
                Đặt lại bộ lọc
            </button>
        </aside>
    )
}
