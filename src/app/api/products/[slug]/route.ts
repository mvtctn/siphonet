import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ slug: string }> }
) {
    try {
        const params = await props.params;
        const slug = params.slug

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

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json(
                { error: 'Product not found', details: error.message },
                { status: 404 }
            )
        }

        // Transform data
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

        return NextResponse.json({
            success: true,
            data: transformedProduct
        })

    } catch (error: any) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        )
    }
}
