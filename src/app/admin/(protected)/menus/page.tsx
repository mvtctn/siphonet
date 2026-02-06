'use client'

import { useState, useEffect } from 'react'
import { MenuEditor } from '@/components/admin/MenuEditor'
import { Save, Loader2, ListTree, Layout, Sidebar, FileText, ChevronRight, Plus, RefreshCcw, X, Settings2, Check } from 'lucide-react'

interface Menu {
    id: string
    name: string
    location: string
    items: any[]
    style: 'list' | 'board' | 'mega'
    config: any
    active: boolean
}

const STYLE_OPTIONS = [
    { id: 'list', name: 'Danh sách cổ điển', description: 'Dropdown menu truyền thống', icon: ListTree },
    { id: 'board', name: 'Dạng bảng (Grid)', description: 'Hiển thị icon và tên dạng lưới', icon: Layout },
    { id: 'mega', name: 'Mega Menu', description: 'Menu lớn kèm ảnh và mô tả', icon: ListTree },
]

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
                // Update local selected state
                setSelectedMenu(data.data)
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
        <div className="p-8 max-w-[1600px] mx-auto">
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-3 text-primary font-bold text-xs uppercase tracking-[0.2em] mb-3">
                        <ListTree size={16} />
                        <span>Cấu hình Hệ thống</span>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Thiết lập Điều hướng</h1>
                    <p className="text-slate-500 mt-2 font-medium">Tùy chỉnh hệ thống menu và phong cách hiển thị trên website.</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={fetchMenus}
                        className="p-4 text-slate-400 hover:text-primary transition-all bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md"
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
                <div className={`mb-8 p-6 rounded-[2rem] border animate-in slide-in-from-top flex items-center justify-between gap-4 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                    <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${message.type === 'success' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                            {message.type === 'success' ? <ChevronRight size={20} /> : <X size={20} />}
                        </div>
                        <span className="font-bold text-lg">{message.text}</span>
                    </div>
                    <button onClick={() => setMessage(null)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>
            )}

            <div className="grid lg:grid-cols-12 gap-12">
                {/* Menu List Sidebar */}
                <aside className="lg:col-span-3 space-y-4">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-4 mb-4">Vị trí Menu</h2>
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
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${isSelected
                                        ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20'
                                        : 'bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary'
                                        }`}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className={`font-bold transition-colors ${isSelected ? 'text-primary' : 'text-slate-900 group-hover:text-primary'}`}>
                                            {menu.name}
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                            {LOCATION_NAMES[menu.location] || menu.location}
                                        </div>
                                    </div>
                                    {isSelected && <ChevronRight size={16} className="text-primary" />}
                                </button>
                            )
                        })}
                    </div>

                    <button className="w-full flex items-center justify-center gap-3 p-6 border-2 border-dashed border-slate-100 rounded-[2.5rem] text-slate-400 hover:text-primary hover:border-primary/30 transition-all font-bold text-sm bg-slate-50/30 active:scale-95">
                        <Plus size={20} />
                        Tạo Menu mới
                    </button>
                </aside>

                {/* Editor Section */}
                <main className="lg:col-span-9 space-y-8">
                    {selectedMenu ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
                            {/* General Settings */}
                            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 pb-8 border-b border-slate-50">
                                    <div className="flex items-center gap-6">
                                        <div className="h-16 w-16 bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100 text-primary">
                                            <Settings2 size={32} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900">{selectedMenu.name}</h2>
                                            <p className="text-slate-500 text-sm font-medium">Cài đặt chung và phong cách hiển thị.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <span className="text-sm font-bold text-slate-600 group-hover:text-primary transition-colors">
                                                {selectedMenu.active ? 'Đang hoạt động' : 'Tạm ngưng'}
                                            </span>
                                            <div
                                                onClick={() => setSelectedMenu({ ...selectedMenu, active: !selectedMenu.active })}
                                                className={`w-14 h-8 rounded-full relative transition-all ${selectedMenu.active ? 'bg-emerald-500' : 'bg-slate-200'}`}
                                            >
                                                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${selectedMenu.active ? 'left-7' : 'left-1'}`} />
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 block px-1">Phong cách Menu (Style)</label>
                                        <div className="grid sm:grid-cols-3 gap-6">
                                            {STYLE_OPTIONS.map((style) => {
                                                const Icon = style.icon
                                                const isStyleSelected = selectedMenu.style === style.id
                                                return (
                                                    <button
                                                        key={style.id}
                                                        onClick={() => setSelectedMenu({ ...selectedMenu, style: style.id as any })}
                                                        className={`flex flex-col items-start p-6 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group ${isStyleSelected
                                                            ? 'border-primary bg-primary/5 ring-4 ring-primary/5'
                                                            : 'border-slate-50 bg-slate-50/30 hover:border-slate-200 hover:bg-white'}`}
                                                    >
                                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-4 transition-all ${isStyleSelected ? 'bg-primary text-white scale-110' : 'bg-white text-slate-400 shadow-sm group-hover:text-primary'}`}>
                                                            <Icon size={24} />
                                                        </div>
                                                        <div className={`font-bold mb-1 transition-colors ${isStyleSelected ? 'text-primary' : 'text-slate-900'}`}>{style.name}</div>
                                                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{style.description}</p>
                                                        {isStyleSelected && (
                                                            <div className="absolute top-4 right-4 text-primary">
                                                                <Check size={20} strokeWidth={3} />
                                                            </div>
                                                        )}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Editor */}
                            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm min-h-[500px]">
                                <MenuEditor
                                    initialItems={selectedMenu.items || []}
                                    onChange={(newItems) => setSelectedMenu({ ...selectedMenu, items: newItems })}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 border-2 border-dashed border-slate-100 rounded-[3rem] h-[600px] flex flex-col items-center justify-center p-12 text-center">
                            <div className="h-24 w-24 bg-white rounded-[2rem] flex items-center justify-center shadow-sm mb-8 animate-bounce">
                                <ListTree size={40} className="text-slate-200" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Sẵn sàng thiết lập?</h3>
                            <p className="text-slate-400 max-w-sm mx-auto font-medium text-lg leading-relaxed">Chọn một vị trí menu bên trái để bắt đầu tùy chỉnh giao diện và các liên kết điều hướng.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
