import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, User, Tag, ArrowLeft, Share2 } from 'lucide-react'
import { mockPosts } from '@/lib/mock-blog-data'

interface BlogPostDetailProps {
    post: typeof mockPosts[0]
}

export function BlogPostDetail({ post }: BlogPostDetailProps) {
    const relatedPosts = mockPosts
        .filter(p => p.id !== post.id && p.category === post.category)
        .slice(0, 3)

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <div className="max-w-4xl mx-auto mb-8">
                    <Link
                        href="/tin-tuc"
                        className="inline-flex items-center gap-2 text-accent hover:text-accent-600 font-medium"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Quay lại tin tức
                    </Link>
                </div>

                {/* Article Header */}
                <article className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                        <div className="relative h-96">
                            <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-6 left-6">
                                <span className="px-4 py-2 bg-accent text-white font-medium rounded-full">
                                    {post.category}
                                </span>
                            </div>
                        </div>

                        <div className="p-8">
                            <h1 className="text-4xl font-bold text-primary mb-6">
                                {post.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6 text-slate-600 mb-8 pb-8 border-b">
                                <div className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    <span>{post.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    <span>{new Date(post.date).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    <span>{post.readTime}</span>
                                </div>
                                <button className="ml-auto flex items-center gap-2 text-accent hover:text-accent-600">
                                    <Share2 className="h-5 w-5" />
                                    Chia sẻ
                                </button>
                            </div>

                            {/* Article Content */}
                            <div className="prose prose-lg max-w-none">
                                <p className="lead text-xl text-slate-700 mb-8">
                                    {post.excerpt}
                                </p>
                                <p className="text-slate-600 leading-relaxed">
                                    {post.content}
                                </p>
                            </div>

                            {/* Tags */}
                            <div className="mt-8 pt-8 border-t">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <Tag className="h-5 w-5 text-slate-400" />
                                    {post.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Posts */}
                    {relatedPosts.length > 0 && (
                        <div className="mt-16">
                            <h2 className="text-3xl font-bold text-primary mb-8">Bài viết liên quan</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {relatedPosts.map((relatedPost) => (
                                    <Link
                                        key={relatedPost.id}
                                        href={`/tin-tuc/${relatedPost.slug}`}
                                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden group"
                                    >
                                        <div className="relative h-40 overflow-hidden">
                                            <Image
                                                src={relatedPost.image}
                                                alt={relatedPost.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-primary group-hover:text-accent transition-colors line-clamp-2">
                                                {relatedPost.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 mt-2">
                                                {new Date(relatedPost.date).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </article>
            </div>
        </div>
    )
}
