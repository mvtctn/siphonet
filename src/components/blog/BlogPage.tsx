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
                    // Sort by published date descending
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
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-slate-500 font-medium animate-pulse">Đang tải tin tức...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FDFDFF]">
            {/* Hero / Category Header */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-[#0A192F]" />
                <div className="absolute inset-0 opacity-20">
                    <Image
                        src={selectedCategory ? CATEGORY_DETAILS[selectedCategory]?.image : (featuredPost?.featuredImageUrl || '/blog-placeholder.jpg')}
                        alt="Background"
                        fill
                        className="object-cover blur-[2px]"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FDFDFF]" />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-[0.2em] mb-6 border border-accent/20">
                            {selectedCategory ? 'Danh mục tin tức' : 'Tin tức & Sự kiện'}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-sm">
                            {selectedCategory || 'Cổng Thông Tin Siphonet'}
                        </h1>
                        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            {selectedCategory
                                ? CATEGORY_DETAILS[selectedCategory]?.description
                                : 'Cập nhật những xu hướng công nghệ mới nhất và tin tức hoạt động từ Siphonet.'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Category Navigation */}
            <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center h-16 gap-6 md:gap-10 overflow-x-auto no-scrollbar scroll-smooth">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all relative h-full flex items-center px-2 group ${!selectedCategory ? 'text-primary' : 'text-slate-400 hover:text-slate-900'
                                    }`}
                            >
                                <span className="relative z-10 transition-transform group-hover:-translate-y-0.5">Tất cả bài viết</span>
                                {!selectedCategory && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-2px_8px_rgba(var(--primary-rgb),0.3)]" />
                                )}
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.category}
                                    onClick={() => setSelectedCategory(cat.category)}
                                    className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all relative h-full flex items-center px-2 group ${selectedCategory === cat.category ? 'text-primary' : 'text-slate-400 hover:text-slate-900'
                                        }`}
                                >
                                    <span className="relative z-10 transition-transform group-hover:-translate-y-0.5">
                                        {cat.category}
                                        <span className={`ml-2 text-[9px] px-1.5 py-0.5 rounded-md ${selectedCategory === cat.category ? 'bg-primary/10' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
                                            {cat.count}
                                        </span>
                                    </span>
                                    {selectedCategory === cat.category && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-2px_8px_rgba(var(--primary-rgb),0.3)]" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="hidden lg:flex items-center gap-4 border-l border-slate-100 pl-8">
                            <button className="text-slate-400 hover:text-primary transition-colors">
                                <Filter className="h-4 w-4" />
                            </button>
                            <div className="h-4 w-[1px] bg-slate-100" />
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm tin tức..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-slate-50 border-none rounded-full py-2 pl-9 pr-4 text-xs focus:ring-1 focus:ring-primary/20 w-48 outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-16">
                {/* Featured Post (only on "All" view) */}
                {!selectedCategory && !searchTerm && featuredPost && (
                    <div className="mb-20">
                        <Link href={`/tin-tuc/${featuredPost.slug}`} className="group relative block aspect-[21/9] rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200 lg:mb-10 mb-6">
                            <Image
                                src={featuredPost.featuredImageUrl || '/blog-placeholder.jpg'}
                                alt={featuredPost.title}
                                fill
                                className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                                <div className="max-w-3xl">
                                    <span className="inline-block px-4 py-1.5 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-lg mb-4">
                                        Bài viết nổi bật
                                    </span>
                                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight group-hover:text-accent transition-colors">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-slate-200 text-lg line-clamp-2 md:block hidden mb-0 opacity-80">
                                        {featuredPost.excerpt}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                <div className="grid lg:grid-cols-12 gap-16">
                    {/* Posts List */}
                    <div className="lg:col-span-8">
                        <div className="grid md:grid-cols-2 gap-10">
                            {filteredPosts.map((post) => (
                                <article key={post.id} className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                                    <Link href={`/tin-tuc/${post.slug}`} className="relative aspect-[16/10] overflow-hidden">
                                        <Image
                                            src={post.featuredImageUrl || '/blog-placeholder.jpg'}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-primary text-[9px] font-black uppercase tracking-widest rounded-lg shadow-sm border border-slate-100">
                                                {post.category}
                                            </span>
                                        </div>
                                    </Link>

                                    <div className="p-8 flex flex-col flex-1">
                                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-3 w-3 text-accent" />
                                                {new Date(post.publishedDate).toLocaleDateString('vi-VN')}
                                            </div>
                                            <div className="h-1 w-1 bg-slate-200 rounded-full" />
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="h-3 w-3 text-accent" />
                                                5 phút đọc
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                            <Link href={`/tin-tuc/${post.slug}`}>{post.title}</Link>
                                        </h3>

                                        <p className="text-slate-500 text-sm line-clamp-3 mb-8 leading-relaxed opacity-90">
                                            {post.excerpt}
                                        </p>

                                        <div className="mt-auto">
                                            <Link
                                                href={`/tin-tuc/${post.slug}`}
                                                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-accent transition-colors group/link"
                                            >
                                                Tiếp tục đọc <ChevronRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {filteredPosts.length === 0 && (
                            <div className="text-center py-32 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                                <div className="bg-white h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <Newspaper className="h-8 w-8 text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Chưa có bài viết nào</h3>
                                <p className="text-slate-400 text-sm max-w-xs mx-auto">Chúng tôi đang cập nhật tin tức cho danh mục này. Vui lòng quay lại sau.</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-12">
                        {/* Latest News */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm sticky top-40">
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-accent" />
                                    Bài viết mới nhất
                                </h4>
                            </div>

                            <div className="space-y-8">
                                {posts.slice(0, 5).map((post) => (
                                    <Link key={post.id} href={`/tin-tuc/${post.slug}`} className="flex gap-4 group/item">
                                        <div className="h-20 w-20 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-slate-50">
                                            <Image
                                                src={post.featuredImageUrl || '/blog-placeholder.jpg'}
                                                alt={post.title}
                                                width={100}
                                                height={100}
                                                className="h-full w-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <h5 className="text-[13px] font-bold text-slate-800 line-clamp-2 group-hover/item:text-primary transition-colors leading-snug mb-2">
                                                {post.title}
                                            </h5>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                {new Date(post.publishedDate).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-12 pt-8 border-t border-slate-50">
                                <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                                    <h4 className="text-sm font-bold text-primary mb-3">Tư vấn miễn phí</h4>
                                    <p className="text-slate-500 text-xs leading-relaxed mb-6">
                                        Nhận giải pháp kỹ thuật tối ưu nhất cho công trình của bạn từ đội ngũ chuyên gia Siphonet.
                                    </p>
                                    <Link
                                        href="/lien-he"
                                        className="inline-flex items-center justify-center w-full py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-600 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
                                    >
                                        Gửi yêu cầu <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    )
}
