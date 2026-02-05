'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, Menu, ChevronDown, Zap, Droplet, Waves, X, ShoppingBag, Receipt } from 'lucide-react'
import { mockCategories } from '@/lib/mock-data'

import { useCartStore } from '@/store/useCartStore'

export function Header() {
    const { getTotalItems } = useCartStore()
    const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const categoryIcons: Record<string, any> = {
        'Zap': Zap,
        'Droplet': Droplet,
        'Waves': Waves,
    }

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                {/* Top Bar */}
                <div className="bg-primary text-white text-sm hidden lg:block">
                    <div className="container mx-auto px-4 py-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-4">
                                <a href="tel:0913381683" className="flex items-center gap-2 hover:text-accent transition-colors">
                                    <Phone className="h-4 w-4" />
                                    <span>0913 381 683</span>
                                </a>
                                <a href="mailto:siphonetjsc@gmail.com" className="flex items-center gap-2 hover:text-accent transition-colors">
                                    <Mail className="h-4 w-4" />
                                    <span>siphonetjsc@gmail.com</span>
                                </a>
                            </div>
                            <div className="text-xs">
                                Thứ 2 - Thứ 6: 8:00 - 17:30 | Thứ 7: 8:00 - 12:00
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Header */}
                <div className="container mx-auto px-4">
                    <div className="flex h-20 items-center justify-between">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/logo.png"
                                alt="Siphonet Logo"
                                width={208}
                                height={52}
                                priority
                                className="h-[52px] w-auto object-contain"
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-8">
                            <Link
                                href="/"
                                className="text-sm font-medium text-slate-700 hover:text-accent transition-colors"
                            >
                                Trang chủ
                            </Link>

                            {/* Products Mega Menu */}
                            <div
                                className="relative"
                                onMouseEnter={() => setIsProductsMenuOpen(true)}
                                onMouseLeave={() => setIsProductsMenuOpen(false)}
                            >
                                <Link
                                    href="/san-pham"
                                    className="text-sm font-medium text-slate-700 hover:text-accent transition-colors flex items-center gap-1"
                                >
                                    Sản phẩm
                                    <ChevronDown className={`h-4 w-4 transition-transform ${isProductsMenuOpen ? 'rotate-180' : ''}`} />
                                </Link>

                                {/* Dropdown Menu */}
                                <div className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 transition-all duration-300 ${isProductsMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                                    }`}>
                                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 min-w-[500px]">
                                        <div className="grid grid-cols-1 gap-2">
                                            {/* All Products Link */}
                                            <Link
                                                href="/san-pham"
                                                className="flex items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-accent/10 hover:to-accent/5 transition-all group"
                                            >
                                                <div className="p-3 bg-gradient-to-br from-accent to-accent-600 rounded-lg group-hover:scale-110 transition-transform">
                                                    <ShoppingBag className="h-5 w-5 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-slate-900 group-hover:text-accent transition-colors">
                                                        Tất cả sản phẩm
                                                    </h3>
                                                    <p className="text-xs text-slate-500">Xem toàn bộ danh mục</p>
                                                </div>
                                            </Link>

                                            {/* Category Links */}
                                            {mockCategories.map((category) => {
                                                const IconComponent = categoryIcons[category.icon || 'Zap']
                                                return (
                                                    <Link
                                                        key={category.id}
                                                        href={`/san-pham?category=${category.slug}`}
                                                        className="flex items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all group"
                                                    >
                                                        <div className="p-3 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg group-hover:scale-110 transition-transform">
                                                            <IconComponent className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                                                                {category.name}
                                                            </h3>
                                                            <p className="text-xs text-slate-500 line-clamp-1">{category.description}</p>
                                                        </div>
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href="/du-an"
                                className="text-sm font-medium text-slate-700 hover:text-accent transition-colors"
                            >
                                Dự án
                            </Link>
                            <Link
                                href="/dich-vu"
                                className="text-sm font-medium text-slate-700 hover:text-accent transition-colors"
                            >
                                Dịch vụ
                            </Link>
                            <Link
                                href="/tin-tuc"
                                className="text-sm font-medium text-slate-700 hover:text-accent transition-colors"
                            >
                                Tin tức
                            </Link>
                            <Link
                                href="/gioi-thieu"
                                className="text-sm font-medium text-slate-700 hover:text-accent transition-colors"
                            >
                                Giới thiệu
                            </Link>
                            <Link
                                href="/lien-he"
                                className="text-sm font-medium text-slate-700 hover:text-accent transition-colors"
                            >
                                Liên hệ
                            </Link>
                        </nav>

                        {/* CTA Button & Cart */}
                        <div className="hidden lg:flex items-center gap-6">
                            {/* Cart Icon */}
                            <Link href="/gio-hang" className="relative group p-2 text-slate-700 hover:text-accent transition-colors">
                                <ShoppingBag className="h-6 w-6 group-hover:scale-110 transition-transform" />
                                {mounted && (
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white shadow-lg animate-in zoom-in">
                                        {getTotalItems()}
                                    </span>
                                )}
                            </Link>

                            <Link
                                href="/bao-gia"
                                className="px-6 py-2.5 bg-accent hover:bg-accent-600 text-white text-sm font-semibold rounded-lg transition-all hover:scale-105 shadow-lg shadow-accent/30"
                            >
                                Yêu cầu báo giá
                            </Link>
                        </div>

                        {/* Mobile Actions & Menu Button */}
                        <div className="lg:hidden flex items-center gap-1 z-50">
                            {/* Mobile Cart */}
                            <Link
                                href="/gio-hang"
                                className="relative p-2 text-slate-700 hover:text-accent transition-all active:scale-95"
                                aria-label="Giỏ hàng"
                            >
                                <ShoppingBag className="h-6 w-6" />
                                {mounted && (
                                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white shadow-md animate-in zoom-in">
                                        {getTotalItems()}
                                    </span>
                                )}
                            </Link>

                            {/* Mobile Quote/Checkout */}
                            <Link
                                href="/bao-gia"
                                className="p-2 text-slate-700 hover:text-accent transition-all active:scale-95"
                                aria-label="Yêu cầu báo giá"
                            >
                                <Receipt className="h-6 w-6" />
                            </Link>

                            <button
                                className="p-2 ml-1 text-slate-700 hover:text-accent transition-all active:scale-95"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label="Menu"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Portal */}
            {mounted && isMobileMenuOpen && createPortal(
                <div className="lg:hidden fixed inset-0 z-[100] bg-white overflow-y-auto">
                    <div className="flex items-center justify-between p-4 border-b border-slate-100">
                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                            <Image
                                src="/logo.png"
                                alt="Siphonet Logo"
                                width={156}
                                height={40}
                                className="h-[40px] w-auto object-contain"
                            />
                        </Link>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <nav className="container mx-auto px-4 py-6 space-y-4">
                        <Link
                            href="/"
                            className="block py-3 text-slate-700 hover:text-accent font-medium transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Trang chủ
                        </Link>

                        {/* Mobile Products Section */}
                        <div className="border-t border-slate-100 pt-3">
                            <Link
                                href="/san-pham"
                                className="block py-3 text-slate-700 hover:text-accent font-medium transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Sản phẩm
                            </Link>
                            <div className="pl-4 space-y-2 mt-2">
                                {mockCategories.map((category) => {
                                    const IconComponent = categoryIcons[category.icon || 'Zap']
                                    return (
                                        <Link
                                            key={category.id}
                                            href={`/san-pham?category=${category.slug}`}
                                            className="flex items-center gap-3 py-2 text-sm text-slate-600 hover:text-accent transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <div className="p-1.5 bg-slate-50 rounded-md">
                                                <IconComponent className="h-4 w-4 text-slate-500" />
                                            </div>
                                            {category.name}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>

                        <Link
                            href="/du-an"
                            className="block py-3 text-slate-700 hover:text-accent font-medium transition-colors border-t border-slate-100 pt-3"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Dự án
                        </Link>
                        {/* Other links... */}
                        <Link
                            href="/dich-vu"
                            className="block py-3 text-slate-700 hover:text-accent font-medium transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Dịch vụ
                        </Link>
                        <Link
                            href="/tin-tuc"
                            className="block py-3 text-slate-700 hover:text-accent font-medium transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Tin tức
                        </Link>
                        <Link
                            href="/gioi-thieu"
                            className="block py-3 text-slate-700 hover:text-accent font-medium transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Giới thiệu
                        </Link>
                        <Link
                            href="/lien-he"
                            className="block py-3 text-slate-700 hover:text-accent font-medium transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Liên hệ
                        </Link>

                        <div className="pt-4 mt-4 border-t border-slate-100">
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href="/bao-gia"
                                    className="px-4 py-3 bg-accent text-white text-center font-medium rounded-lg hover:bg-accent-600 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Báo giá
                                </Link>
                                <a
                                    href="tel:02432001234"
                                    className="px-4 py-3 bg-slate-100 text-slate-700 text-center font-medium rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Phone className="h-4 w-4" />
                                    Gọi ngay
                                </a>
                            </div>
                        </div>
                    </nav>
                </div>,
                document.body
            )}
        </>
    )
}
