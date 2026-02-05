import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { db, media } from '@/db'
import sharp from 'sharp'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    // Check custom session
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        // Validate file type (allowing more than just images later if needed, but for now mostly images/videos)
        const isImage = file.type.startsWith('image/')
        const isVideo = file.type.startsWith('video/')
        const isDocument = !isImage && !isVideo

        // Create unique name
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`
        const filePath = `uploads/${fileName}`

        const buffer = Buffer.from(await file.arrayBuffer())

        // Upload to Supabase Storage
        const { data, error } = await supabaseAdmin
            .storage
            .from('products')
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: false
            })

        if (error) throw error

        // Get Public URL
        const { data: { publicUrl } } = supabaseAdmin
            .storage
            .from('products')
            .getPublicUrl(filePath)

        // Extract metadata for images
        let width = null
        let height = null
        if (isImage) {
            try {
                const metadata = await sharp(buffer).metadata()
                width = metadata.width
                height = metadata.height
            } catch (e) {
                console.error('Failed to get image dimensions:', e)
            }
        }

        // Record in database
        const [record] = await db.insert(media).values({
            name: file.name,
            fileName: fileName,
            url: publicUrl,
            type: isImage ? 'image' : isVideo ? 'video' : 'document',
            mimeType: file.type,
            size: file.size,
            width,
            height,
            altText: file.name,
        }).returning()

        return NextResponse.json({ success: true, url: publicUrl, data: record })

    } catch (error: any) {
        console.error('Upload Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
