import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const isTrash = searchParams.get('trash') === 'true'

        if (id) {
            const { data, error } = await supabaseAdmin
                .from('posts')
                .select('*, categories!category_id(*)')
                .eq('id', id)
                .single()

            if (error) throw error
            return NextResponse.json({ success: true, data })
        }

        let query = supabaseAdmin
            .from('posts')
            .select('*, categories!category_id(*)')

        if (isTrash) {
            query = query.not('deleted_at', 'is', null)
        } else {
            query = query.is('deleted_at', null)
        }

        const { data, error } = await query.order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json({ success: true, data })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const body = await request.json()
        const { featured, seo_score, image, focus_keywords, categoryId, category_id, ...postData } = body

        if (!postData.title) {
            return NextResponse.json({ error: 'Missing title' }, { status: 400 })
        }

        // Generate slug if not provided
        const slug = postData.slug || postData.title.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[đĐ]/g, "d")
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");

        const { data, error } = await supabaseAdmin
            .from('posts')
            .insert({
                ...postData,
                slug,
                category_id: body.categoryId || body.category_id,
                featured_image_url: image,
                focus_keywords,
                author: postData.author || session.name || 'Quản trị viên',
                updated_at: new Date().toISOString(),
                deleted_at: null
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ success: true, data })
    } catch (error: any) {
        console.error('POST Post Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const body = await request.json()
        const { id, featured, seo_score, image, focus_keywords, categoryId, category_id, restore, ...updates } = body

        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 })

        const finalUpdates: any = {
            ...updates,
            category_id: categoryId || category_id,
            featured_image_url: image,
            focus_keywords,
            updated_at: new Date().toISOString()
        }

        if (restore) {
            finalUpdates.deleted_at = null
        }

        const { data, error } = await supabaseAdmin
            .from('posts')
            .update(finalUpdates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ success: true, data })
    } catch (error: any) {
        console.error('PUT Post Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const permanent = searchParams.get('permanent') === 'true'

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 })

    try {
        if (permanent) {
            const { error } = await supabaseAdmin
                .from('posts')
                .delete()
                .eq('id', id)
            if (error) throw error
        } else {
            const { error } = await supabaseAdmin
                .from('posts')
                .update({ deleted_at: new Date().toISOString() })
                .eq('id', id)
            if (error) throw error
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
