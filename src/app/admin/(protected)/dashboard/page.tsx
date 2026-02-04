import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Package, TrendingUp, Users } from 'lucide-react'

export default async function AdminDashboard() {
    const session = await getSession()

    if (!session) {
        redirect('/admin/login')
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <div className="text-slate-500 text-sm font-medium mb-1">Tổng sản phẩm</div>
                        <div className="text-3xl font-bold text-slate-900">124</div>
                    </div>
                    <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <Package size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <div className="text-slate-500 text-sm font-medium mb-1">Đơn hàng mới</div>
                        <div className="text-3xl font-bold text-slate-900">12</div>
                    </div>
                    <div className="h-12 w-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                        <TrendingUp size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <div className="text-slate-500 text-sm font-medium mb-1">Doanh thu tháng</div>
                        <div className="text-3xl font-bold text-slate-900">45.2M</div>
                    </div>
                    <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                        <Users size={24} />
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 min-h-[400px] flex flex-col items-center justify-center text-center">
                <div className="bg-slate-50 p-6 rounded-full mb-4">
                    <Package size={48} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Chào mừng trở lại, {session.name}!</h3>
                <p className="text-slate-500 max-w-sm">
                    Hệ thống quản trị đã sẵn sàng. Hãy bắt đầu quản lý sản phẩm, bài viết hoặc cấu hình website.
                </p>
            </div>
        </div>
    )
}
