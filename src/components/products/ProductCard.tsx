import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Eye } from 'lucide-react'

interface ProductCardProps {
    product: {
        id: string
        name: string
        slug: string
        description: string
        price: string
        category: string
        images: string[]
        technicalSpecifications?: Array<{
            parameter: string
            value: string
            unit?: string
        }>
    }
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
            {/* Image */}
            <div className="relative aspect-square bg-slate-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-400">
                    <div className="text-center">
                        <Eye className="h-12 w-12 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Hình ảnh sản phẩm</p>
                    </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-accent text-white text-xs font-medium">
                    {product.category}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Link
                        href={`/san-pham/${product.slug}`}
                        className="px-4 py-2 bg-white text-primary rounded-lg text-sm font-medium hover:bg-accent hover:text-white transition-colors"
                    >
                        Xem chi tiết
                    </Link>
                    <button className="p-2 bg-white text-primary rounded-lg hover:bg-accent hover:text-white transition-colors">
                        <ShoppingCart className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                    {product.name}
                </h3>

                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {product.description}
                </p>

                {/* Technical Specs Preview */}
                {product.technicalSpecifications && product.technicalSpecifications.length > 0 && (
                    <div className="mb-4 pb-4 border-b border-slate-100">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            {product.technicalSpecifications.slice(0, 2).map((spec, index) => (
                                <div key={index} className="flex items-center gap-1">
                                    <span className="text-slate-500">{spec.parameter}:</span>
                                    <span className="font-medium text-slate-700">
                                        {spec.value} {spec.unit}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Price */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-2xl font-bold text-accent">
                            {product.price} <span className="text-sm font-normal">đ</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">Liên hệ để biết giá tốt nhất</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
