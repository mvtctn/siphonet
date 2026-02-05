
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { orders as ordersTable } from '@/db/schema'
import { payos } from '@/lib/payos'
import { eq } from 'drizzle-orm'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        console.log('Checkout request:', body)
        const { customer, items, paymentMethod } = body

        if (!customer || !items || items.length === 0) {
            return NextResponse.json({ success: false, message: 'Missing required data' }, { status: 400 })
        }

        // Calculate total
        const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
        const shipping = 500000 // Fixed shipping for now
        const totalAmount = subtotal + shipping

        // Generate order code (numeric for PayOS)
        const orderCode = Number(String(Date.now()).slice(-6)) + Math.floor(Math.random() * 1000)

        // Insert order into DB
        const [newOrder] = await db.insert(ordersTable).values({
            orderCode: orderCode.toString(),
            customerName: customer.name,
            customerPhone: customer.phone,
            customerEmail: customer.email,
            customerCompany: customer.company || '',
            deliveryAddress: customer.address,
            items: items.map((i: any) => ({
                productId: i.id,
                productName: i.name,
                quantity: i.quantity,
                price: i.price
            })),
            totalAmount: totalAmount.toString(),
            paymentMethod: paymentMethod,
            paymentStatus: 'pending',
            status: 'new'
        }).returning()

        let paymentLink = null

        if (paymentMethod === 'PayOS') {
            try {
                const domain = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

                const body = {
                    orderCode: orderCode,
                    amount: totalAmount,
                    description: `Siphonet Order ${orderCode}`,
                    items: items.map((i: any) => ({
                        name: i.name,
                        quantity: i.quantity,
                        price: i.price
                    })),
                    returnUrl: `${domain}/thanh-toan/thanh-cong`,
                    cancelUrl: `${domain}/thanh-toan/that-bai`
                }

                const response = await payos.createPaymentLink(body)
                paymentLink = response.checkoutUrl

                // Update order with payos order id
                await db.update(ordersTable)
                    .set({ payosOrderId: response.paymentLinkId })
                    .where(eq(ordersTable.id, newOrder.id))

            } catch (error) {
                console.error('PayOS error:', error)
                // We still created the order, but payment link failed.
                // In production, we might want to handle this better.
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                orderId: newOrder.id,
                orderCode: newOrder.orderCode,
                paymentLink
            }
        })

    } catch (error: any) {
        console.error('Checkout error:', error)
        return NextResponse.json({
            success: false,
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 })
    }
}

