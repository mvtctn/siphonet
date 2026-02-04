import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProductDetail } from '@/components/products/ProductDetail'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    // Fetch product from Supabase
    const { data: product, error } = await supabase
        .from('products')
        .select(`
            *,
            categories (
                id,
                name,
                slug
            )
        `)
        .eq('slug', slug)
        .single()

    if (error || !product) {
        notFound()
    }

    // Transform data to match ProductDetail interface
    const transformedProduct = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        price: parseFloat(product.price),
        stock: product.stock,
        sku: product.sku || '',
        category: product.categories?.name || '',
        categoryId: product.category_id,
        images: product.images || [],
        technicalSpecifications: product.technical_specifications || [],
        featured: product.featured || false,
        rating: 4.5, // Placeholder
    }

    // Fetch related products
    const { data: relatedProductsData } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', product.category_id)
        .neq('id', product.id)
        .limit(4)

    const relatedProducts = relatedProductsData?.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: parseFloat(p.price),
        images: p.images || [],
        categoryId: p.category_id
    })) || []

    return (
        <>
            <Header />
            <ProductDetail product={transformedProduct} relatedProducts={relatedProducts} />
            <Footer />
        </>
    )
}
