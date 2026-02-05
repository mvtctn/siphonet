
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { orders } from '@/db/schema'
import { desc } from 'drizzle-orm'
import { getSession } from '@/lib/auth'

export async function GET() {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt))

        return NextResponse.json({
            success: true,
            data: allOrders
        })
    } catch (error) {
        console.error('Error fetching orders:', error)
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
    }
}
