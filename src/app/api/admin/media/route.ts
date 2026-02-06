import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { db, media } from '@/db'
import { eq, desc, ilike, and, sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

// GET: List media with filtering and pagination
export async function GET(request: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''
        const type = searchParams.get('type') || 'all'
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')

        let whereClause = undefined

        const conditions = []
        if (search) {
            conditions.push(ilike(media.name, `%${search}%`))
        }
        if (type !== 'all') {
            conditions.push(eq(media.type, type))
        }

        if (conditions.length > 0) {
            whereClause = and(...conditions)
        }

        const data = await db.select()
            .from(media)
            .where(whereClause)
            .orderBy(desc(media.createdAt))
            .limit(limit)
            .offset(offset)

        const [totalCount] = await db.select({ count: sql<number>`count(*)` })
            .from(media)
            .where(whereClause)

        return NextResponse.json({
            success: true,
            data,
            pagination: {
                total: Number(totalCount.count),
                limit,
                offset
            }
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// PUT: Update media metadata (altText, name)
export async function PUT(request: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const body = await request.json()
        const { id, name, altText } = body

        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

        const [updated] = await db.update(media)
            .set({
                name,
                altText,
                updatedAt: new Date()
            })
            .where(eq(media.id, id))
            .returning()

        return NextResponse.json({ success: true, data: updated })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// DELETE: Remove media from DB and Storage
export async function DELETE(request: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

        // Get record first to know the filename
        const [record] = await db.select().from(media).where(eq(media.id, id))
        if (!record) return NextResponse.json({ error: 'Media not found' }, { status: 404 })

        // Delete from Storage
        const { error: storageError } = await supabaseAdmin
            .storage
            .from('products')
            .remove([`uploads/${record.fileName}`])

        if (storageError) {
            console.error('Storage Delete Error:', storageError)
            // If it's a 404 error (file not found), we should still proceed to delete from DB
        }

        // Delete from DB
        await db.delete(media).where(eq(media.id, id))

        return NextResponse.json({ success: true, message: 'Deleted successfully' })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
