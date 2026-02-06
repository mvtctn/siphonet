import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { data, error } = await supabase
            .from('pages')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 404 })
        }

        return NextResponse.json({ success: true, data })
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { title, slug, layout, meta_title, meta_description, status, restore } = body

        const updateData: any = {
            title,
            slug,
            layout,
            meta_title,
            meta_description,
            status,
            updated_at: new Date().toISOString()
        }

        if (restore) {
            updateData.deleted_at = null
        }

        const { data, error } = await supabase
            .from('pages')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, data })
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { searchParams } = new URL(request.url)
        const permanent = searchParams.get('permanent') === 'true'

        if (permanent) {
            const { error } = await supabase
                .from('pages')
                .delete()
                .eq('id', id)
            if (error) throw error
        } else {
            const { error } = await supabase
                .from('pages')
                .update({ deleted_at: new Date().toISOString() })
                .eq('id', id)
            if (error) throw error
        }

        return NextResponse.json({ success: true, message: permanent ? 'Page deleted permanently' : 'Page moved to trash' })
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
}
