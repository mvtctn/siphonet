'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader2, HardDrive } from 'lucide-react'
import Image from 'next/image'
import { MediaLibrary } from './MediaLibrary'

interface ImageUploadProps {
    value: string[]
    onChange: (value: string[]) => void
    disabled?: boolean
}

export function ImageUpload({ value = [], onChange, disabled }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [isShowLibrary, setIsShowLibrary] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files)
            await uploadFiles(files)
        }
    }

    const uploadFiles = async (files: File[]) => {
        setIsUploading(true)
        const newUrls: string[] = []

        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData()
                formData.append('file', file)

                const res = await fetch('/api/admin/upload', {
                    method: 'POST',
                    body: formData
                })

                const data = await res.json()
                if (data.success) {
                    return data.url
                } else {
                    console.error('Upload failed:', data.error)
                    return null
                }
            })

            const results = await Promise.all(uploadPromises)
            const successfulUrls = results.filter((url): url is string => url !== null)

            onChange([...value, ...successfulUrls])

        } catch (error) {
            console.error('Error uploading:', error)
            alert('Có lỗi xảy ra khi tải ảnh')
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const handleRemove = (urlToRemove: string) => {
        onChange(value.filter((url) => url !== urlToRemove))
    }

    const handleSelectFromLibrary = (url: string) => {
        if (!value.includes(url)) {
            onChange([...value, url])
        }
        setIsShowLibrary(false)
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {value.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                        <div className="absolute inset-0 bg-slate-100/10">
                            <Image
                                src={url}
                                alt="Product Image"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemove(url)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        flex-1 border-2 border-dashed border-slate-300 rounded-xl p-8 
                        flex flex-col items-center justify-center text-center gap-2
                        hover:border-primary hover:bg-primary/5 transition-all cursor-pointer
                        ${disabled || isUploading ? 'opacity-50 pointer-events-none' : ''}
                    `}
                >
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                    />

                    {isUploading ? (
                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    ) : (
                        <div className="bg-primary/10 p-2 rounded-full text-primary">
                            <Upload className="h-5 w-5" />
                        </div>
                    )}

                    <div>
                        <div className="font-bold text-slate-700 text-sm">
                            {isUploading ? 'Đang tải lên...' : 'Tải ảnh mới'}
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => setIsShowLibrary(true)}
                    className="flex-1 border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-2 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
                >
                    <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                        <HardDrive className="h-5 w-5" />
                    </div>
                    <div className="font-bold text-slate-700 text-sm">Chọn từ thư viện</div>
                </div>
            </div>

            {/* Library Modal */}
            {isShowLibrary && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-[32px] w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Chọn file từ thư viện</h2>
                                <p className="text-sm text-slate-500 font-medium">Chọn một file hiện có hoặc tải lên file mới.</p>
                            </div>
                            <button
                                onClick={() => setIsShowLibrary(false)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden p-6">
                            <MediaLibrary onSelect={handleSelectFromLibrary} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
