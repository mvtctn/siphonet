'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, Menu, ChevronDown, ChevronRight, Zap, Droplet, Waves, X, ShoppingBag, Receipt } from 'lucide-react'
import { mockCategories } from '@/lib/mock-data'

import { useCartStore } from '@/store/useCartStore'
import { useSettings } from '@/components/providers/SettingsProvider'

export function Header() {
    const { getTotalItems } = useCartStore()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const settings = useSettings()
    const siteInfo = settings?.site_info

    const siteTitle = siteInfo?.title || 'SIPHONET'
    const logoUrl = siteInfo?.logo_url || '/logo.png'

    const [headerMenu, setHeaderMenu] = useState<any>(null)
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)

    const categoryIcons: Record<string, any> = {
        'Zap': Zap,
        'Droplet': Droplet,
        'Waves': Waves,
    }

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        fetch('/api/admin/menus?location=header')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data.length > 0 && Array.isArray(data.data[0].items) && data.data[0].items.length > 0) {
                    setHeaderMenu(data.data[0])
                } else {
                    // Fallback to default structure if no menu or empty items in DB
                    setHeaderMenu({
                        style: 'list',
                        items: [
                            { id: '1', label: 'Trang chủ', url: '/', order: 0 },
                            { id: '2', label: 'Sản phẩm', url: '/san-pham', order: 1 },
                            { id: '3', label: 'Dự án', url: '/du-an', order: 2 },
                            { id: '4', label: 'Dịch vụ', url: '/dich-vu', order: 3 },
                            { id: '5', label: 'Tin tức', url: '/tin-tuc', order: 4 },
                            { id: '6', label: 'Giới thiệu', url: '/gioi-thieu', order: 5 },
                            { id: '7', label: 'Liên hệ', url: '/lien-he', order: 6 },
                        ]
                    })
                }
            })
            .catch(() => {
                // Silently fallback or handle error
            })
    }, [])

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                {/* Top Bar - Brand Gradient */}
                <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary text-white text-sm hidden lg:block border-b border-white/5">
                    <div className="container mx-auto px-4 py-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-4">
                                <a href={`tel:${siteInfo?.phone || '0913381683'}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                                    <Phone className="h-4 w-4" />
                                    <span>{siteInfo?.phone || '0913 381 683'}</span>
                                </a>
                                <a href={`mailto:${siteInfo?.email || 'siphonetjsc@gmail.com'}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                                    <Mail className="h-4 w-4" />
                                    <span>{siteInfo?.email || 'siphonetjsc@gmail.com'}</span>
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
                                src={logoUrl}
                                alt={`${siteTitle} Logo`}
                                width={208}
                                height={52}
                                priority
                                className="h-[52px] w-auto object-contain"
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-8">
                            {(() => {
                                if (!Array.isArray(headerMenu?.items)) return null

                                const buildTree = (items: any[]) => {
                                    const map = new Map()
                                    const tree: any[] = []
                                    items.forEach(item => map.set(item.id, { ...item, children: [] }))
                                    items.forEach(item => {
                                        const node = map.get(item.id)
                                        if (item.parentId && map.has(item.parentId)) {
                                            map.get(item.parentId).children.push(node)
                                        } else {
                                            tree.push(node)
                                        }
                                    })
                                    return tree.sort((a, b) => a.order - b.order)
                                }

                                const menuTree = buildTree(headerMenu.items)

                                const renderDropdown = (node: any, isSub = false) => {
                                    const hasSubItems = node.children && node.children.length > 0
                                    return (
                                        <div
                                            key={node.id}
                                            className={`relative ${isSub ? 'group/sub' : 'group/menu'}`}
                                            onMouseEnter={() => setHoveredItem(node.id)}
                                            onMouseLeave={() => setHoveredItem(null)}
                                        >
                                            <Link
                                                href={node.url}
                                                className={`${isSub
                                                    ? 'flex items-center justify-between px-5 py-3 text-sm font-medium text-slate-700 hover:text-accent hover:bg-slate-50 transition-colors'
                                                    : 'text-sm font-bold text-slate-800 hover:text-accent transition-all flex items-center gap-1 relative group'}`}
                                            >
                                                {node.label}
                                                {!isSub && hasSubItems && <ChevronDown size={14} className={`transition-transform ${hoveredItem === node.id ? 'rotate-180' : ''}`} />}
                                                {isSub && hasSubItems && <ChevronRight size={14} />}
                                                {!isSub && <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />}
                                            </Link>

                                            {hasSubItems && (
                                                <div className={`absolute ${isSub ? 'left-full top-0 ml-1' : 'left-0 top-full pt-2'} transition-all duration-300 ${hoveredItem === node.id ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                                                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 min-w-[220px] py-3 overflow-hidden">
                                                        {node.children.sort((a: any, b: any) => a.order - b.order).map((child: any) => renderDropdown(child, true))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                }

                                return menuTree.map((item: any) => {
                                    const hasChildren = item.children && item.children.length > 0

                                    if (headerMenu.style === 'board' || headerMenu.style === 'mega') {
                                        return (
                                            <div
                                                key={item.id}
                                                className="relative group/menu"
                                                onMouseEnter={() => setHoveredItem(item.id)}
                                                onMouseLeave={() => setHoveredItem(null)}
                                            >
                                                <Link
                                                    href={item.url}
                                                    className="text-sm font-bold text-slate-800 hover:text-accent transition-all flex items-center gap-1 relative group"
                                                >
                                                    {item.label}
                                                    {(hasChildren || headerMenu.style === 'mega') && (
                                                        <ChevronDown className={`h-4 w-4 transition-transform ${hoveredItem === item.id ? 'rotate-180' : ''}`} />
                                                    )}
                                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
                                                </Link>

                                                <div className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 transition-all duration-300 ${hoveredItem === item.id ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                                                    <div className={`bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 ${headerMenu.style === 'mega' ? 'min-w-[800px]' : 'min-w-[500px]'}`}>
                                                        <div className={`grid ${headerMenu.style === 'mega' ? 'grid-cols-2' : 'grid-cols-1'} gap-8`}>
                                                            <div className="space-y-6">
                                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Khám phá {item.label}</div>
                                                                {hasChildren ? (
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        {item.children.sort((a: any, b: any) => a.order - b.order).map((child: any) => (
                                                                            <Link
                                                                                key={child.id}
                                                                                href={child.url}
                                                                                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-all group/subitem"
                                                                            >
                                                                                <div className="h-10 w-10 bg-primary/5 rounded-lg flex items-center justify-center text-primary shrink-0 group-hover/subitem:bg-primary group-hover/subitem:text-white transition-colors">
                                                                                    <ChevronRight size={16} />
                                                                                </div>
                                                                                <div>
                                                                                    <div className="text-sm font-bold text-slate-900 group-hover/subitem:text-accent transition-colors">{child.label}</div>
                                                                                    {child.description && <div className="text-[10px] text-slate-400 line-clamp-1">{child.description}</div>}
                                                                                </div>
                                                                            </Link>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <Link
                                                                        href={item.url}
                                                                        className="flex items-center gap-4 p-4 rounded-3xl hover:bg-slate-50 transition-all group/item"
                                                                    >
                                                                        {item.image ? (
                                                                            <div className="h-16 w-16 rounded-2xl overflow-hidden border border-slate-100 shrink-0">
                                                                                <img src={item.image} className="h-full w-full object-cover group-hover/item:scale-110 transition-transform" />
                                                                            </div>
                                                                        ) : (
                                                                            <div className="h-16 w-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent shrink-0">
                                                                                <ShoppingBag size={24} />
                                                                            </div>
                                                                        )}
                                                                        <div>
                                                                            <h3 className="font-bold text-slate-900 group-hover/item:text-accent transition-colors">{item.label}</h3>
                                                                            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{item.description || 'Xem chi tiết các nội dung liên quan.'}</p>
                                                                        </div>
                                                                    </Link>
                                                                )}
                                                            </div>

                                                            {headerMenu.style === 'mega' && (
                                                                <div className="relative rounded-3xl overflow-hidden group/img aspect-[4/3]">
                                                                    <img src={item.image || '/logo.png'} className="absolute inset-0 w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700" />
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                                                                        <div className="text-white font-bold text-xl">{item.label}</div>
                                                                        <Link href={item.url} className="mt-4 inline-flex items-center gap-2 text-white text-xs font-bold bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl hover:bg-white hover:text-primary transition-all self-start">
                                                                            Tìm hiểu thêm <ChevronRight size={14} />
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }

                                    // Default/List Style
                                    return renderDropdown(item)
                                })
                            })()}
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
                        {(() => {
                            if (!Array.isArray(headerMenu?.items)) return null

                            const buildTree = (items: any[]) => {
                                const map = new Map()
                                const tree: any[] = []
                                items.forEach(item => map.set(item.id, { ...item, children: [] }))
                                items.forEach(item => {
                                    const node = map.get(item.id)
                                    if (item.parentId && map.has(item.parentId)) {
                                        map.get(item.parentId).children.push(node)
                                    } else {
                                        tree.push(node)
                                    }
                                })
                                return tree.sort((a, b) => a.order - b.order)
                            }

                            const menuTree = buildTree(headerMenu.items)

                            const renderMobileItem = (item: any, depth = 0) => {
                                const hasChildren = item.children && item.children.length > 0
                                return (
                                    <div key={item.id} className={`${depth === 0 ? 'border-b border-slate-50 last:border-none pb-2' : 'ml-4 mt-2'}`}>
                                        <Link
                                            href={item.url}
                                            className={`flex items-center gap-4 py-3 px-2 text-slate-800 hover:text-accent transition-all active:bg-slate-50 rounded-2xl ${depth === 0 ? 'font-bold' : 'font-medium text-sm'}`}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {item.image && depth === 0 ? (
                                                <div className="h-10 w-10 rounded-xl overflow-hidden border border-slate-100 shrink-0 shadow-sm">
                                                    <img src={item.image} className="h-full w-full object-cover" />
                                                </div>
                                            ) : depth === 0 && (
                                                <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                                                    <ChevronRight size={18} />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    {item.label}
                                                </div>
                                                {item.description && depth === 0 && (
                                                    <div className="text-[10px] text-slate-400 font-medium line-clamp-1 mt-0.5">{item.description}</div>
                                                )}
                                            </div>
                                            {hasChildren ? <ChevronDown size={14} className="text-slate-300" /> : <ChevronRight size={16} className="text-slate-300" />}
                                        </Link>
                                        {hasChildren && (
                                            <div className="space-y-1">
                                                {item.children.map((child: any) => renderMobileItem(child, depth + 1))}
                                            </div>
                                        )}
                                    </div>
                                )
                            }

                            return menuTree.map((item: any) => renderMobileItem(item))
                        })()}

                        <div className="pt-8 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Link
                                    href="/bao-gia"
                                    className="px-6 py-4 bg-accent text-white text-center font-bold rounded-2xl hover:bg-accent-600 transition-all shadow-lg shadow-accent/20"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Báo giá
                                </Link>
                                <a
                                    href="tel:0913381683"
                                    className="px-6 py-4 bg-slate-900 text-white text-center font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
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
