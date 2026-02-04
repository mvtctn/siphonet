import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProjectCard } from '../projects/ProjectCard'
import { supabase } from '@/lib/supabase'

export async function FeaturedProjectsSection() {
    // Fetch featured projects from Supabase
    const { data: featuredProjectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('featured', true)
        .limit(3)

    const featuredProjects = featuredProjectsData || []

    return (
        <section className="py-20 bg-gradient-to-br from-slate-50 to-cyan-50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        Dự án tiêu biểu
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        500+ Dự án đã hoàn thành
                    </h2>
                    <p className="text-lg text-slate-600">
                        Thi công cho các công trình dân dụng và công nghiệp trên toàn quốc
                    </p>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {featuredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center">
                    <Link
                        href="/du-an"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent-600 text-white font-medium rounded-lg transition-colors"
                    >
                        Xem tất cả dự án
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
