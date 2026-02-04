import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
    Package,
    TrendingUp,
    Users,
    FileText,
    Layers,
    Plus,
    ArrowRight,
    Clock,
    Layout
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
    const session = await getSession()

    if (!session) {
        redirect('/admin/login')
    }

    // Fetch stats
    const [
        { count: productsCount },
        { count: projectsCount },
        { count: postsCount },
        { count: usersCount },
        { data: latestProjects },
        { data: latestProducts }
    ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('admin_users').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('products').select('*').order('created_at', { ascending: false }).limit(5)
    ])

    const stats = [
        { label: 'Sản phẩm', value: productsCount || 0, icon: Package, color: 'blue', href: '/admin/products' },
        { label: 'Dự án', value: projectsCount || 0, icon: Layout, color: 'emerald', href: '/admin/projects' },
        { label: 'Bài viết', value: postsCount || 0, icon: FileText, color: 'amber', href: '/admin/posts' },
        { label: 'Thành viên', value: usersCount || 0, icon: Users, color: 'indigo', href: '/admin/users' },
    ]

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Tổng quan hệ thống</h1>
                    <p className="text-slate-500 text-sm">Chào mừng trở lại, <span className="font-semibold text-slate-700">{(session as any).name}</span></p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/admin/products/new"
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <Plus size={18} /> Thêm sản phẩm
                    </Link>
                    <Link
                        href="/admin/pages/new"
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors shadow-lg shadow-primary/20"
                    >
                        <Layers size={18} /> Tạo trang mới
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <Link key={idx} href={stat.href} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow group">
                        <div>
                            <div className="text-slate-500 text-sm font-medium mb-1">{stat.label}</div>
                            <div className="text-3xl font-bold text-slate-900">
                                {stat.value}
                            </div>
                        </div>
                        <div className={`h-12 w-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <stat.icon size={24} />
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Projects */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <Layout className="text-emerald-500" size={20} /> Dự án mới nhất
                        </h3>
                        <Link href="/admin/projects" className="text-sm text-primary hover:underline flex items-center gap-1">
                            Tất cả <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {latestProjects?.map((project: any) => (
                            <div key={project.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div>
                                    <div className="font-semibold text-slate-900 line-clamp-1">{project.title}</div>
                                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                        <Clock size={12} /> {new Date(project.created_at).toLocaleDateString('vi-VN')}
                                    </div>
                                </div>
                                <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded">
                                    {project.category || 'N/A'}
                                </span>
                            </div>
                        ))}
                    </div>
                    {(!latestProjects || latestProjects.length === 0) && (
                        <div className="p-12 text-center text-slate-400">Chưa có dự án nào.</div>
                    )}
                </div>

                {/* Recent Products */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <Package className="text-blue-500" size={20} /> Sản phẩm mới
                        </h3>
                        <Link href="/admin/products" className="text-sm text-primary hover:underline flex items-center gap-1">
                            Tất cả <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {latestProducts?.map((product: any) => (
                            <div key={product.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-slate-100 rounded flex items-center justify-center">
                                        <Package size={20} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 line-clamp-1">{product.name}</div>
                                        <div className="text-xs text-slate-500">SKU: {product.sku || 'N/A'}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-slate-900">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                    </div>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${product.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        {product.status === 'published' ? 'Công khai' : 'Nháp'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {(!latestProducts || latestProducts.length === 0) && (
                        <div className="p-12 text-center text-slate-400">Chưa có sản phẩm nào.</div>
                    )}
                </div>
            </div>
        </div>
    )
}
