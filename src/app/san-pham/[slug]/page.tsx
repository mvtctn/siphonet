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
    // Fetch product from Supabase
    console.log('Fetching public product slug:', slug)

    const { data: product, error } = await supabase
        .from('products')
        .select('*') // Simplify query to isolate join issues
        .eq('slug', slug)
        .single()

    if (error) {
        console.error('Error fetching public product:', error)
    }

    if (!product) {
        console.error('Public product not found for slug:', slug)
        notFound()
    }

    // Fetch category name separately
    let categoryName = 'Sản phẩm'
    if (product.category_id) {
        const { data: cat } = await supabase
            .from('categories')
            .select('name')
            .eq('id', product.category_id)
            .single()
        if (cat) categoryName = cat.name
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
        categoryId: product.category_id,
        category: categoryName,
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

    const relatedProducts = relatedProductsData?.map((p: any) => ({
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
