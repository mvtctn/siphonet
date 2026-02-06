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
            // SECURITY: Don't log sensitive errors in production
            if (process.env.NODE_ENV !== 'production') {
                console.error('Database error during login:', error)
            }

            // SECURITY: Generic error message to prevent information disclosure
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
        // SECURITY: Don't log sensitive errors in production
        if (process.env.NODE_ENV !== 'production') {
            console.error('Login error:', error)
        }
        return NextResponse.json(
            { error: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' },
            { status: 500 }
        )
    }
}
