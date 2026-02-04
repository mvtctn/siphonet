import { supabaseAdmin } from '@/lib/supabase'
import { minionLogin } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email và mật khẩu là bắt buộc' },
                { status: 400 }
            )
        }

        // 1. Fetch user from DB
        const { data: user, error } = await supabaseAdmin
            .from('admin_users')
            .select('*')
            .eq('email', email)
            .single()

        if (error) {
            console.error('Database error during login:', error)
            // Identify connection issues specifically
            if (error.message.includes('fetch failed') || error.code === 'PGRST102') {
                return NextResponse.json(
                    { error: 'Không thể kết nối tới cơ sở dữ liệu. Vui lòng kiểm tra cấu hình môi trường.' },
                    { status: 500 }
                )
            }

            return NextResponse.json(
                { error: 'Email hoặc mật khẩu không đúng' },
                { status: 401 }
            )
        }

        if (!user) {
            return NextResponse.json(
                { error: 'Email hoặc mật khẩu không đúng' },
                { status: 401 }
            )
        }

        // 2. Verify password
        const isValid = await bcrypt.compare(password, user.password_hash)

        if (!isValid) {
            return NextResponse.json(
                { error: 'Email hoặc mật khẩu không đúng' },
                { status: 401 }
            )
        }

        // 3. Create session/token
        await minionLogin({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        })

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        })

    } catch (error: any) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Đã xảy ra lỗi server' },
            { status: 500 }
        )
    }
}
