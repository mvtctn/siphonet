import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { sendEmail, getEmailConfig } from '@/lib/email'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            name,
            company,
            email,
            phone,
            productCategory,
            quantity,
            description,
            budget,
            timeline
        } = body

        if (!name || !email || !phone || !description) {
            return NextResponse.json({ error: 'Vui lòng điền đầy đủ các thông tin bắt buộc' }, { status: 400 })
        }

        // 1. Save to database
        const { data, error } = await supabaseAdmin
            .from('quote_requests')
            .insert([{
                name,
                company,
                email,
                phone,
                product_category: productCategory,
                quantity,
                description,
                budget,
                timeline,
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
                subject: `[BÁO GIÁ] Yêu cầu từ ${name} - ${productCategory || 'Sản phẩm'}`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #0891b2; border-radius: 12px; background: #fdfdfd;">
                        <div style="background: #0891b2; color: white; padding: 15px; border-radius: 8px 8px 0 0; margin: -20px -20px 20px -20px;">
                            <h2 style="margin: 0; font-size: 20px;">Yêu cầu báo giá mới</h2>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <h3 style="color: #0c4a6e; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Thông tin khách hàng</h3>
                            <p style="margin: 5px 0;"><strong>Họ tên:</strong> ${name}</p>
                            <p style="margin: 5px 0;"><strong>Công ty:</strong> ${company || 'N/A'}</p>
                            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                            <p style="margin: 5px 0;"><strong>Số điện thoại:</strong> ${phone}</p>
                        </div>

                        <div style="margin-bottom: 20px;">
                            <h3 style="color: #0c4a6e; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Chi tiết dự án</h3>
                            <p style="margin: 5px 0;"><strong>Danh mục:</strong> ${productCategory || 'N/A'}</p>
                            <p style="margin: 5px 0;"><strong>Số lượng:</strong> ${quantity || 'N/A'}</p>
                            <p style="margin: 5px 0;"><strong>Ngân sách:</strong> ${budget || 'N/A'}</p>
                            <p style="margin: 5px 0;"><strong>Thời gian:</strong> ${timeline || 'N/A'}</p>
                            <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin-top: 10px;">
                                <strong style="display: block; margin-bottom: 5px;">Mô tả yêu cầu:</strong>
                                <p style="margin: 0; white-space: pre-wrap; font-size: 14px; color: #334155;">${description}</p>
                            </div>
                        </div>

                        <div style="text-align: center; border-top: 1px solid #eee; padding-top: 20px; font-size: 11px; color: #94a3b8;">
                            Email này được gửi tự động từ hệ thống Siphonet CMS.
                        </div>
                    </div>
                `
            })
        }

        return NextResponse.json({ success: true, message: 'Yêu cầu báo giá đã được gửi!', data })
    } catch (error: any) {
        return NextResponse.json({ error: 'Lỗi máy chủ nội bộ' }, { status: 500 })
    }
}
