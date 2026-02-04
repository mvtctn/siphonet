import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name')

        if (error) {
            console.error('Supabase error fetching categories:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            data: data || []
        })
    } catch (error: any) {
        console.error('API error fetching categories:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
