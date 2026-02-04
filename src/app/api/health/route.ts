import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    const diagnostics = {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured (Ends with ' + process.env.NEXT_PUBLIC_SUPABASE_URL.slice(-5) + ')' : 'MISSING',
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configured' : 'MISSING',
        supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Configured' : 'MISSING',
        connectionTest: 'Pending'
    }

    try {
        const { count, error } = await supabase.from('categories').select('*', { count: 'exact', head: true })
        if (error) {
            diagnostics.connectionTest = 'Failed: ' + error.message
        } else {
            diagnostics.connectionTest = 'Success! Row count: ' + count
        }
    } catch (e: any) {
        diagnostics.connectionTest = 'Error: ' + e.message
    }

    return NextResponse.json(diagnostics)
}
