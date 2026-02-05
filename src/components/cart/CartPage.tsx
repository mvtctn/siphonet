'use client'

import { useState, useEffect } from 'react'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

import { useCartStore } from '@/store/useCartStore'

export function CartPage() {
    const { items: cartItems, updateQuantity, removeItem, getSubtotal } = useCartStore()

    const subtotal = getSubtotal()
    const shipping = subtotal > 0 ? 500000 : 0
    const total = subtotal + shipping

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price)
    }

    const [isHydrated, setIsHydrated] = useState(false)

    useEffect(() => {
        setIsHydrated(true)
    }, [])

    if (!isHydrated) return null

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center py-16">
                        <ShoppingBag className="h-24 w-24 text-slate-300 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-primary mb-4">Giỏ hàng trống</h2>
                        <p className="text-slate-600 mb-8">
                            Bạn chưa có sản phẩm nào trong giỏ hàng
                        </p>
                        <Link
                            href="/san-pham"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-accent hover:bg-accent-600 text-white font-semibold rounded-lg transition-all hover:scale-105 shadow-lg shadow-accent/30"
                        >
                            Xem sản phẩm
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-primary mb-8">Giỏ hàng của bạn</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                            >
                                <div className="flex gap-6">
                                    <div className="relative w-32 h-32 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <Link
                                            href={`/san-pham/${item.slug}`}
                                            className="text-xl font-semibold text-primary hover:text-accent mb-2 block"
                                        >
                                            {item.name}
                                        </Link>
                                        <p className="text-2xl font-bold text-accent mb-4">
                                            {formatPrice(item.price)}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => updateQuantity(item.id as any, item.quantity - 1)}
                                                    className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="text-lg font-semibold w-12 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id as any, item.quantity + 1)}
                                                    className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.id as any)}
                                                className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-md sticky top-24">
                            <h2 className="text-2xl font-bold text-primary mb-6">Tổng đơn hàng</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-slate-600">
                                    <span>Tạm tính</span>
                                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Phí vận chuyển</span>
                                    <span className="font-semibold">{formatPrice(shipping)}</span>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between text-xl font-bold text-primary">
                                        <span>Tổng cộng</span>
                                        <span className="text-accent">{formatPrice(total)}</span>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href="/thanh-toan"
                                className="block w-full px-6 py-3 bg-accent hover:bg-accent-600 text-white text-center font-semibold rounded-lg transition-all hover:scale-105 shadow-lg shadow-accent/30 mb-4"
                            >
                                Tiến hành thanh toán
                            </Link>

                            <Link
                                href="/san-pham"
                                className="block text-center text-accent hover:text-accent-600 font-medium"
                            >
                                Tiếp tục mua hàng
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
