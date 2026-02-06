import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
import { validateUploadedFile, sanitizeFileName } from '@/lib/fileValidation'
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

        // SECURITY: Comprehensive file validation
        const validationResult = await validateUploadedFile(file)
        if (!validationResult.valid) {
            return NextResponse.json({
                error: validationResult.error || 'Invalid file'
            }, { status: 400 })
        }

        // Validate file type (allowing more than just images later if needed, but for now mostly images/videos)
        const fileExt = validationResult.extension!
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExt)
        const isVideo = ['mp4', 'webm', 'mov'].includes(fileExt)
        const isDocument = ['pdf'].includes(fileExt)

        // Create unique name and folder structure
        const now = new Date()
        const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
        const randomStr = Math.random().toString(36).substring(2, 10)
        const sanitizedOriginalName = sanitizeFileName(file.name.split('.')[0])
        let fileName = `${Date.now()}-${randomStr}-${sanitizedOriginalName}.${fileExt}`

        let buffer = Buffer.from(await file.arrayBuffer())
        let finalMimeType = file.type
        let width = null
        let height = null

        // Image Optimization
        if (isImage) {
            try {
                const image = sharp(buffer)
                const metadata = await image.metadata()

                // Resize if too large (max 1920px width)
                if (metadata.width && metadata.width > 1920) {
                    image.resize(1920, null, { withoutEnlargement: true })
                }

                // Convert to WebP for better compression if not already or just compress JPEG
                if (file.type === 'image/jpeg' || file.type === 'image/png') {
                    // Decide: Keep original extension or convert to webp? 
                    // For compatibility, let's keep original ext but compress.
                    if (file.type === 'image/jpeg') {
                        image.jpeg({ quality: 80, progressive: true })
                    } else {
                        image.png({ quality: 80, palette: true })
                    }
                }

                const optimized = await image.toBuffer({ resolveWithObject: true })
                buffer = Buffer.from(optimized.data)
                width = optimized.info.width
                height = optimized.info.height
                finalMimeType = `image/${optimized.info.format}`

                // Update fileName if format changed (optional, but good for consistency)
                // fileName = fileName.split('.')[0] + '.' + optimized.info.format
            } catch (e) {
                console.error('Failed to optimize image:', e)
            }
        }

        const filePath = `uploads/${yearMonth}/${fileName}`

        // Upload to Supabase Storage
        const { data, error } = await supabaseAdmin
            .storage
            .from('products')
            .upload(filePath, buffer, {
                contentType: finalMimeType,
                upsert: false
            })

        if (error) throw error

        // Get Public URL
        const { data: { publicUrl } } = supabaseAdmin
            .storage
            .from('products')
            .getPublicUrl(filePath)

        // Record in database
        const [record] = await db.insert(media).values({
            name: file.name,
            fileName: `${yearMonth}/${fileName}`,
            url: publicUrl,
            type: isImage ? 'image' : isVideo ? 'video' : 'document',
            mimeType: finalMimeType,
            size: buffer.length,
            width,
            height,
            altText: file.name.split('.')[0],
        }).returning()

        return NextResponse.json({ success: true, url: publicUrl, data: record })

    } catch (error: any) {
        console.error('Upload Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
