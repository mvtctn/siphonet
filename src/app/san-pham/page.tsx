import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProductsPage } from '@/components/products/ProductsPage'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default function Products() {
    return (
        <>
            <Header />
            <Suspense fallback={<div className="min-h-screen animate-pulse bg-slate-50" />}>
                <ProductsPage />
            </Suspense>
            <Footer />
        </>
    )
}
