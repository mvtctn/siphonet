import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

// GET all menus or a single menu by location
export async function GET(request: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { searchParams } = new URL(request.url)
        const location = searchParams.get('location')

        let query = supabaseAdmin.from('menus').select('*')

        if (location) {
            query = query.eq('location', location)
        }

        const { data, error } = await query.order('name')

        if (error) throw error
        return NextResponse.json({ success: true, data })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// POST create/update a menu
export async function POST(request: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const body = await request.json()
        const { id, name, location, items, style, config, active } = body

        if (!name || !location) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const menuData: any = {
            name,
            location,
            items: items || [],
            style: style || 'list',
            config: config || {},
            active: active ?? true,
            updated_at: new Date().toISOString(),
        }

        let result
        if (id) {
            // Update
            result = await supabaseAdmin
                .from('menus')
                .update(menuData)
                .eq('id', id)
                .select()
        } else {
            // Create
            result = await supabaseAdmin
                .from('menus')
                .insert([menuData])
                .select()
        }

        if (result.error) throw result.error
        return NextResponse.json({ success: true, data: result.data[0] })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// DELETE a menu
export async function DELETE(request: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Missing menu ID' }, { status: 400 })
        }

        const { error } = await supabaseAdmin
            .from('menus')
            .delete()
            .eq('id', id)

        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
