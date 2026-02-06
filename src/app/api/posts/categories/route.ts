import { NextResponse } from 'next/server'
import { db } from '@/db'
import { posts, categories } from '@/db/schema'
import { sql, eq, and } from 'drizzle-orm'

export async function GET() {
    try {
        // Fetch all post-type categories and count their published posts
        const data = await db.select({
            category: categories.name,
            count: sql<number>`count(${posts.id})`
        })
            .from(categories)
            .leftJoin(posts, and(eq(posts.categoryId, categories.id), eq(posts.status, 'published')))
            .where(eq(categories.type, 'post'))
            .groupBy(categories.id, categories.name)
            .orderBy(categories.name)

        return NextResponse.json({
            success: true,
            data
        })
    } catch (error) {
        console.error('Error fetching post categories:', error)
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
    }
}
