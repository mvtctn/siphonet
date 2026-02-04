'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
    value: string[]
    onChange: (value: string[]) => void
    disabled?: boolean
}

export function ImageUpload({ value = [], onChange, disabled }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
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
            // Upload sequentially (or parallel via Promise.all)
            // Using Promise.all for speed
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
            // Filter out failures
            const successfulUrls = results.filter((url): url is string => url !== null)

            onChange([...value, ...successfulUrls])

        } catch (error) {
            console.error('Error uploading:', error)
            alert('Có lỗi xảy ra khi tải ảnh')
        } finally {
            setIsUploading(false)
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const handleRemove = (urlToRemove: string) => {
        onChange(value.filter((url) => url !== urlToRemove))
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

            <div
                onClick={() => fileInputRef.current?.click()}
                className={`
                    border-2 border-dashed border-slate-300 rounded-xl p-8 
                    flex flex-col items-center justify-center text-center gap-3
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
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                ) : (
                    <div className="bg-primary/10 p-3 rounded-full text-primary">
                        <Upload className="h-6 w-6" />
                    </div>
                )}

                <div>
                    <div className="font-medium text-slate-700">
                        {isUploading ? 'Đang tải lên...' : 'Click để tải ảnh'}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                        JPG, PNG, WebP (Max 5MB)
                    </div>
                </div>
            </div>
        </div>
    )
}
