import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        // Get query parameters
        const category = searchParams.get('category')
        const search = searchParams.get('search')
        const minPrice = searchParams.get('minPrice')
        const maxPrice = searchParams.get('maxPrice')
        const minRating = searchParams.get('minRating')
        const sortBy = searchParams.get('sortBy') || 'newest'
        const featured = searchParams.get('featured')

        // Build query
        let query = supabase
            .from('products')
            .select(`
                *,
                categories (
                    id,
                    name,
                    slug
                )
            `)
            .eq('status', 'published')

        // Apply filters
        if (category) {
            query = query.eq('category_id', category)
        }

        if (search) {
            query = query.ilike('name', `%${search}%`)
        }

        if (minPrice) {
            query = query.gte('price', parseFloat(minPrice))
        }

        if (maxPrice) {
            query = query.lte('price', parseFloat(maxPrice))
        }

        if (featured === 'true') {
            query = query.eq('featured', true)
        }

        // Apply sorting
        switch (sortBy) {
            case 'price-asc':
                query = query.order('price', { ascending: true })
                break
            case 'price-desc':
                query = query.order('price', { ascending: false })
                break
            case 'name':
                query = query.order('name', { ascending: true })
                break
            case 'popular':
                query = query.order('featured', { ascending: false })
                break
            case 'newest':
            default:
                query = query.order('created_at', { ascending: false })
                break
        }

        // Execute query
        const { data: products, error } = await query

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json(
                { error: 'Failed to fetch products', details: error.message },
                { status: 500 }
            )
        }

        // Transform data to match frontend interface
        const transformedProducts = products?.map(product => ({
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
            rating: 4.5, // TODO: Calculate from reviews table
        }))

        return NextResponse.json({
            success: true,
            data: transformedProducts || [],
            count: transformedProducts?.length || 0
        })

    } catch (error: any) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        )
    }
}
