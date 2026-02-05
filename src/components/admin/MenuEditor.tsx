'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, ArrowUp, ArrowDown, Settings2, Link as LinkIcon, Move, Check, X } from 'lucide-react'

interface MenuItem {
    id: string
    label: string
    url: string
    order: number
    parentId?: string
    icon?: string
}

interface MenuEditorProps {
    initialItems: MenuItem[]
    onChange: (items: MenuItem[]) => void
}

export function MenuEditor({ initialItems = [], onChange }: MenuEditorProps) {
    const [items, setItems] = useState<MenuItem[]>(Array.isArray(initialItems) ? initialItems : [])
    const [editingItem, setEditingItem] = useState<string | null>(null)
    const [editData, setEditData] = useState<Partial<MenuItem>>({})

    useEffect(() => {
        setItems(Array.isArray(initialItems) ? initialItems : [])
    }, [initialItems])

    const handleAddItem = () => {
        const newItem: MenuItem = {
            id: crypto.randomUUID(),
            label: 'Mục mới',
            url: '#',
            order: items.length,
        }
        const newItems = [...items, newItem]
        setItems(newItems)
        onChange(newItems)
    }

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

        // Swap
        const temp = newItems[index]
        newItems[index] = newItems[targetIndex]
        newItems[targetIndex] = temp

        // Re-assign order
        const reorderedItems = newItems.map((item, idx) => ({ ...item, order: idx }))
        setItems(reorderedItems)
        onChange(reorderedItems)
    }

    const startEditing = (item: MenuItem) => {
        setEditingItem(item.id)
        setEditData({ label: item.label, url: item.url, icon: item.icon })
    }

    const saveEdit = () => {
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
        // Add a ghost image class or style if needed
    }

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        if (draggedItem === null || draggedItem === index) return

        const newItems = [...items]
        const itemToMove = newItems[draggedItem]
        newItems.splice(draggedItem, 1)
        newItems.splice(index, 0, itemToMove)

        // Update orders
        const reordered = newItems.map((item, idx) => ({ ...item, order: idx }))
        setItems(reordered)
        setDraggedItem(index)
    }

    const handleDragEnd = () => {
        setDraggedItem(null)
        onChange(items)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Cấu trúc Menu</h3>
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
                    items.map((item, index) => (
                        <div
                            key={item.id}
                            draggable={!editingItem}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`group bg-white rounded-2xl border transition-all cursor-move ${draggedItem === index ? 'opacity-40 border-primary' : 'hover:border-primary/30'} ${editingItem === item.id ? 'border-primary shadow-xl shadow-primary/5 ring-4 ring-primary/5 z-10 cursor-default' : 'border-slate-100'}`}
                        >
                            {editingItem === item.id ? (
                                <div className="p-6 space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nhãn hiển thị</label>
                                            <input
                                                type="text"
                                                value={editData.label}
                                                onChange={e => setEditData({ ...editData, label: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                                                placeholder="Ví dụ: Trang chủ"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Đường dẫn (URL)</label>
                                            <div className="relative">
                                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={editData.url}
                                                    onChange={e => setEditData({ ...editData, url: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                                                    placeholder="/trang-chu"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end gap-3 pt-2">
                                        <button
                                            onClick={() => setEditingItem(null)}
                                            className="px-4 py-2 text-slate-400 hover:text-slate-600 text-xs font-bold transition-all"
                                        >
                                            Hủy bỏ
                                        </button>
                                        <button
                                            onClick={saveEdit}
                                            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                                        >
                                            <Check size={14} />
                                            Xác nhận
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 p-4">
                                    <div className="flex items-center justify-center h-10 w-10 text-slate-300 group-hover:text-primary transition-colors">
                                        <Move size={20} />
                                    </div>

                                    <div className="flex-1">
                                        <div className="font-bold text-slate-900 group-hover:text-primary transition-colors leading-none">{item.label}</div>
                                        <div className="text-[10px] text-slate-400 truncate max-w-xs mt-1.5 font-medium">{item.url}</div>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button
                                            onClick={() => startEditing(item)}
                                            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                                        >
                                            <Settings2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
