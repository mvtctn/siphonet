import Link from 'next/link'
import { Calendar, MapPin, User, Eye, CheckCircle } from 'lucide-react'
import { mockProjects } from '@/lib/mock-data'

interface ProjectDetailProps {
    project: {
        id: string
        title: string
        slug: string
        description: string
        technicalDetails: string
        location: string
        client: string
        completionDate: string
        category: string
        images: string[]
    }
}

export function ProjectDetail({ project }: ProjectDetailProps) {
    const relatedProjects = mockProjects
        .filter((p) => p.id !== project.id && p.category === project.category)
        .slice(0, 3)

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumb */}
            <div className="bg-slate-50 border-b border-slate-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Link href="/" className="hover:text-accent">Trang chủ</Link>
                        <span>/</span>
                        <Link href="/du-an" className="hover:text-accent">Dự án</Link>
                        <span>/</span>
                        <span className="text-slate-900 font-medium">{project.title}</span>
                    </div>
                </div>
            </div>

            {/* Project Header */}
            <div className="bg-gradient-to-br from-primary via-primary-800 to-slate-900 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="inline-block px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-sm font-medium mb-4">
                        {project.category}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-4xl">
                        {project.title}
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl">
                        {project.description}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Project Image */}
                        <div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center mb-8">
                            <div className="text-center text-slate-400">
                                <Eye className="h-20 w-20 mx-auto mb-4 opacity-30" />
                                <p className="text-lg">Hình ảnh dự án</p>
                            </div>
                        </div>

                        {/* Technical Details */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                Chi tiết kỹ thuật
                            </h2>
                            <div className="prose prose-slate max-w-none">
                                <p className="text-slate-700 leading-relaxed text-lg">
                                    {project.technicalDetails}
                                </p>
                            </div>
                        </div>

                        {/* Key Features */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                Điểm nổi bật
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    'Thi công đúng tiến độ cam kết',
                                    'Đảm bảo chất lượng theo tiêu chuẩn',
                                    'Đội ngũ kỹ thuật chuyên nghiệp',
                                    'Bàn giao đầy đủ hồ sơ竣工',
                                ].map((feature, index) => (
                                    <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                                        <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                                        <span className="text-slate-700">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-50 rounded-xl p-6 sticky top-24">
                            <h3 className="font-bold text-lg text-slate-900 mb-6">
                                Thông tin dự án
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3 pb-4 border-b border-slate-200">
                                    <User className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-sm text-slate-600 mb-1">Khách hàng</div>
                                        <div className="font-medium text-slate-900">{project.client}</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 pb-4 border-b border-slate-200">
                                    <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-sm text-slate-600 mb-1">Địa điểm</div>
                                        <div className="font-medium text-slate-900">{project.location}</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 pb-4 border-b border-slate-200">
                                    <Calendar className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-sm text-slate-600 mb-1">Hoàn thành</div>
                                        <div className="font-medium text-slate-900">
                                            {new Date(project.completionDate).toLocaleDateString('vi-VN', {
                                                year: 'numeric',
                                                month: 'long',
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <Link
                                    href="/lien-he"
                                    className="block w-full text-center px-6 py-3 bg-accent hover:bg-accent-600 text-white font-medium rounded-lg transition-colors"
                                >
                                    Liên hệ tư vấn
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Projects */}
                {relatedProjects.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">
                            Dự án liên quan
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedProjects.map((relatedProject) => (
                                <Link
                                    key={relatedProject.id}
                                    href={`/du-an/${relatedProject.slug}`}
                                    className="group"
                                >
                                    <div className="aspect-[4/3] bg-slate-100 rounded-lg mb-4 flex items-center justify-center">
                                        <Eye className="h-12 w-12 text-slate-300" />
                                    </div>
                                    <div className="text-xs text-accent font-medium mb-2">
                                        {relatedProject.category}
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                                        {relatedProject.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 line-clamp-2">
                                        {relatedProject.description}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
