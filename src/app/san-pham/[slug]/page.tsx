import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProductDetail } from '@/components/products/ProductDetail'
import { mockProducts } from '@/lib/mock-data'
import { notFound } from 'next/navigation'

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const product = mockProducts.find((p) => p.slug === slug)

    if (!product) {
        notFound()
    }

    return (
        <>
            <Header />
            <ProductDetail product={product} />
            <Footer />
        </>
    )
}
