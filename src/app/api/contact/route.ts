import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { sendEmail, getEmailConfig } from '@/lib/email'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, phone, subject, message } = body

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Vui lòng điền các trường bắt buộc' }, { status: 400 })
        }

        // 1. Save to database - Using quote_requests table which already exists
        const { data, error } = await supabaseAdmin
            .from('quote_requests')
            .insert([{
                name,
                email,
                phone,
                product_category: subject || 'Liên hệ',
                description: message,
                status: 'new'
            }])
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // 2. Send notification email to admin
        const config = await getEmailConfig()
        if (config && config.receive_email) {
            await sendEmail({
                to: config.receive_email,
                subject: `[Website] Tin nhắn mới từ ${name}: ${subject || 'Không có tiêu đề'}`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #0c4a6e; border-bottom: 2px solid #0c4a6e; padding-bottom: 10px;">Thông tin liên hệ mới</h2>
                        <p><strong>Họ tên:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Số điện thoại:</strong> ${phone || 'N/A'}</p>
                        <p><strong>Tiêu đề:</strong> ${subject || 'N/A'}</p>
                        <div style="background: #f8fafc; padding: 15px; border-radius: 5px; margin-top: 15px;">
                            <strong>Nội dung:</strong><br/>
                            <p style="white-space: pre-wrap;">${message}</p>
                        </div>
                        <p style="font-size: 12px; color: #64748b; margin-top: 20px; text-align: center;">
                            Tin nhắn này được gửi tự động từ hệ thống quản trị Siphonet.
                        </p>
                    </div>
                `
            })
        }

        return NextResponse.json({ success: true, message: 'Gửi liên hệ thành công!', data })
    } catch (error: any) {
        return NextResponse.json({ error: 'Lỗi máy chủ nội bộ' }, { status: 500 })
    }
}
