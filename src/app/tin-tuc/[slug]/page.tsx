import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BlogPostDetail } from '@/components/blog/BlogPostDetail'
import { mockPosts } from '@/lib/mock-blog-data'
import { notFound } from 'next/navigation'

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const post = mockPosts.find((p) => p.slug === slug)

    if (!post) {
        notFound()
    }

    return (
        <>
            <Header />
            <BlogPostDetail post={post} />
            <Footer />
        </>
    )
}
