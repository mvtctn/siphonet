import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('settings')
            .select('*')
            .eq('key', 'email_config')
            .single()

        if (error) {
            // If doesn't exist, return default structure
            return NextResponse.json({
                success: true,
                data: {
                    value: { host: '', port: 587, user: '', pass: '', from_name: 'Siphonet', receive_email: '' }
                }
            })
        }

        return NextResponse.json({ success: true, data })
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { value } = body

        const { data, error } = await supabaseAdmin
            .from('settings')
            .upsert({
                key: 'email_config',
                value,
                description: 'Cấu hình gửi nhận Email SMTP',
                updated_at: new Date().toISOString()
            })
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
