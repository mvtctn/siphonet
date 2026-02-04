import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { minionLogout, getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { LogOut, User } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // Verify session
    const session = await getSession()
    if (!session) {
        redirect('/admin/login')
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm/50">
                    <div className="md:hidden font-bold text-slate-800">Siphonet Admin</div>
                    <div className="flex-1"></div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-semibold text-slate-800">{session.name as string}</div>
                                <div className="text-xs text-slate-500 font-mono">Admin</div>
                            </div>
                            <div className="h-9 w-9 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                                <User className="h-5 w-5 text-slate-500" />
                            </div>
                        </div>

                        <div className="h-6 w-px bg-slate-200 mx-2"></div>

                        <form action={async () => {
                            'use server'
                            await minionLogout()
                            redirect('/admin/login')
                        }}>
                            <button
                                type="submit"
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Đăng xuất"
                            >
                                <LogOut size={20} />
                            </button>
                        </form>
                    </div>
                </header>

                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
