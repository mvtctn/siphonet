import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { orders, products, projects, posts } from '@/db/schema'
import { desc, count, sql } from 'drizzle-orm'
import {
    Package,
    TrendingUp,
    Users,
    FileText,
    Layers,
    Plus,
    ArrowRight,
    Clock,
    Layout,
    ShoppingCart,
    CreditCard,
    ShoppingBag
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
    const session = await getSession()

    if (!session) {
        redirect('/admin/login')
    }

    // Fetch stats using Drizzle
    const [
        productsRes,
        projectsRes,
        postsRes,
        ordersRes,
        latestOrders,
        latestProjects,
        latestProducts
    ] = await Promise.all([
        db.select({ value: count() }).from(products),
        db.select({ value: count() }).from(projects),
        db.select({ value: count() }).from(posts),
        db.select({ value: count() }).from(orders),
        db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5),
        db.select().from(projects).orderBy(desc(projects.createdAt)).limit(5),
        db.select().from(products).orderBy(desc(products.createdAt)).limit(5)
    ])

    const stats = [
        { label: 'Đơn hàng', value: ordersRes[0].value, icon: ShoppingCart, color: 'blue', href: '/admin/orders' },
        { label: 'Sản phẩm', value: productsRes[0].value, icon: Package, color: 'emerald', href: '/admin/products' },
        { label: 'Dự án', value: projectsRes[0].value, icon: Layout, color: 'amber', href: '/admin/projects' },
        { label: 'Bài viết', value: postsRes[0].value, icon: FileText, color: 'indigo', href: '/admin/posts' },
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
                {/* Recent Orders */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <ShoppingBag className="text-blue-500" size={20} /> Đơn hàng mới nhất
                        </h3>
                        <Link href="/admin/orders" className="text-sm text-primary hover:underline flex items-center gap-1">
                            Tất cả <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {latestOrders?.map((order: any) => (
                            <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded flex items-center justify-center">
                                        <ShoppingBag size={20} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 line-clamp-1">#{order.orderCode} - {order.customerName}</div>
                                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                            <CreditCard size={12} /> {order.paymentMethod} • {new Intl.NumberFormat('vi-VN').format(Number(order.totalAmount))}đ
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${order.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                        order.status === 'processing' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                            'bg-blue-50 text-blue-600 border-blue-100'
                                        }`}>
                                        {order.status === 'new' ? 'Mới' : order.status === 'processing' ? 'Đang xử lý' : 'Xong'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {(!latestOrders || latestOrders.length === 0) && (
                        <div className="p-12 text-center text-slate-400">Chưa có đơn hàng nào.</div>
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
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.price))}
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
