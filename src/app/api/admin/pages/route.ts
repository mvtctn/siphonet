import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const isTrash = searchParams.get('trash') === 'true'

        let query = supabase
            .from('pages')
            .select('*')

        if (isTrash) {
            query = query.not('deleted_at', 'is', null)
        } else {
            query = query.is('deleted_at', null)
        }

        const { data, error } = await query.order('updated_at', { ascending: false })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, data })
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { title, slug, layout, meta_title, meta_description, status } = body

        const { data, error } = await supabase
            .from('pages')
            .insert([{ title, slug, layout, meta_title, meta_description, status, deleted_at: null }])
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
