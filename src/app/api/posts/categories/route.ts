
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { posts } from '@/db/schema'
import { sql } from 'drizzle-orm'

export async function GET() {
    try {
        // Fetch distinct categories from published posts
        const data = await db.select({
            category: posts.category,
            count: sql<number>`count(*)`
        })
            .from(posts)
            .where(sql`${posts.status} = 'published' AND ${posts.category} IS NOT NULL`)
            .groupBy(posts.category)

        return NextResponse.json({
            success: true,
            data
        })
    } catch (error) {
        console.error('Error fetching post categories:', error)
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
    }
}
