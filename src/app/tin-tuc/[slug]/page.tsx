import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BlogPostDetail } from '@/components/blog/BlogPostDetail'
import { notFound } from 'next/navigation'
import { db } from '@/db'
import { posts } from '@/db/schema'
import { eq, and, ne } from 'drizzle-orm'

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    // Fetch current post
    const currentPost = await db.query.posts.findFirst({
        where: and(
            eq(posts.slug, slug),
            eq(posts.status, 'published')
        )
    })

    if (!currentPost) {
        notFound()
    }

    // Fetch related posts (same category, excluding current)
    const relatedPosts = await db.select()
        .from(posts)
        .where(
            and(
                eq(posts.status, 'published'),
                eq(posts.category, currentPost.category || ''),
                ne(posts.id, currentPost.id)
            )
        )
        .limit(3)

    // Map to the interface expected by BlogPostDetail
    const mappedPost = {
        ...currentPost,
        excerpt: currentPost.excerpt || '',
        content: currentPost.content || '',
        publishedDate: currentPost.publishedDate?.toISOString() || currentPost.createdAt.toISOString(),
        featuredImageUrl: currentPost.featuredImageUrl || '',
        category: currentPost.category || 'Tin tức',
        tags: currentPost.tags || [],
        author: currentPost.author || 'Siphonet Admin'
    }

    const mappedRelatedPosts = relatedPosts.map(p => ({
        ...p,
        excerpt: p.excerpt || '',
        content: p.content || '',
        publishedDate: p.publishedDate?.toISOString() || p.createdAt.toISOString(),
        featuredImageUrl: p.featuredImageUrl || '',
        category: p.category || 'Tin tức',
        tags: p.tags || [],
        author: p.author || 'Siphonet Admin'
    }))

    return (
        <>
            <Header />
            <BlogPostDetail post={mappedPost} relatedPosts={mappedRelatedPosts} />
            <Footer />
        </>
    )
}
