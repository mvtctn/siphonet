import { NextResponse } from 'next/server'
import { db } from '@/db'
import { posts, categories } from '@/db/schema'
import { eq, desc, and, or } from 'drizzle-orm'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const limit = parseInt(searchParams.get('limit') || '10')
        const featured = searchParams.get('featured') === 'true'

        let conditions = [eq(posts.status, 'published')]

        let query = db.select({
            id: posts.id,
            title: posts.title,
            slug: posts.slug,
            excerpt: posts.excerpt,
            content: posts.content,
            featuredImageUrl: posts.featuredImageUrl,
            category: categories.name,
            author: posts.author,
            publishedDate: posts.publishedDate,
            createdAt: posts.createdAt,
            tags: posts.tags
        })
            .from(posts)
            .leftJoin(categories, eq(posts.categoryId, categories.id))

        if (category) {
            conditions.push(or(eq(categories.name, category), eq(categories.slug, category), eq(posts.category, category)) as any)
        }

        const data = await query
            .where(and(...conditions))
            .orderBy(desc(posts.publishedDate))
            .limit(limit)

        return NextResponse.json({
            success: true,
            data
        })
    } catch (error) {
        console.error('Error fetching public posts:', error)
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
    }
}
