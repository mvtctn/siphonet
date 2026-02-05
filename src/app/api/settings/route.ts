
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('settings')
            .select('*')

        if (error) throw error

        const settingsMap = data.reduce((acc: any, curr: any) => {
            acc[curr.key] = curr.value
            return acc
        }, {})

        // Only expose non-sensitive settings
        const publicSettings = {
            site_info: settingsMap.site_info || {},
            chat_bubble: settingsMap.chat_bubble || {
                enabled: true,
                zalo: 'https://zalo.me/0913381683',
                messenger: 'https://m.me/siphonetjsc',
                whatsapp: '84913381683'
            }
        }

        return NextResponse.json({ success: true, data: publicSettings })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
