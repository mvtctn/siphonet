
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { orders } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth'

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const body = await request.json()

        const updatedOrder = await db.update(orders)
            .set({
                ...body,
                updatedAt: new Date()
            })
            .where(eq(orders.id, id))
            .returning()

        if (!updatedOrder.length) {
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            data: updatedOrder[0]
        })
    } catch (error) {
        console.error('Error updating order:', error)
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const order = await db.select().from(orders).where(eq(orders.id, id)).limit(1)

        if (!order.length) {
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            data: order[0]
        })
    } catch (error) {
        console.error('Error fetching order:', error)
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
    }
}
