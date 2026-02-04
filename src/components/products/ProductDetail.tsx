'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Check, Share2, Heart, Eye, Package, Shield, TruckIcon } from 'lucide-react'
import { mockProducts } from '@/lib/mock-data'

interface ProductDetailProps {
    product: {
        id: string
        name: string
        slug: string
        description: string
        price: string
        stock: number
        sku: string
        category: string
        categoryId: string
        images: string[]
        technicalSpecifications?: Array<{
            parameter: string
            value: string
            unit?: string
        }>
    }
}

export function ProductDetail({ product }: ProductDetailProps) {
    const [quantity, setQuantity] = useState(1)

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumb */}
            <div className="bg-slate-50 border-b border-slate-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Link href="/" className="hover:text-accent">Trang chủ</Link>
                        <span>/</span>
                        <Link href="/san-pham" className="hover:text-accent">Sản phẩm</Link>
                        <span>/</span>
                        <span className="text-slate-900 font-medium">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-2 gap-12 mb-16">
                    {/* Product Images */}
                    <div>
                        <div className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                            <div className="text-center text-slate-400">
                                <Eye className="h-16 w-16 mx-auto mb-3 opacity-30" />
                                <p>Hình ảnh sản phẩm</p>
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        {/* Category Badge */}
                        <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                            {product.category}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            {product.name}
                        </h1>

                        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                            {product.description}
                        </p>

                        {/* Price */}
                        <div className="mb-6 p-6 bg-gradient-to-br from-slate-50 to-cyan-50 rounded-xl border border-slate-200">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-4xl font-bold text-accent">
                                    {product.price}
                                </span>
                                <span className="text-xl text-slate-600">đ</span>
                            </div>
                            <p className="text-sm text-slate-600">
                                Mã SP: <span className="font-medium">{product.sku}</span>
                            </p>
                            <p className="text-sm text-slate-600 mt-1">
                                Tình trạng: <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.stock > 0 ? `Còn hàng (${product.stock} sản phẩm)` : 'Hết hàng'}
                                </span>
                            </p>
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <label className="text-sm font-medium text-slate-700">Số lượng:</label>
                                <div className="flex items-center border border-slate-300 rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-2 hover:bg-slate-100 transition-colors"
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-16 text-center border-x border-slate-300 py-2 focus:outline-none"
                                    />
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-4 py-2 hover:bg-slate-100 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button className="flex-1 flex items-center justify-center gap-2 px-8 py-3 bg-accent hover:bg-accent-600 text-white font-medium rounded-lg transition-colors">
                                <ShoppingCart className="h-5 w-5" />
                                Thêm vào giỏ hàng
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mb-8">
                            <button className="flex items-center gap-2 px-6 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                                <Heart className="h-5 w-5" />
                                Yêu thích
                            </button>
                            <button className="flex items-center gap-2 px-6 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                                <Share2 className="h-5 w-5" />
                                Chia sẻ
                            </button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                                    <Package className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-medium text-sm text-slate-900">Giao hàng nhanh</div>
                                    <div className="text-xs text-slate-600">Toàn quốc 2-3 ngày</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-medium text-sm text-slate-900">Bảo hành chính hãng</div>
                                    <div className="text-xs text-slate-600">12-36 tháng</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                                    <Check className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-medium text-sm text-slate-900">Hàng chính hãng</div>
                                    <div className="text-xs text-slate-600">100% nhập khẩu</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technical Specifications */}
                {product.technicalSpecifications && product.technicalSpecifications.length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Thông số kỹ thuật</h2>
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <table className="w-full">
                                <tbody>
                                    {product.technicalSpecifications.map((spec, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                                            <td className="px-6 py-4 font-medium text-slate-900 w-1/3">
                                                {spec.parameter}
                                            </td>
                                            <td className="px-6 py-4 text-slate-700">
                                                {spec.value} {spec.unit}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Related Products */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Sản phẩm liên quan</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {mockProducts
                            .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
                            .slice(0, 4)
                            .map((relatedProduct) => (
                                <Link
                                    key={relatedProduct.id}
                                    href={`/san-pham/${relatedProduct.slug}`}
                                    className="group"
                                >
                                    <div className="aspect-square bg-slate-100 rounded-lg mb-3 flex items-center justify-center">
                                        <Eye className="h-12 w-12 text-slate-300" />
                                    </div>
                                    <h3 className="font-medium text-slate-900 mb-1 line-clamp-2 group-hover:text-accent transition-colors">
                                        {relatedProduct.name}
                                    </h3>
                                    <p className="text-lg font-bold text-accent">
                                        {relatedProduct.price} đ
                                    </p>
                                </Link>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
