'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Check, Share2, Heart, Eye, Package, Shield, TruckIcon, Star, MessageSquare } from 'lucide-react'

interface ProductDetailProps {
    product: {
        id: string
        name: string
        slug: string
        description: string
        short_description?: string
        price: number
        old_price?: number
        stock: number
        sku: string
        category: string
        categoryId: string
        images: string[]
        rating?: number
        featured?: boolean
        technicalSpecifications?: any
    }
    relatedProducts: Array<{
        id: string
        name: string
        slug: string
        price: number
        images: string[]
        categoryId: string
    }>
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(product.images[0] || '')
    const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description')

    const formattedPrice = new Intl.NumberFormat('vi-VN').format(product.price)
    const formattedOldPrice = product.old_price ? new Intl.NumberFormat('vi-VN').format(product.old_price) : null

    // Ensure images array
    const images = product.images.length > 0 ? product.images : []

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
                        <span className="text-slate-400">/</span>
                        <Link href="/san-pham" className="hover:text-primary transition-colors">Sản phẩm</Link>
                        <span className="text-slate-400">/</span>
                        <span className="text-slate-900 font-medium truncate max-w-[200px] sm:max-w-md">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6 lg:p-10 mb-10">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* --- COLUMN LEFT: IMAGES --- */}
                        <div className="space-y-6">
                            {/* Main Image */}
                            <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative group">
                                {selectedImage ? (
                                    <img
                                        src={selectedImage}
                                        alt={product.name}
                                        className="w-full h-full object-contain mix-blend-multiply cursor-zoom-in transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                                        <Eye className="h-16 w-16 mb-2 opacity-20" />
                                        <span className="text-sm">Chưa có ảnh</span>
                                    </div>
                                )}
                                {product.old_price && (
                                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                        -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="grid grid-cols-5 gap-3">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(img)}
                                            className={`aspect-square rounded-xl border-2 overflow-hidden transition-all ${selectedImage === img
                                                    ? 'border-primary ring-2 ring-primary/20 ring-offset-2'
                                                    : 'border-slate-100 hover:border-slate-300 opacity-70 hover:opacity-100'
                                                }`}
                                        >
                                            <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* --- COLUMN RIGHT: INFO --- */}
                        <div className="flex flex-col">
                            <div className="mb-auto">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                                        {product.category || 'Sản phẩm'}
                                    </span>
                                    <div className="flex items-center text-yellow-400 text-sm">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                                        <span className="text-slate-400 ml-1 font-medium">(4.8)</span>
                                    </div>
                                </div>

                                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                                    {product.name}
                                </h1>

                                {/* SKU & Stock */}
                                <div className="flex items-center gap-6 text-sm text-slate-500 mb-6">
                                    <span>Mã SP: <span className="font-mono text-slate-900 font-semibold">{product.sku || 'N/A'}</span></span>
                                    <span className="w-px h-4 bg-slate-300"></span>
                                    <span className={product.stock > 0 ? "text-green-600 font-medium flex items-center gap-1.5" : "text-red-500 font-medium"}>
                                        {product.stock > 0 ? <><Check size={14} /> Còn hàng</> : 'Hết hàng'}
                                    </span>
                                </div>

                                {/* Short Description */}
                                {product.short_description && (
                                    <p className="text-slate-600 mb-8 leading-relaxed line-clamp-3">
                                        {product.short_description}
                                    </p>
                                )}

