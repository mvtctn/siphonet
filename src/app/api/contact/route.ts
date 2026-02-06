import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { sendEmail, getEmailConfig } from '@/lib/email'
import {
    sanitizeText,
    sanitizeEmail,
    sanitizePhone,
    isValidEmail,
    validateLength,
    escapeHtml
} from '@/lib/inputValidation'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        let { name, email, phone, subject, message } = body

        // SECURITY: Input validation
        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Vui lòng điền các trường bắt buộc' }, { status: 400 })
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 })
        }

        // Validate input lengths
        const nameValidation = validateLength(name, 'Họ tên', 1, 100)
        if (!nameValidation.valid) {
            return NextResponse.json({ error: nameValidation.error }, { status: 400 })
        }

        const messageValidation = validateLength(message, 'Nội dung', 10, 5000)
        if (!messageValidation.valid) {
            return NextResponse.json({ error: messageValidation.error }, { status: 400 })
        }

        // SECURITY: Sanitize inputs
        name = sanitizeText(name, 100)
        email = sanitizeEmail(email)
        phone = phone ? sanitizePhone(phone) : ''
        subject = subject ? sanitizeText(subject, 200) : ''
        message = sanitizeText(message, 5000)

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
            console.error('Database error:', error)
            return NextResponse.json({ error: 'Lỗi khi lưu thông tin' }, { status: 500 })
        }

        // 2. Send notification email to admin
        const config = await getEmailConfig()
        if (config && config.receive_email) {
            // SECURITY: Escape HTML in email content
            const escapedName = escapeHtml(name)
            const escapedEmail = escapeHtml(email)
            const escapedPhone = escapeHtml(phone || 'N/A')
            const escapedSubject = escapeHtml(subject || 'N/A')
            const escapedMessage = escapeHtml(message)

            await sendEmail({
                to: config.receive_email,
                subject: `[Website] Tin nhắn mới từ ${escapedName}: ${escapedSubject}`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #0c4a6e; border-bottom: 2px solid #0c4a6e; padding-bottom: 10px;">Thông tin liên hệ mới</h2>
                        <p><strong>Họ tên:</strong> ${escapedName}</p>
                        <p><strong>Email:</strong> ${escapedEmail}</p>
                        <p><strong>Số điện thoại:</strong> ${escapedPhone}</p>
                        <p><strong>Tiêu đề:</strong> ${escapedSubject}</p>
                        <div style="background: #f8fafc; padding: 15px; border-radius: 5px; margin-top: 15px;">
                            <strong>Nội dung:</strong><br/>
                            <p style="white-space: pre-wrap;">${escapedMessage}</p>
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
        console.error('Contact form error:', error)
        return NextResponse.json({ error: 'Lỗi máy chủ nội bộ' }, { status: 500 })
    }
}
