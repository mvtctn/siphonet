'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Calendar, Tag, Clock } from 'lucide-react'
import { mockPosts } from '@/lib/mock-blog-data'

export function BlogPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    const categories = ['Tất cả', 'Công nghệ', 'Dự án', 'Sản phẩm mới', 'Hướng dẫn']

    const filteredPosts = mockPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = !selectedCategory || selectedCategory === 'Tất cả' || post.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-primary mb-4">Tin tức & Bài viết</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Cập nhật tin tức mới nhất về công nghệ, sản phẩm và dự án của Siphonet
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm bài viết..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category === 'Tất cả' ? null : category)}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${(category === 'Tất cả' && !selectedCategory) || selectedCategory === category
                                    ? 'bg-accent text-white shadow-lg shadow-accent/30'
                                    : 'bg-white text-slate-700 hover:bg-slate-100 shadow-md'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Blog Posts Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {filteredPosts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/tin-tuc/${post.slug}`}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden group"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-accent text-white text-sm font-medium rounded-full">
                                        {post.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{new Date(post.date).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>{post.readTime}</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors line-clamp-2">
                                    {post.title}
                                </h3>

                                <p className="text-slate-600 mb-4 line-clamp-3">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center gap-2">
                                    <Tag className="h-4 w-4 text-slate-400" />
                                    <div className="flex flex-wrap gap-2">
                                        {post.tags.slice(0, 2).map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-sm text-slate-500"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredPosts.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-slate-500 text-lg">Không tìm thấy bài viết phù hợp</p>
                    </div>
                )}
            </div>
        </div>
    )
}