                                {/* Price Box */}
                                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
                                    <div className="flex items-end gap-3 mb-2">
                                        <span className="text-4xl font-bold text-primary">{formattedPrice}đ</span>
                                        {formattedOldPrice && (
                                            <span className="text-lg text-slate-400 line-through mb-1">{formattedOldPrice}đ</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500">Giá đã bao gồm VAT. Miễn phí vận chuyển toàn quốc cho đơn từ 2tr.</p>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                    {/* Quantity */}
                                    <div className="flex items-center border-2 border-slate-200 rounded-xl w-fit">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-slate-100 text-slate-600 font-bold transition-colors">-</button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-16 text-center border-none focus:ring-0 font-bold text-slate-900 bg-transparent"
                                        />
                                        <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 hover:bg-slate-100 text-slate-600 font-bold transition-colors">+</button>
                                    </div>

                                    {/* Buttons */}
                                    <button className="flex-1 bg-primary hover:bg-primary-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                                        <ShoppingCart size={20} />
                                        Thêm vào giỏ
                                    </button>
                                    <div className="flex gap-2">
                                        <button className="p-3 border-2 border-slate-200 rounded-xl hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-colors text-slate-400">
                                            <Heart size={24} />
                                        </button>
                                        <button className="p-3 border-2 border-slate-200 rounded-xl hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 transition-colors text-slate-400">
                                            <Share2 size={24} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                                <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><TruckIcon size={20} /></div>
                                    <div className="text-sm">
                                        <div className="font-bold text-slate-900">Giao nhanh</div>
                                        <div className="text-slate-500 text-xs">2-4 ngày làm việc</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-green-50/50 rounded-xl">
                                    <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Shield size={20} /></div>
                                    <div className="text-sm">
                                        <div className="font-bold text-slate-900">Bảo hành</div>
                                        <div className="text-slate-500 text-xs">Chính hãng 12 tháng</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- TABS SECTION --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-12">
                    <div className="flex border-b border-slate-200 bg-slate-50/50 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`px-8 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'description' ? 'border-primary text-primary bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Mô tả chi tiết
                        </button>
                        <button
                            onClick={() => setActiveTab('specs')}
                            className={`px-8 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'specs' ? 'border-primary text-primary bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Thông số kỹ thuật
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`px-8 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'reviews' ? 'border-primary text-primary bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Đánh giá (0)
                        </button>
                    </div>

                    <div className="p-8 lg:p-10 min-h-[300px]">
                        {activeTab === 'description' && (
                            <div className="prose max-w-none prose-slate prose-img:rounded-xl">
                                {product.description ? (
                                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                ) : (
                                    <p className="text-slate-500 italic text-center py-10">Đang cập nhật nội dung...</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'specs' && (
                            <div className="max-w-3xl">
                                {product.technicalSpecifications ? (
                                    <table className="w-full text-left text-sm">
                                        <tbody className="divide-y divide-slate-100">
                                            {/* Handle legacy array structure or new object structure */}
                                            {Array.isArray(product.technicalSpecifications) ? (
                                                product.technicalSpecifications.map((spec: any, idx: number) => (
                                                    <tr key={idx} className="hover:bg-slate-50">
                                                        <td className="py-3 px-4 font-medium text-slate-900 w-1/3 bg-slate-50/50">{spec.parameter}</td>
                                                        <td className="py-3 px-4 text-slate-600">{spec.value} {spec.unit}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <p>Dữ liệu thông số kỹ thuật chưa đúng định dạng.</p>
                                            )}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-slate-500 italic py-10">Chưa có thông số kỹ thuật.</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="text-center py-16">
                                <MessageSquare className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                                <h3 className="text-lg font-medium text-slate-900">Chưa có đánh giá nào</h3>
                                <p className="text-slate-500 mb-6">Hãy là người đầu tiên nhận xét về sản phẩm này</p>
                                <button className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
                                    Viết đánh giá
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- RELATED PRODUCTS --- */}
                {relatedProducts.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Package className="text-primary" /> Sản phẩm liên quan
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {relatedProducts.map((p) => (
                                <Link key={p.id} href={`/san-pham/${p.slug}`} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                                    <div className="aspect-square bg-slate-100 relative overflow-hidden">
                                        {p.images && p.images[0] ? (
                                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300"><Eye /></div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-slate-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors text-sm h-10">
                                            {p.name}
                                        </h3>
                                        <div className="font-bold text-primary">
                                            {new Intl.NumberFormat('vi-VN').format(p.price)}đ
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
