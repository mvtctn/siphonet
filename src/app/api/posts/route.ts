
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { posts } from '@/db/schema'
import { eq, desc, and } from 'drizzle-orm'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const limit = parseInt(searchParams.get('limit') || '10')
        const featured = searchParams.get('featured') === 'true'

        let conditions = [eq(posts.status, 'published')]

        if (category) {
            conditions.push(eq(posts.category, category))
        }

        const query = db.select()
            .from(posts)
            .where(and(...conditions))
            .orderBy(desc(posts.publishedDate))
            .limit(limit)

        const data = await query

        return NextResponse.json({
            success: true,
            data
        })
    } catch (error) {
        console.error('Error fetching public posts:', error)
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
    }
}
