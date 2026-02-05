'use client'

import { useState, useEffect } from 'react'
import { MenuEditor } from '@/components/admin/MenuEditor'
import { Save, Loader2, ListTree, Layout, Sidebar, FileText, ChevronRight, Plus, RefreshCcw, X } from 'lucide-react'

interface Menu {
    id: string
    name: string
    location: string
    items: any[]
    active: boolean
}

const LOCATION_ICONS: Record<string, any> = {
    header: Layout,
    side: Sidebar,
    post: FileText,
}

const LOCATION_NAMES: Record<string, string> = {
    header: 'Menu Chính (Header)',
    side: 'Menu Cạnh (Sidebar)',
    post: 'Menu Bài viết (Post Menu)',
}

export default function MenusPage() {
    const [menus, setMenus] = useState<Menu[]>([])
    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        fetchMenus()
    }, [])

    const fetchMenus = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/menus')
            const data = await res.json()
            if (data.success) {
                setMenus(data.data)
                if (data.data.length > 0 && !selectedMenu) {
                    setSelectedMenu(data.data[0])
                }
            }
        } catch (error) {
            console.error('Failed to fetch menus', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!selectedMenu) return
        setSaving(true)
        setMessage(null)
        try {
            const res = await fetch('/api/admin/menus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedMenu)
            })
            const data = await res.json()
            if (data.success) {
                setMessage({ type: 'success', text: 'Đã lưu menu thành công!' })
                fetchMenus()
            } else {
                throw new Error(data.error)
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Lỗi khi lưu menu' })
        } finally {
            setSaving(false)
        }
    }

    if (loading && menus.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
                    <p className="text-slate-500 font-medium">Đang tải danh sách menu...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-[1400px] mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-3 text-primary font-bold text-xs uppercase tracking-[0.2em] mb-3">
                        <ListTree size={16} />
                        <span>Cấu hình Hệ thống</span>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Quản lý Menu</h1>
                    <p className="text-slate-500 mt-2 font-medium">Tùy chỉnh hệ thống điều hướng trên toàn website.</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={fetchMenus}
                        className="p-4 text-slate-400 hover:text-primary transition-all bg-white border border-slate-100 rounded-2xl shadow-sm"
                    >
                        <RefreshCcw size={20} />
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || !selectedMenu}
                        className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-600 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 active:scale-[0.98]"
                    >
                        {saving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                        Lưu thay đổi
                    </button>
                </div>
            </header>

            {message && (
                <div className={`mb-8 p-6 rounded-[2rem] border animate-in slide-in-from-top flex items-center gap-4 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${message.type === 'success' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                        {message.type === 'success' ? <ChevronRight size={24} /> : <X size={24} />}
                    </div>
                    <span className="font-bold text-lg">{message.text}</span>
                </div>
            )}

            <div className="grid lg:grid-cols-12 gap-12">
                {/* Menu List Sidebar */}
                <aside className="lg:col-span-4 space-y-4">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-4 mb-4">Danh sách Menu</h2>
                    <div className="space-y-3">
                        {menus.map((menu) => {
                            const Icon = LOCATION_ICONS[menu.location] || Layout
                            const isSelected = selectedMenu?.id === menu.id

                            return (
                                <button
                                    key={menu.id}
                                    onClick={() => {
                                        setSelectedMenu(menu)
                                        setMessage(null)
                                    }}
                                    className={`w-full group flex items-center gap-4 p-5 rounded-3xl border transition-all text-left ${isSelected
                                        ? 'bg-white border-primary shadow-2xl shadow-primary/10 ring-4 ring-primary/5'
                                        : 'bg-white border-slate-100 hover:border-slate-200'
                                        }`}
                                >
                                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all ${isSelected
                                        ? 'bg-primary text-white scale-110 rotate-3'
                                        : 'bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary'
                                        }`}>
                                        <Icon size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <div className={`font-semibold transition-colors ${isSelected ? 'text-primary' : 'text-slate-900 group-hover:text-primary text-lg'}`}>
                                            {menu.name}
                                        </div>
                                        <div className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">
                                            {LOCATION_NAMES[menu.location] || menu.location}
                                        </div>
                                    </div>
                                    {isSelected && <ChevronRight className="text-primary" />}
                                </button>
                            )
                        })}
                    </div>

                    <button className="w-full flex items-center justify-center gap-3 p-6 border-2 border-dashed border-slate-100 rounded-[2.5rem] text-slate-400 hover:text-primary hover:border-primary/30 transition-all font-bold text-sm bg-slate-50/30">
                        <Plus size={20} />
                        Tạo Menu mới
                    </button>
                </aside>

                {/* Editor Section */}
                <main className="lg:col-span-8">
                    {selectedMenu ? (
                        <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm min-h-[600px]">
                            <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">{selectedMenu.name}</h2>
                                    <p className="text-slate-400 text-sm font-medium">Chỉnh sửa nội dung và trình tự các liên kết.</p>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${selectedMenu.active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                    {selectedMenu.active ? 'Hoạt động' : 'Tạm ngưng'}
                                </div>
                            </div>

                            <MenuEditor
                                initialItems={selectedMenu.items || []}
                                onChange={(newItems) => setSelectedMenu({ ...selectedMenu, items: newItems })}
                            />
                        </div>
                    ) : (
                        <div className="bg-slate-50 border-2 border-dashed border-slate-100 rounded-[3rem] h-full flex flex-col items-center justify-center p-12 text-center">
                            <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6">
                                <ListTree size={32} className="text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Chọn một Menu để bắt đầu</h3>
                            <p className="text-slate-400 max-w-xs mx-auto text-sm leading-relaxed">Vui lòng chọn một menu từ danh sách bên trái để xem và chỉnh sửa cấu trúc của nó.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
