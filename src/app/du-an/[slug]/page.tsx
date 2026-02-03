import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProjectDetail } from '@/components/projects/ProjectDetail'
import { mockProjects } from '@/lib/mock-data'
import { notFound } from 'next/navigation'

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const project = mockProjects.find((p) => p.slug === slug)

    if (!project) {
        notFound()
    }

    return (
        <>
            <Header />
            <ProjectDetail project={project} />
            <Footer />
        </>
    )
}
