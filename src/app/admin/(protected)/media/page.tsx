'use client'

import { MediaLibrary } from '@/components/admin/MediaLibrary'
import { HardDrive } from 'lucide-react'

// Ensure this page is always dynamically rendered
export const dynamic = 'force-dynamic'

export default function MediaPage() {
    return (
        <div className="p-6 max-w-[1600px] mx-auto bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                        <HardDrive className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Thư viện Media</h1>
                        <p className="text-sm text-slate-500 font-medium">Quản lý toàn bộ hình ảnh, video và tài liệu của website.</p>
                    </div>
                </div>
            </div>

            {/* Media Library */}
            <div className="h-[calc(100vh-200px)]">
                <MediaLibrary />
            </div>
        </div>
    )
}
