'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Calendar, Clock, ChevronRight, TrendingUp, Newspaper, ArrowRight, Loader2, Filter } from 'lucide-react'

interface Post {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    featuredImageUrl: string
    category: string
    tags: string[]
    publishedDate: string
    author: string
}

interface CategoryCount {
    category: string
    count: number
}

const CATEGORY_DETAILS: Record<string, { description: string, image: string }> = {
    'Công ty': {
        description: 'Cập nhật những tin tức mới nhất về hoạt động, sự kiện và thành tựu của Siphonet.',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200'
    },
    'Tuyển dụng': {
        description: 'Gia nhập đội ngũ kiến tạo tương lai tại Siphonet. Tìm kiếm cơ hội nghề nghiệp hấp dẫn.',
        image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200'
    },
    'Công nghệ': {
        description: 'Khám phá các giải pháp kỹ thuật tiên tiến và xu hướng công nghệ trong ngành M&E.',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200'
    },
    'Chuyên ngành': {
        description: 'Kiến thức chuyên sâu, tiêu chuẩn kỹ thuật và bí quyết vận hành hệ thống cơ điện.',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200'
    },
    'Xã hội': {
        description: 'Các hoạt động hướng về cộng đồng và cam kết phát triển bền vững của chúng tôi.',
        image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1200'
    }
}

