import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization')
        // In a real app, you'd verify a secret cron token here

        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const dateStr = thirtyDaysAgo.toISOString()

        const results = await Promise.all([
            supabaseAdmin.from('products').delete().lt('deleted_at', dateStr),
            supabaseAdmin.from('posts').delete().lt('deleted_at', dateStr),
            supabaseAdmin.from('pages').delete().lt('deleted_at', dateStr)
        ])

        const errors = results.filter(r => r.error).map(r => r.error)
        if (errors.length > 0) {
            return NextResponse.json({ success: false, errors }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: '30-day trash cleanup completed',
            timestamp: new Date().toISOString()
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
