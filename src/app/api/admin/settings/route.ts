import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { data, error } = await supabaseAdmin
            .from('settings')
            .select('*')

        if (error) throw error

        // Transform array to object for easier frontend consumption
        const settingsMap = data.reduce((acc: any, curr: any) => {
            acc[curr.key] = curr.value
            return acc
        }, {})

        return NextResponse.json({ success: true, data: settingsMap })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const body = await request.json()
        const keys = Object.keys(body)

        // Upsert each setting
        for (const key of keys) {
            const { error } = await supabaseAdmin
                .from('settings')
                .upsert({
                    key,
                    value: body[key],
                    updated_at: new Date().toISOString()
                })

            if (error) throw error
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
