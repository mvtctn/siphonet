import Image from 'next/image'
import Link from 'next/link'
import { MapPin, User, Calendar, Eye } from 'lucide-react'

interface ProjectCardProps {
    project: {
        id: string
        title: string
        slug: string
        description: string
        location: string
        client: string
        completionDate: string
        category: string
        images: string[]
    }
}

export function ProjectCard({ project }: ProjectCardProps) {
    return (
        <div className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300">
            {/* Image */}
            <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-400">
                    <div className="text-center">
                        <Eye className="h-12 w-12 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Hình ảnh dự án</p>
                    </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-primary text-white text-sm font-medium">
                    {project.category}
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 right-4">
                        <Link
                            href={`/du-an/${project.slug}`}
                            className="block text-center px-6 py-3 bg-accent hover:bg-accent-600 text-white font-medium rounded-lg transition-colors"
                        >
                            Xem chi tiết dự án
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="font-bold text-xl text-slate-900 mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                    {project.title}
                </h3>

                <p className="text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                    {project.description}
                </p>

                {/* Meta Info */}
                <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2 text-slate-600">
                        <MapPin className="h-4 w-4 mt-0.5 text-accent flex-shrink-0" />
                        <span>{project.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                        <User className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>{project.client}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Hoàn thành: {new Date(project.completionDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
