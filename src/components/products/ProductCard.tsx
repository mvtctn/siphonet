'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Eye, Star, Package, TrendingUp, ImageOff } from 'lucide-react'

interface ProductCardProps {
    product: {
        id: string
        name: string
        slug: string
        description: string
        price: number
        stock?: number
        category: string
        images: string[]
        rating?: number
        featured?: boolean
        technicalSpecifications?: Array<{
            parameter: string
            value: string
            unit?: string
        }>
    }
    viewMode?: 'grid' | 'list'
}

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
    const [imgError, setImgError] = useState(false)
    const formattedPrice = new Intl.NumberFormat('vi-VN').format(product.price)
    const rating = product.rating || 0
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    if (viewMode === 'list') {
        return (
            <div className="group relative bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500">
                <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="relative md:w-80 aspect-square bg-slate-50 overflow-hidden flex-shrink-0">
                        {product.images && product.images.length > 0 && product.images[0] && !imgError ? (
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:rotate-1"
                                sizes="(max-width: 768px) 100vw, 320px"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="absolute inset-0 bg-slate-50 flex items-center justify-center text-slate-200">
                                <ImageOff className="h-12 w-12 opacity-10" />
                            </div>
                        )}

                        {product.featured && (
                            <div className="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md text-amber-600 text-[10px] font-bold uppercase tracking-widest shadow-sm border border-amber-100">
                                <Star className="h-3 w-3 inline mr-1 fill-amber-400 text-amber-400" />
                                Nổi bật
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-8 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest">
                                    {product.category}
                                </span>
                            </div>
                            <Link href={`/san-pham/${product.slug}`}>
                                <h3 className="font-bold text-xl text-slate-900 mb-4 leading-tight group-hover:text-primary transition-colors">
                                    {product.name}
                                </h3>
                            </Link>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 italic font-medium">
                                "{product.description}"
                            </p>

                            {/* Technical Specs */}
                            {product.technicalSpecifications && product.technicalSpecifications.length > 0 && (
                                <div className="grid grid-cols-2 gap-x-8 gap-y-3 pt-6 border-t border-slate-50">
                                    {product.technicalSpecifications.slice(0, 4).map((spec, index) => (
                                        <div key={index} className="flex flex-col gap-0.5">
                                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{spec.parameter}</span>
                                            <span className="text-sm font-bold text-slate-700">
                                                {spec.value} <span className="text-[10px] text-slate-400">{spec.unit}</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between mt-8">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Giá bán dự kiến</span>
                                <div className="text-2xl font-bold text-primary tracking-tighter">
                                    {formattedPrice}<span className="text-sm font-bold ml-1 uppercase">vnđ</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={`/san-pham/${product.slug}`}
                                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all active:scale-95 shadow-lg shadow-slate-900/10"
                                >
                                    Chi tiết
                                </Link>
                                <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-primary hover:text-white transition-all active:scale-95">
                                    <ShoppingCart className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Grid view (default)
    return (
        <div className="group relative bg-white rounded-[2.5rem] border border-slate-50 overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 hover:-translate-y-2">
            {/* Image Overlay Handlers */}
            <div className="relative aspect-square bg-slate-50 overflow-hidden">
                {product.images && product.images.length > 0 && product.images[0] && !imgError ? (
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-all duration-1000 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="absolute inset-0 bg-slate-50 flex items-center justify-center text-slate-200">
                        <ImageOff className="h-16 w-16 opacity-5" />
                    </div>
                )}

                {/* Badges Overlay */}
                <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                        <div className="px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md text-primary text-[9px] font-bold uppercase tracking-[0.2em] border border-white/50 shadow-sm">
                            {product.category}
                        </div>
                        {product.featured && (
                            <div className="px-4 py-1.5 rounded-full bg-amber-400 text-white text-[9px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-amber-400/30">
                                Special
                            </div>
                        )}
                    </div>
                    {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
                        <div className="px-3 py-1.5 rounded-xl bg-red-500 text-white text-[9px] font-bold uppercase tracking-widest">
                            🔥 Mua ngay
                        </div>
                    )}
                </div>

                {/* Bottom Actions Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out bg-gradient-to-t from-slate-900/40 to-transparent">
                    <div className="flex gap-2">
                        <Link
                            href={`/san-pham/${product.slug}`}
                            className="flex-1 px-4 py-3 bg-white text-slate-900 rounded-[1.25rem] text-[10px] font-bold uppercase tracking-widest text-center hover:bg-primary hover:text-white transition-all active:scale-95"
                        >
                            Xem chi tiết
                        </Link>
                        <button className="p-3 bg-white/20 backdrop-blur-md text-white rounded-[1.25rem] hover:bg-white hover:text-primary transition-all active:scale-95">
                            <ShoppingCart className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-7">
                <Link href={`/san-pham/${product.slug}`}>
                    <h3 className="font-bold text-base text-slate-900 mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors min-h-[2.5rem]">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center gap-1.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            className={`h-3 w-3 ${i < 4 ? 'fill-amber-300 text-amber-300' : 'text-slate-100'}`}
                        />
                    ))}
                    <span className="text-[10px] font-bold text-slate-400 ml-1 uppercase">Top Pick</span>
                </div>

                <div className="flex items-end justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1">Giá niêm yết</span>
                        <div className="text-xl font-bold text-slate-900 tracking-tighter">
                            {formattedPrice}<span className="text-[10px] font-bold ml-1 text-slate-400 uppercase">đ</span>
                        </div>
                    </div>
                    {product.stock !== undefined && (
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${product.stock > 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`} />
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                {product.stock > 0 ? 'Sẵn sàng' : 'Hết hàng'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
