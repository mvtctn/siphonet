
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BlogPage } from '@/components/blog/BlogPage'
import { getCategoryName } from '@/lib/blog'
import { notFound } from 'next/navigation'

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ categorySlug: string }>
}) {
    const { categorySlug } = await params
    const categoryName = getCategoryName(categorySlug)

    if (!categoryName) {
        notFound()
    }

    return (
        <>
            <Header />
            <BlogPage category={categoryName} />
            <Footer />
        </>
    )
}
