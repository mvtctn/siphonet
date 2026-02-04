import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 1. Chỉ bảo vệ các route bắt đầu bằng /admin
    if (pathname.startsWith('/admin')) {

        // Bỏ qua trang login
        if (pathname === '/admin/login') {
            return NextResponse.next()
        }

        // Lấy token từ cookie
        const token = request.cookies.get('admin_token')?.value

        if (!token) {
            // Chưa đăng nhập -> Redirect về login
            const loginUrl = new URL('/admin/login', request.url)
            return NextResponse.redirect(loginUrl)
        }

        // Verify token (Server-side check)
        const payload = await verifyToken(token)

        if (!payload) {
            // Token không hợp lệ -> Redirect + Xóa cookie
            const loginUrl = new URL('/admin/login', request.url)
            const response = NextResponse.redirect(loginUrl)
            response.cookies.delete('admin_token')
            return response
        }

        // Token OK -> Cho phép đi tiếp
        return NextResponse.next()
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
