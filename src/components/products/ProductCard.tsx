import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Eye, Star, Package, TrendingUp } from 'lucide-react'

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
    const formattedPrice = new Intl.NumberFormat('vi-VN').format(product.price)
    const rating = product.rating || 0
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    if (viewMode === 'list') {
        return (
            <div className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="relative md:w-64 aspect-square md:aspect-auto bg-slate-100 overflow-hidden flex-shrink-0">
                        {product.images && product.images.length > 0 && product.images[0] ? (
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, 256px"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-400">
                                <div className="text-center">
                                    <Eye className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm">Hình ảnh</p>
                                </div>
                            </div>
                        )}

                        {product.featured && (
                            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-lg">
                                <TrendingUp className="h-3 w-3 inline mr-1" />
                                Nổi bật
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                                <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-2">
                                    {product.category}
                                </div>
                                <Link href={`/san-pham/${product.slug}`}>
                                    <h3 className="font-bold text-xl text-slate-900 mb-2 group-hover:text-accent transition-colors">
                                        {product.name}
                                    </h3>
                                </Link>
                            </div>
                        </div>

                        {/* Rating */}
                        {rating > 0 && (
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex items-center gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < fullStars ? 'fill-yellow-400 text-yellow-400' : i === fullStars && hasHalfStar ? 'fill-yellow-400/50 text-yellow-400' : 'text-slate-300'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-slate-600">({rating.toFixed(1)})</span>
                            </div>
                        )}

                        <p className="text-slate-600 mb-4 line-clamp-2">
                            {product.description}
                        </p>

                        {/* Technical Specs */}
                        {product.technicalSpecifications && product.technicalSpecifications.length > 0 && (
                            <div className="mb-4 grid grid-cols-2 gap-3">
                                {product.technicalSpecifications.slice(0, 4).map((spec, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm">
                                        <span className="text-slate-500">{spec.parameter}:</span>
                                        <span className="font-semibold text-slate-700">
                                            {spec.value}{spec.unit}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <div>
                                <div className="text-3xl font-bold text-accent">
                                    {formattedPrice}<span className="text-base font-normal ml-1">đ</span>
                                </div>
                                {product.stock !== undefined && (
                                    <div className="flex items-center gap-1 mt-1 text-sm text-slate-500">
                                        <Package className="h-4 w-4" />
                                        {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={`/san-pham/${product.slug}`}
                                    className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
                                >
                                    Xem chi tiết
                                </Link>
                                <button className="p-3 bg-accent/10 text-accent rounded-xl hover:bg-accent hover:text-white transition-colors">
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
        <div className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:border-accent/30 transition-all duration-300 hover:-translate-y-1">
            {/* Image */}
            {/* Image */}
            <div className="relative aspect-square bg-slate-100 overflow-hidden">
                {product.images && product.images.length > 0 && product.images[0] ? (
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-400">
                        <div className="text-center">
                            <Eye className="h-12 w-12 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">Hình ảnh sản phẩm</p>
                        </div>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <div className="px-3 py-1.5 rounded-full bg-accent text-white text-xs font-medium shadow-lg backdrop-blur-sm">
                        {product.category}
                    </div>
                    {product.featured && (
                        <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-lg">
                            <TrendingUp className="h-3 w-3 inline mr-1" />
                            Nổi bật
                        </div>
                    )}
                </div>

                {/* Stock badge */}
                {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs font-bold shadow-lg">
                        Chỉ còn {product.stock}
                    </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6 gap-2">
                    <Link
                        href={`/san-pham/${product.slug}`}
                        className="px-5 py-2.5 bg-white text-primary rounded-xl text-sm font-bold hover:bg-accent hover:text-white transition-all shadow-xl transform hover:scale-105"
                    >
                        Xem chi tiết
                    </Link>
                    <button className="p-2.5 bg-white text-primary rounded-xl hover:bg-accent hover:text-white transition-all shadow-xl transform hover:scale-105">
                        <ShoppingCart className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Rating */}
                {rating > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < fullStars ? 'fill-yellow-400 text-yellow-400' : i === fullStars && hasHalfStar ? 'fill-yellow-400/50 text-yellow-400' : 'text-slate-300'}`}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-semibold text-slate-700">({rating.toFixed(1)})</span>
                    </div>
                )}

                <Link href={`/san-pham/${product.slug}`}>
                    <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-accent transition-colors min-h-[3.5rem]">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {product.description}
                </p>

                {/* Technical Specs Preview */}
                {product.technicalSpecifications && product.technicalSpecifications.length > 0 && (
                    <div className="mb-4 pb-4 border-b border-slate-100">
                        <div className="space-y-1.5 text-xs">
                            {product.technicalSpecifications.slice(0, 2).map((spec, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-slate-500">{spec.parameter}</span>
                                    <span className="font-semibold text-slate-700">
                                        {spec.value}{spec.unit}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Price & Stock */}
                <div className="flex items-end justify-between">
                    <div className="flex-1">
                        <div className="text-2xl font-bold text-accent leading-none">
                            {formattedPrice}<span className="text-sm font-normal ml-1">đ</span>
                        </div>
                        {product.stock !== undefined && (
                            <div className="flex items-center gap-1 mt-2 text-xs">
                                <Package className={`h-3.5 w-3.5 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`} />
                                <span className={product.stock > 0 ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>
                                    {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
