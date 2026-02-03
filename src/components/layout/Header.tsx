import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, Menu } from 'lucide-react'

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            {/* Top Bar */}
            <div className="bg-primary text-white text-sm">
                <div className="container mx-auto px-4 py-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-4">
                            <a href="tel:02432001234" className="flex items-center gap-2 hover:text-accent transition-colors">
                                <Phone className="h-4 w-4" />
                                <span>024 3200 1234</span>
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
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/logo.png"
                            alt="Siphonet"
                            width={200}
                            height={40}
                            priority
                            style={{ width: 'auto', height: 'auto' }}
                            className="h-10"
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
                        <Link
                            href="/san-pham"
                            className="text-sm font-medium text-slate-700 hover:text-accent transition-colors"
                        >
                            Sản phẩm
                        </Link>
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

                    {/* CTA Button */}
                    <div className="hidden lg:flex items-center gap-2">
                        <Link
                            href="/bao-gia"
                            className="px-6 py-2.5 bg-accent hover:bg-accent-600 text-white text-sm font-semibold rounded-lg transition-all hover:scale-105 shadow-lg shadow-accent/30"
                        >
                            Yêu cầu báo giá
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="lg:hidden p-2 text-slate-700 hover:text-accent">
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </header>
    )
}
