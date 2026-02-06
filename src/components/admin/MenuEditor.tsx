'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, ArrowUp, ArrowDown, Settings2, Link as LinkIcon, Move, Check, X, Image as ImageIcon, Type, AlignLeft } from 'lucide-react'
import { MediaLibrary } from './MediaLibrary'

interface MenuItem {
    id: string
    label: string
    url: string
    order: number
    parentId?: string
    icon?: string
    description?: string
    image?: string
}

interface MenuEditorProps {
    initialItems: MenuItem[]
    onChange: (items: MenuItem[]) => void
}

export function MenuEditor({ initialItems = [], onChange }: MenuEditorProps) {
    const [items, setItems] = useState<MenuItem[]>(Array.isArray(initialItems) ? initialItems : [])
    const [editingItem, setEditingItem] = useState<string | null>(null)
    const [editData, setEditData] = useState<Partial<MenuItem>>({})
    const [showMediaFor, setShowMediaFor] = useState<'image' | 'icon' | null>(null)

    useEffect(() => {
        setItems(Array.isArray(initialItems) ? initialItems : [])
    }, [initialItems])

    const handleAddItem = () => {
        const newItem: MenuItem = {
            id: crypto.randomUUID(),
            label: 'Mục mới',
            url: '#',
            order: items.length,
            description: '',
            image: ''
        }
        const newItems = [...items, newItem]
        setItems(newItems)
        onChange(newItems)
    }

    // ... (keep remove, move, startEditing as they are or slightly update startEditing)
    const handleRemoveItem = (id: string) => {
        const newItems = items.filter(item => item.id !== id)
            .map((item, index) => ({ ...item, order: index }))
        setItems(newItems)
        onChange(newItems)
    }

    const handleMove = (id: string, direction: 'up' | 'down') => {
        const index = items.findIndex(item => item.id === id)
        if (direction === 'up' && index === 0) return
        if (direction === 'down' && index === items.length - 1) return

        const newItems = [...items]
        const targetIndex = direction === 'up' ? index - 1 : index + 1

        const temp = newItems[index]
        newItems[index] = newItems[targetIndex]
        newItems[targetIndex] = temp

        const reorderedItems = newItems.map((item, idx) => ({ ...item, order: idx }))
        setItems(reorderedItems)
        onChange(reorderedItems)
    }

    const startEditing = (item: MenuItem) => {
        setEditingItem(item.id)
        setEditData({
            label: item.label,
            url: item.url,
            icon: item.icon,
            description: item.description,
            image: item.image,
            parentId: item.parentId // Ensure parentId is loaded into editData
        })
    }

    const handleUpdateItem = () => {
        if (!editingItem) return
        const newItems = items.map(item =>
            item.id === editingItem
                ? { ...item, ...editData }
                : item
        )
        setItems(newItems)
        onChange(newItems)
        setEditingItem(null)
    }

    const [draggedItem, setDraggedItem] = useState<number | null>(null)

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedItem(index)
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        if (draggedItem === null || draggedItem === index) return

        const newItems = [...items]
        const itemToMove = newItems[draggedItem]
        newItems.splice(draggedItem, 1)
        newItems.splice(index, 0, itemToMove)

        const reordered = newItems.map((item, idx) => ({ ...item, order: idx }))
        setItems(reordered)
        setDraggedItem(index)
    }

    const handleDragEnd = () => {
        setDraggedItem(null)
        onChange(items)
    }

    // Helper to get item depth
    const getItemDepth = (currentItems: MenuItem[], id: string): number => {
        let depth = 0
        let currentItem = currentItems.find(item => item.id === id)
        while (currentItem?.parentId) {
            depth++
            const nextParent = currentItems.find(item => item.id === currentItem?.parentId)
            if (!nextParent) break
            currentItem = nextParent
        }
        return depth
    }

    const handleIndent = (index: number) => {
        if (index === 0) return
        const currentItem = items[index]
        const prevItem = items[index - 1]

        // Chỉ cho phép thụt lề nếu item trước đó không phải là con của item hiện tại (tránh vòng lặp, dù phẳng thì hiếm)
        // Và giới hạn độ sâu (ví dụ max level 2 = 1 nested)
        const prevDepth = getItemDepth(items, prevItem.id)
        if (prevDepth >= 2) return // Giới hạn 3 cấp

        const newItems = [...items]
        newItems[index] = { ...currentItem, parentId: prevItem.id }
        setItems(newItems)
        onChange(newItems)
    }

    const handleOutdent = (index: number) => {
        const currentItem = items[index]
        if (!currentItem.parentId) return

        const newItems = [...items]
        const parentItem = items.find(it => it.id === currentItem.parentId)
        newItems[index] = { ...currentItem, parentId: parentItem?.parentId || undefined }
        setItems(newItems)
        onChange(newItems)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Cấu trúc Menu</h3>
                    <p className="text-[10px] text-slate-500 mt-1 italic">* Sử dụng nút thụt lề để tạo menu con (tối đa 3 cấp)</p>
                </div>
                <button
                    onClick={handleAddItem}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                    <Plus size={14} />
                    Thêm mục mới
                </button>
            </div>

            <div className="space-y-3">
                {items.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
                        <Settings2 className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm text-slate-400">Chưa có mục menu nào. Hãy thêm mục đầu tiên.</p>
                    </div>
                ) : (
                    items.map((item, index) => {
                        const depth = getItemDepth(items, item.id)
                        const isFirst = index === 0
                        const canIndent = !isFirst && depth < 2 && items[index - 1].id !== item.parentId
                        const canOutdent = !!item.parentId

                        return (
                            <div
                                key={item.id}
                                draggable={!editingItem}
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragEnd={handleDragEnd}
                                style={{ marginLeft: `${depth * 32}px` }}
                                className={`group bg-white rounded-2xl border transition-all cursor-move relative ${draggedItem === index ? 'opacity-40 border-primary' : 'hover:border-primary/30'} ${editingItem === item.id ? 'border-primary shadow-xl shadow-primary/5 ring-4 ring-primary/5 z-10 cursor-default' : 'border-slate-100'}`}
                            >
                                {depth > 0 && (
                                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-6 h-px bg-slate-200" />
                                )}

                                {editingItem === item.id ? (
                                    <div className="p-6 space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                        <Type size={12} /> Nhãn hiển thị
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={editData.label}
                                                        onChange={e => setEditData({ ...editData, label: e.target.value })}
                                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold"
                                                        placeholder="Ví dụ: Trang chủ"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                        <LinkIcon size={12} /> Đường dẫn (URL)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={editData.url}
                                                        onChange={e => setEditData({ ...editData, url: e.target.value })}
                                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                                                        placeholder="/trang-chu"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                        <AlignLeft size={12} /> Menu cha
                                                    </label>
                                                    <select
                                                        value={editData.parentId || ''}
                                                        onChange={e => setEditData({ ...editData, parentId: e.target.value || undefined })}
                                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                                                    >
                                                        <option value="">(Không có - Menu cấp 1)</option>
                                                        {items.filter(it => it.id !== editingItem).map(it => (
                                                            <option key={it.id} value={it.id}>{it.label}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                        <AlignLeft size={12} /> Mô tả ngắn (Dành cho Mega Menu)
                                                    </label>
                                                    <textarea
                                                        value={editData.description}
                                                        onChange={e => setEditData({ ...editData, description: e.target.value })}
                                                        rows={2}
                                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium resize-none shadow-inner"
                                                        placeholder="Ví dụ: Xem các sản phẩm mới nhất..."
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                        <ImageIcon size={12} /> Ảnh minh họa
                                                    </label>
                                                    <div className="flex items-center gap-3">
                                                        {editData.image ? (
                                                            <div className="relative h-12 w-12 rounded-lg border border-slate-200 overflow-hidden group/img">
                                                                <img src={editData.image} className="h-full w-full object-cover" />
                                                                <button
                                                                    onClick={() => setEditData({ ...editData, image: '' })}
                                                                    className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                                                                >
                                                                    <X size={14} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => setShowMediaFor('image')}
                                                                className="h-12 w-12 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-all bg-slate-50"
                                                            >
                                                                <Plus size={16} />
                                                            </button>
                                                        )}
                                                        <div className="flex-1">
                                                            <input
                                                                type="text"
                                                                value={editData.image}
                                                                onChange={e => setEditData({ ...editData, image: e.target.value })}
                                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-mono focus:ring-2 focus:ring-primary/10 outline-none"
                                                                placeholder="https://..."
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-50">
                                            <button
                                                onClick={() => setEditingItem(null)}
                                                className="px-4 py-2 text-slate-400 hover:text-slate-600 text-xs font-bold transition-all"
                                            >
                                                Hủy bỏ
                                            </button>
                                            <button
                                                onClick={handleUpdateItem}
                                                className="flex items-center gap-2 px-8 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                                            >
                                                <Check size={18} />
                                                Cập nhật mục menu
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4 p-4">
                                        <div className="flex items-center justify-center h-10 w-10 text-slate-300 group-hover:text-primary transition-colors">
                                            <Move size={20} />
                                        </div>

                                        <div className="flex-1 flex items-center gap-4">
                                            <div className="flex items-center gap-4 flex-1">
                                                {item.image && (
                                                    <div className="h-10 w-10 rounded-lg border border-slate-100 overflow-hidden bg-slate-50 shrink-0 shadow-sm">
                                                        <img src={item.image} className="h-full w-full object-cover" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-slate-900 group-hover:text-primary transition-colors leading-none truncate flex items-center gap-2">
                                                        {item.label}
                                                        {depth > 0 && <span className="px-1.5 py-0.5 bg-slate-100 text-[8px] text-slate-400 rounded-md uppercase tracking-tighter">Cấp {depth + 1}</span>}
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 truncate max-w-xs mt-2 font-medium flex items-center gap-1">
                                                        <LinkIcon size={10} /> {item.url}
                                                    </div>
                                                    {item.description && (
                                                        <div className="text-[10px] text-slate-500 line-clamp-1 mt-1 font-medium bg-slate-50/50 p-1 px-2 rounded inline-block">{item.description}</div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleOutdent(index)}
                                                    disabled={!canOutdent}
                                                    className={`p-2 rounded-lg transition-all ${canOutdent ? 'text-slate-400 hover:text-primary hover:bg-slate-50' : 'text-slate-200 cursor-not-allowed'}`}
                                                    title="Đưa ra ngoài"
                                                >
                                                    <ArrowUp className="-rotate-90" size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleIndent(index)}
                                                    disabled={!canIndent}
                                                    className={`p-2 rounded-lg transition-all ${canIndent ? 'text-slate-400 hover:text-primary hover:bg-slate-50' : 'text-slate-200 cursor-not-allowed'}`}
                                                    title="Thụt vào (Menu con)"
                                                >
                                                    <ArrowDown className="-rotate-90" size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                                            <button
                                                onClick={() => startEditing(item)}
                                                className="p-3 text-slate-400 hover:text-primary hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100"
                                                title="Sửa mục menu"
                                            >
                                                <Settings2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="p-3 text-slate-400 hover:text-red-500 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100"
                                                title="Xóa mục menu"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>

            {/* Media Library Modal */}
            {showMediaFor && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-[40px] w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-white/20">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Chọn tệp Media</h2>
                                <p className="text-sm text-slate-500 font-medium">Chọn một ảnh minh họa cho mục menu của bạn.</p>
                            </div>
                            <button
                                onClick={() => setShowMediaFor(null)}
                                className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                            >
                                <X size={28} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden p-8">
                            <MediaLibrary onSelect={(url) => {
                                setEditData({ ...editData, [showMediaFor]: url })
                                setShowMediaFor(null)
                            }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
