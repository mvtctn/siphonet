import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProductsPage } from '@/components/products/ProductsPage'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default async function ProductCategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    return (
        <>
            <Header />
            <Suspense fallback={<div className="min-h-screen animate-pulse bg-slate-50" />}>
                <ProductsPage initialCategory={slug} />
            </Suspense>
            <Footer />
        </>
    )
}
