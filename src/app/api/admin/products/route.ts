import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Middleware check login đã có ở middleware.ts, nhưng check lại session ở đây để chắc chắn lấy được user info nếu cần log action

export async function GET(request: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { data: products, error } = await supabaseAdmin
            .from('products')
            .select(`
                *,
                categories (id, name)
            `)
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json({ success: true, data: products })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const body = await request.json()

        // Basic validation - check name exists and price is provided (can be 0)
        if (!body.name || body.price === undefined || body.price === null || body.price === '') {
            return NextResponse.json({ error: 'Missing required fields (name and price are required)' }, { status: 400 })
        }

        // Generate slug from name if not provided
        const slug = body.slug || body.name.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[đĐ]/g, "d")
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");

        const { old_price, seo_metadata, ...postData } = body

        // Map SEO metadata if available
        const finalData = {
            ...postData,
            meta_title: seo_metadata?.title || null,
            meta_description: seo_metadata?.description || null,
            keywords: seo_metadata?.keywords || null,
            slug,
            updated_at: new Date().toISOString()
        }

        const { data, error } = await supabaseAdmin
            .from('products')
            .insert(finalData)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ success: true, data })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const body = await request.json()
        const { id, old_price, seo_metadata, ...updates } = body

        // Map SEO metadata if available
        const finalUpdates = {
            ...updates,
            meta_title: seo_metadata?.title || undefined,
            meta_description: seo_metadata?.description || undefined,
            keywords: seo_metadata?.keywords || undefined,
            updated_at: new Date().toISOString()
        }

        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 })

        const { data, error } = await supabaseAdmin
            .from('products')
            .update(finalUpdates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ success: true, data })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 })

    try {
        const { error } = await supabaseAdmin
            .from('products')
            .delete()
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
