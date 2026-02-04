import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { host, port, user, pass, from_name, receive_email } = body

        if (!host || !user || !pass || !receive_email) {
            return NextResponse.json({ error: 'Vui lòng điền đầy đủ thông tin SMTP và Email nhận thông báo' }, { status: 400 })
        }

        const transporter = nodemailer.createTransport({
            host,
            port: port || 587,
            secure: port === 465,
            auth: {
                user,
                pass,
            },
            // Reduce timeout for testing
            connectionTimeout: 10000,
            greetingTimeout: 5000,
            socketTimeout: 10000,
        })

        // 1. Verify connection
        try {
            await transporter.verify()
        } catch (verifyError: any) {
            return NextResponse.json({
                error: `Kết nối SMTP thất bại: ${verifyError.message}`,
                success: false
            }, { status: 400 })
        }

        // 2. Send test email
        try {
            await transporter.sendMail({
                from: `"${from_name || 'Siphonet Test'}" <${user}>`,
                to: receive_email,
                subject: '[Website] Thử nghiệm cấu hình Email thành công',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #10b981; border-radius: 10px; background: #f0fdf4;">
                        <h2 style="color: #065f46; margin-top: 0;">Chúc mừng!</h2>
                        <p style="color: #065f46; font-size: 16px;">Bạn đã cấu hình thành công hệ thống Email cho website Siphonet.</p>
                        <div style="background: #ffffff; padding: 15px; border-radius: 8px; margin-top: 20px; border: 1px solid #d1fae5;">
                            <p style="margin: 0; color: #64748b; font-size: 14px;"><strong>Thông tin máy chủ:</strong> ${host}:${port}</p>
                            <p style="margin: 5px 0 0; color: #64748b; font-size: 14px;"><strong>Tài khoản gửi:</strong> ${user}</p>
                        </div>
                        <p style="font-size: 12px; color: #94a3b8; margin-top: 20px; text-align: center;">
                            Email này được gửi để kiểm tra tính năng cấu hình SMTP của Robot Admin.
                        </p>
                    </div>
                `
            })
            return NextResponse.json({ success: true, message: 'Gửi email thử nghiệm thành công!' })
        } catch (sendError: any) {
            return NextResponse.json({
                error: `Kết nối được nhưng không thể gửi mail: ${sendError.message}`,
                success: false
            }, { status: 400 })
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Lỗi máy chủ nội bộ' }, { status: 500 })
    }
}
