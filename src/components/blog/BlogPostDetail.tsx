'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, User, ArrowLeft, Facebook, Twitter, Link as LinkIcon, ChevronRight } from 'lucide-react'

import { getCategorySlug } from '@/lib/blog'

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

interface BlogPostDetailProps {
    post: Post
    relatedPosts?: Post[]
}

export function BlogPostDetail({ post, relatedPosts = [] }: BlogPostDetailProps) {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl)
        alert('Đã sao chép liên kết!')
    }

    return (
        <div className="min-h-screen bg-[#FDFDFF]">
            {/* Top Navigation */}
            <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="container mx-auto px-4">
                    <div className="flex items-center h-16">
                        <Link
                            href="/tin-tuc"
                            className="inline-flex items-center gap-2 text-slate-500 hover:text-primary font-bold text-[10px] uppercase tracking-[0.2em] transition-all group"
                        >
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Quay lại tin tức
                        </Link>
                    </div>
                </div>
            </div>

            {/* Article Header Section */}
            <header className="pt-12 pb-8 md:pt-16 md:pb-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex justify-center mb-4">
                            <Link
                                href={`/tin-tuc/chuyen-muc/${getCategorySlug(post.category)}`}
                                className="px-4 py-1.5 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-primary/10 hover:bg-primary/10 transition-all font-bold"
                            >
                                {post.category || 'Tin tức'}
                            </Link>
                        </div>

                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-4 leading-[1.25]">
                            {post.title}
                        </h1>

                        <p className="text-base md:text-lg text-slate-500 font-medium max-w-2xl mx-auto mb-6 leading-relaxed opacity-80">
                            {post.excerpt}
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-accent" />
                                <span>{post.author || 'Siphonet Admin'}</span>
                            </div>
                            <div className="h-1 w-1 bg-slate-200 rounded-full" />
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-accent" />
                                <span>{new Date(post.publishedDate).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div className="h-1 w-1 bg-slate-200 rounded-full" />
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-accent" />
                                <span>5 Phút đọc</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Featured Image */}
            <div className="container mx-auto px-4 mb-12">
                <div className="max-w-6xl mx-auto relative aspect-[16/9] md:aspect-[21/9] rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200">
                    <Image
                        src={post.featuredImageUrl || '/blog-placeholder.jpg'}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            {/* Content Body */}
            <div className="container mx-auto px-4 pb-24">
                <div className="max-w-3xl mx-auto">
                    <article className="prose prose-lg md:prose-xl prose-slate max-w-none 
                        prose-headings:font-black prose-headings:text-slate-900 prose-headings:leading-tight
                        prose-p:text-slate-600 prose-p:leading-extra-relaxed 
                        prose-strong:text-slate-900 
                        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-3xl prose-img:shadow-lg
                        prose-ul:text-slate-600 prose-li:marker:text-primary">
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </article>

                    {/* Social Share */}
                    <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Chia sẻ bài viết</span>
                        <div className="flex gap-4">
                            {[
                                { icon: Facebook, label: 'Facebook', onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank') },
                                { icon: Twitter, label: 'Twitter', onClick: () => window.open(`https://twitter.com/intent/tweet?url=${shareUrl}`, '_blank') },
                                { icon: LinkIcon, label: 'Copy Link', onClick: handleCopyLink }
                            ].map((social, i) => (
                                <button
                                    key={i}
                                    onClick={social.onClick}
                                    className="h-12 w-12 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-900 hover:border-slate-900 transition-all duration-300 shadow-sm"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-5 w-5" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="bg-slate-50 py-24 border-t border-slate-100">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="flex items-end justify-between mb-12">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-3 block">Khám phá thêm</span>
                                    <h2 className="text-3xl md:text-4xl font-black text-slate-900">Bài viết liên quan</h2>
                                </div>
                                <Link href="/tin-tuc" className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-accent transition-colors group">
                                    Xem tất cả bài viết <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {relatedPosts.slice(0, 3).map((p) => (
                                    <Link key={p.id} href={`/tin-tuc/${p.slug}`} className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                                        <div className="relative aspect-[16/10] overflow-hidden">
                                            <Image
                                                src={p.featuredImageUrl || '/blog-placeholder.jpg'}
                                                alt={p.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <Link
                                                href={`/tin-tuc/chuyen-muc/${getCategorySlug(p.category)}`}
                                                className="text-[9px] font-black uppercase tracking-widest text-primary mb-3 block hover:underline"
                                            >
                                                {p.category}
                                            </Link>
                                            <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-primary transition-colors leading-snug mb-4">
                                                {p.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                <Calendar className="h-3 w-3 text-accent" />
                                                {new Date(p.publishedDate).toLocaleDateString('vi-VN')}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}
