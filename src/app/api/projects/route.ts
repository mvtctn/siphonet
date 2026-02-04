import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const featured = searchParams.get('featured')

        let query = supabase
            .from('projects')
            .select('*')
            .order('completion_date', { ascending: false })

        if (category && category !== 'all') {
            query = query.eq('category', category)
        }

        if (featured === 'true') {
            query = query.eq('featured', true)
        }

        const { data, error } = await query

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Transform data if needed (e.g., parsing JSONB images)
        const transformedData = data?.map(project => ({
            ...project,
            images: Array.isArray(project.images) ? project.images : [],
            completionDate: project.completion_date
        }))

        return NextResponse.json({
            success: true,
            data: transformedData || []
        })
    } catch (error: any) {
        console.error('API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