export function BlogPage() {
    const [posts, setPosts] = useState<Post[]>([])
    const [categories, setCategories] = useState<CategoryCount[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const [postsRes, catsRes] = await Promise.all([
                    fetch(`/api/posts${selectedCategory ? `?category=${selectedCategory}` : ''}`),
                    fetch('/api/posts/categories')
                ])
                const [postsData, catsData] = await Promise.all([
                    postsRes.json(),
                    catsRes.json()
                ])
                if (postsData.success) {
                    const sortedPosts = postsData.data.sort((a: Post, b: Post) =>
                        new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
                    )
                    setPosts(sortedPosts)
                }
                if (catsData.success) setCategories(catsData.data)
            } catch (error) {
                console.error('Failed to fetch blog data', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [selectedCategory])

    const featuredPost = posts[0]
    const listPosts = selectedCategory || searchTerm ? posts : posts.slice(1)

    const filteredPosts = listPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading && posts.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-slate-400 font-medium text-sm">Đang tải tin tức...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Simple Hero Section */}
            <section className="pt-24 pb-12 border-b border-slate-100 bg-slate-50/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-4">
                            <Newspaper className="h-4 w-4" />
                            <span>Tin tức & Sự kiện</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                            {selectedCategory || 'Cổng Thông Tin Siphonet'}
                        </h1>
                        <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
                            {selectedCategory
                                ? CATEGORY_DETAILS[selectedCategory]?.description
                                : 'Cập nhật xu hướng công nghệ và tin tức hoạt động từ Siphonet.'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Flat Navigation Bar */}
            <div className="sticky top-20 z-40 bg-white border-b border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center h-14 gap-8 overflow-x-auto no-scrollbar scroll-smooth">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all h-full flex items-center relative ${!selectedCategory ? 'text-primary' : 'text-slate-400 hover:text-slate-900'}`}
                            >
                                Tất cả bài viết
                                {!selectedCategory && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.category}
                                    onClick={() => setSelectedCategory(cat.category)}
                                    className={`text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all h-full flex items-center relative ${selectedCategory === cat.category ? 'text-primary' : 'text-slate-400 hover:text-slate-900'}`}
                                >
                                    {cat.category}
                                    <span className="ml-2 text-[10px] text-slate-400 group-hover:text-slate-600">({cat.count})</span>
                                    {selectedCategory === cat.category && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                                </button>
                            ))}
                        </div>

                        <div className="hidden lg:flex items-center gap-6 pl-8">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm tin tức..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-9 pr-4 text-xs focus:ring-1 focus:ring-primary focus:border-transparent w-48 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-12">
                {/* Simple Featured Post */}
                {!selectedCategory && !searchTerm && featuredPost && (
                    <div className="mb-16">
                        <Link href={`/tin-tuc/${featuredPost.slug}`} className="group relative block aspect-[21/9] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                            <Image
                                src={featuredPost.featuredImageUrl || '/blog-placeholder.jpg'}
                                alt={featuredPost.title}
                                fill
                                className="object-cover group-hover:opacity-90 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                                <span className="inline-block px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-md mb-4">
                                    Nổi bật
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 line-clamp-2 leading-tight">
                                    {featuredPost.title}
                                </h2>
                            </div>
                        </Link>
                    </div>
                )}

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Posts List */}
                    <div className="lg:col-span-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            {filteredPosts.map((post) => (
                                <article key={post.id} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-200 transition-all hover:border-primary/40 shadow-sm hover:shadow-md">
                                    <Link href={`/tin-tuc/${post.slug}`} className="relative aspect-[16/10] overflow-hidden bg-slate-100 border-b border-slate-100">
                                        <Image
                                            src={post.featuredImageUrl || '/blog-placeholder.jpg'}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </Link>

                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                                            <span className="text-primary">{post.category}</span>
                                            <span className="h-1 w-1 bg-slate-200 rounded-full" />
                                            <span>{new Date(post.publishedDate).toLocaleDateString('vi-VN')}</span>
                                        </div>

                                        <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                            <Link href={`/tin-tuc/${post.slug}`}>{post.title}</Link>
                                        </h3>

                                        <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed">
                                            {post.excerpt}
                                        </p>

                                        <div className="mt-auto pt-4 border-t border-slate-50">
                                            <Link
                                                href={`/tin-tuc/${post.slug}`}
                                                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-900 group-hover:text-primary transition-colors"
                                            >
                                                Xem chi tiết <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {filteredPosts.length === 0 && (
                            <div className="text-center py-24 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="bg-white h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                    <Newspaper className="h-6 w-6 text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Chưa có bài viết nào</h3>
                                <p className="text-slate-400 text-sm max-w-xs mx-auto">Chúng tôi đang cập nhật tin tức cho danh mục này.</p>
                            </div>
                        )}
                    </div>

                    {/* Simple Sidebar */}
                    <aside className="lg:col-span-4 space-y-12">
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-8 border-b border-slate-900 pb-2">
                                Bài mới nhất
                            </h4>
                            <div className="space-y-6">
                                {posts.slice(0, 5).map((post) => (
                                    <Link key={post.id} href={`/tin-tuc/${post.slug}`} className="flex gap-4 group/item">
                                        <div className="h-16 w-16 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-100">
                                            <Image
                                                src={post.featuredImageUrl || '/blog-placeholder.jpg'}
                                                alt={post.title}
                                                width={64}
                                                height={64}
                                                className="h-full w-full object-cover grayscale group-hover/item:grayscale-0 transition-all duration-500"
                                            />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <h5 className="text-[13px] font-bold text-slate-800 line-clamp-2 group-hover/item:text-primary transition-colors leading-snug mb-1">
                                                {post.title}
                                            </h5>
                                            <span className="text-[10px] text-slate-400 font-medium">
                                                {new Date(post.publishedDate).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all" />
                            <h4 className="text-lg font-bold mb-3 relative z-10">Tư vấn kỹ thuật</h4>
                            <p className="text-slate-400 text-xs leading-relaxed mb-6 relative z-10">
                                Nhận giải pháp tối ưu từ đội ngũ kỹ sư Siphonet cho công trình của bạn.
                            </p>
                            <Link
                                href="/lien-he"
                                className="inline-flex items-center justify-center w-full py-3 bg-white text-slate-900 text-[11px] font-bold uppercase tracking-wider rounded-lg hover:bg-slate-100 transition-all relative z-10"
                            >
                                Gửi yêu cầu <ArrowRight className="ml-2 h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    )
}
