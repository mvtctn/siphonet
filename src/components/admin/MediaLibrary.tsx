'use client'

import { useState, useEffect, useRef } from 'react'
import {
    Upload, Search, X, Image as ImageIcon,
    Loader2, Trash2, Edit, ExternalLink,
    Check, Filter, Grid, List as ListIcon,
    Copy, Info, HardDrive, FileText, FileVideo, File
} from 'lucide-react'
import Image from 'next/image'

interface MediaItem {
    id: string
    name: string
    url: string
    type: 'image' | 'video' | 'document'
    mimeType: string
    size: number
    width: number | null
    height: number | null
    altText: string | null
    createdAt: string
}

interface MediaLibraryProps {
    onSelect?: (url: string) => void
    multiSelect?: boolean
    selectedUrls?: string[]
}

export function MediaLibrary({ onSelect, multiSelect = false, selectedUrls = [] }: MediaLibraryProps) {
    const [media, setMedia] = useState<MediaItem[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video' | 'document'>('all')
    const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const fetchMedia = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (search) params.append('search', search)
            if (typeFilter !== 'all') params.append('type', typeFilter)

            const res = await fetch(`/api/admin/media?${params.toString()}`)
            const data = await res.json()
            if (data.success) {
                setMedia(data.data)
            }
        } catch (error) {
            console.error('Error fetching media:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchMedia()
        }, 300)
        return () => clearTimeout(timer)
    }, [search, typeFilter])

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const files = Array.from(e.target.files)
        setIsUploading(true)

        try {
            for (const file of files) {
                const formData = new FormData()
                formData.append('file', file)
                const res = await fetch('/api/admin/upload', {
                    method: 'POST',
                    body: formData
                })
                const data = await res.json()
                if (data.success) {
                    // Refresh after each upload or at end
                }
            }
            fetchMedia()
        } catch (error) {
            alert('Upload failed')
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Xóa file này vĩnh viễn?')) return
        try {
            const res = await fetch(`/api/admin/media?id=${id}`, { method: 'DELETE' })
            const data = await res.json()
            if (data.success) {
                setMedia(media.filter(m => m.id !== id))
                if (selectedItem?.id === id) setSelectedItem(null)
            }
        } catch (error) {
            alert('Lỗi khi xóa')
        }
    }

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        alert('Đã sao chép URL!')
    }

    return (
        <div className="flex h-full bg-white rounded-2xl border border-slate-200 overflow-hidden min-h-[600px]">
            {/* Main Gallery Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
                    <div className="flex items-center gap-2 flex-1 min-w-[300px]">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm tên file..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium"
                            />
                        </div>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as any)}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                        >
                            <option value="all">Tất cả định dạng</option>
                            <option value="image">Hình ảnh</option>
                            <option value="video">Video</option>
                            <option value="document">Tài liệu</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-700 transition-all shadow-md shadow-primary/20 font-bold disabled:opacity-50"
                        >
                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                            Tải lên
                        </button>
                        <input
                            type="file"
                            multiple
                            ref={fileInputRef}
                            onChange={handleUpload}
                            className="hidden"
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            <p className="font-bold uppercase tracking-widest text-xs">Đang tải thư viện...</p>
                        </div>
                    ) : media.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                            <ImageIcon size={64} className="opacity-20" />
                            <p className="font-medium">Chưa có file nào trong thư viện.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                            {media.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedItem(item)}
                                    className={`
                                        relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all group
                                        ${selectedItem?.id === item.id ? 'border-primary ring-4 ring-primary/10' : 'border-slate-100 hover:border-primary/50'}
                                    `}
                                >
                                    {item.type === 'image' ? (
                                        <Image
                                            src={item.url}
                                            alt={item.altText || item.name}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 gap-2">
                                            {item.type === 'video' ? <FileVideo size={48} /> : <FileText size={48} />}
                                            <span className="text-[10px] font-bold uppercase tracking-wider">{item.mimeType.split('/')[1]}</span>
                                        </div>
                                    )}

                                    {selectedItem?.id === item.id && (
                                        <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1 shadow-lg">
                                            <Check size={12} strokeWidth={4} />
                                        </div>
                                    )}

                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white text-[10px] font-bold truncate">{item.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar Details */}
            {selectedItem && (
                <div className="w-80 border-l border-slate-100 bg-slate-50/50 flex flex-col animate-in slide-in-from-right duration-300">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <Info size={16} className="text-primary" />
                            Chi tiết file
                        </h3>
                        <button onClick={() => setSelectedItem(null)} className="text-slate-400 hover:text-red-500 transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* Preview */}
                        <div className="aspect-video relative rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                            {selectedItem.type === 'image' ? (
                                <Image src={selectedItem.url} alt="" fill className="object-contain" />
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-300">
                                    <File size={48} />
                                </div>
                            )}
                        </div>

                        {/* Metadata */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Tên file</label>
                                <p className="text-sm font-bold text-slate-900 break-all bg-white p-2 rounded-lg border border-slate-100 shadow-sm">{selectedItem.name}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Định dạng</label>
                                    <p className="text-xs font-medium text-slate-600 bg-white p-2 rounded-lg border border-slate-100">{selectedItem.mimeType}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Dung lượng</label>
                                    <p className="text-xs font-medium text-slate-600 bg-white p-2 rounded-lg border border-slate-100">{formatSize(selectedItem.size)}</p>
                                </div>
                            </div>

                            {selectedItem.width && (
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Kích thước</label>
                                    <p className="text-xs font-medium text-slate-600 bg-white p-2 rounded-lg border border-slate-100">{selectedItem.width} x {selectedItem.height} px</p>
                                </div>
                            )}

                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Ngày tải lên</label>
                                <p className="text-xs font-medium text-slate-600 bg-white p-2 rounded-lg border border-slate-100">{new Date(selectedItem.createdAt).toLocaleString('vi-VN')}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 space-y-2">
                            <button
                                onClick={() => copyToClipboard(selectedItem.url)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
                            >
                                <Copy size={16} />
                                Sao chép URL
                            </button>
                            <a
                                href={selectedItem.url}
                                target="_blank"
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
                            >
                                <ExternalLink size={16} />
                                Xem file gốc
                            </a>
                            <button
                                onClick={() => handleDelete(selectedItem.id)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-all"
                            >
                                <Trash2 size={16} />
                                Xóa vĩnh viễn
                            </button>
                        </div>

                        {onSelect && (
                            <div className="pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => onSelect(selectedItem.url)}
                                    className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-700 transition-all shadow-lg shadow-primary/20"
                                >
                                    Chọn file này
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
