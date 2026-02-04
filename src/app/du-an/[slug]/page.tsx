import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProjectDetail } from '@/components/projects/ProjectDetail'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    const { data: projectData } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!projectData) {
        notFound()
    }

    // Transform for component
    const project = {
        ...projectData,
        technicalDetails: projectData.technical_details,
        completionDate: projectData.completion_date
    }

    // Fetch related projects
    const { data: relatedData } = await supabase
        .from('projects')
        .select('*')
        .eq('category', projectData.category)
        .neq('id', projectData.id)
        .limit(3)

    return (
        <>
            <Header />
            <ProjectDetail project={project} relatedProjects={relatedData || []} />
            <Footer />
        </>
    )
}
