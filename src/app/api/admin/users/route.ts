import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('admin_users')
            .select('id, email, name, role, active, last_login, created_at')
            .order('created_at', { ascending: false })

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
        const { email, password, name, role, active } = body

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const password_hash = await bcrypt.hash(password, 10)

        const { data, error } = await supabase
            .from('admin_users')
            .insert([{
                email,
                password_hash,
                name,
                role: role || 'admin',
                active: active !== undefined ? active : true
            }])
            .select('id, email, name, role, active, created_at')
            .single()

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({ error: 'Email đã tồn tại' }, { status: 400 })
            }
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, data })
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
