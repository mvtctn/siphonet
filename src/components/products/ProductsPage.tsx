'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { ProductCard } from '@/components/products/ProductCard'
import { mockProducts, mockCategories } from '@/lib/mock-data'

export function ProductsPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState('')

    // Filter products
    const filteredProducts = mockProducts.filter((product) => {
        const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
            {/* Page Header */}
            <div className="bg-primary text-white py-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Sản phẩm thiết bị M&E
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl">
                        Thiết bị chính hãng, chất lượng cao từ các thương hiệu hàng đầu thế giới
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar Filters */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
                            <div className="flex items-center gap-2 mb-6">
                                <SlidersHorizontal className="h-5 w-5 text-accent" />
                                <h2 className="font-bold text-lg">Bộ lọc</h2>
                            </div>

                            {/* Search */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Tìm kiếm
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Tên sản phẩm..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-3">
                                    Danh mục
                                </label>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setSelectedCategory('all')}
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${selectedCategory === 'all'
                                                ? 'bg-accent text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            }`}
                                    >
                                        Tất cả sản phẩm
                                    </button>
                                    {mockCategories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.id)}
                                            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${selectedCategory === category.id
                                                    ? 'bg-accent text-white'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                }`}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <main className="lg:col-span-3">
                        {/* Results count */}
                        <div className="mb-6">
                            <p className="text-slate-600">
                                Hiển thị <span className="font-semibold">{filteredProducts.length}</span> sản phẩm
                            </p>
                        </div>

                        {/* Products Grid */}
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-slate-500 text-lg">
                                    Không tìm thấy sản phẩm phù hợp
                                </p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}
