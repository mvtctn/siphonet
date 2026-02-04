'use client'

import { useState, useEffect } from 'react'
import { ProjectCard } from '@/components/projects/ProjectCard'

export function ProjectsPage() {
    const [projects, setProjects] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState<string>('all')

    const categories = [
        { id: 'all', name: 'Tất cả dự án' },
        { id: 'Cơ điện', name: 'Cơ điện M&E' },
        { id: 'Cấp nước', name: 'Cấp nước' },
        { id: 'Xử lý nước thải', name: 'Xử lý nước thải' },
    ]

    useEffect(() => {
        const fetchProjects = async () => {
            setIsLoading(true)
            try {
                const url = selectedCategory === 'all'
                    ? '/api/projects'
                    : `/api/projects?category=${encodeURIComponent(selectedCategory)}`
                const response = await fetch(url)
                const result = await response.json()
                if (result.success) {
                    setProjects(result.data)
                }
            } catch (error) {
                console.error('Failed to fetch projects', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProjects()
    }, [selectedCategory])

    return (
        <div className="min-h-screen bg-white">
            {/* Page Header */}
            <div className="relative bg-gradient-to-br from-primary via-primary-800 to-slate-900 text-white py-20">
                <div className="container mx-auto px-4 relative">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Dự án tiêu biểu
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl">
                        500+ công trình dân dụng và công nghiệp đã hoàn thành trên toàn quốc
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-accent mb-1">500+</div>
                            <div className="text-sm text-slate-300">Dự án hoàn thành</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-accent mb-1">100+</div>
                            <div className="text-sm text-slate-300">Khách hàng tin tưởng</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-accent mb-1">15+</div>
                            <div className="text-sm text-slate-300">Năm kinh nghiệm</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-accent mb-1">100%</div>
                            <div className="text-sm text-slate-300">Hài lòng</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${selectedCategory === category.id
                                ? 'bg-accent text-white shadow-lg'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Results count */}
                <div className="mb-6">
                    <p className="text-slate-600">
                        Hiển thị <span className="font-semibold">{projects.length}</span> dự án
                    </p>
                </div>

                {/* Projects Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-80 bg-slate-100 animate-pulse rounded-xl"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project: any) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
