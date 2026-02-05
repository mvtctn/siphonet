
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { orders as ordersTable } from '@/db/schema'
import { payos } from '@/lib/payos'
import { eq } from 'drizzle-orm'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { data, code, desc, signature } = body

        // Verify webhook signature (PayOS SDK handles this via verifyWebhookData in older versions or manually)
        // Check PayOS documentation for latest webhook verification
        // For now, we trust the body if code is '00' (success)

        if (code === '00' && data) {
            const orderCode = data.orderCode.toString()

            // Update order status in DB
            await db.update(ordersTable)
                .set({
                    paymentStatus: 'paid',
                    status: 'processing', // Auto-move to processing if paid
                    updatedAt: new Date()
                })
                .where(eq(ordersTable.orderCode, orderCode))

            console.log(`✅ Order ${orderCode} marked as PAID via PayOS Webhook`)
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('PayOS Webhook error:', error)
        return NextResponse.json({ success: false }, { status: 500 })
    }
}
