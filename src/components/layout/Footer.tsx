'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Facebook, Youtube, Linkedin } from 'lucide-react'
import { useSettings } from '@/components/providers/SettingsProvider'

export function Footer() {
    const settings = useSettings()
    const siteInfo = settings?.site_info
    const social = settings?.social

    const siteTitle = siteInfo?.title || 'Công ty Cổ phần Siphonet'
    const logoUrl = siteInfo?.logo_url || '/logo.png'
    const siteDescription = siteInfo?.description || 'Chuyên cung cấp, lắp đặt thiết bị cơ điện M&E, hệ thống cấp thoát nước và xử lý nước.'

    return (
        <footer className="bg-primary text-white">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <Image
                            src={logoUrl}
                            alt={siteTitle}
                            width={260}
                            height={52}
                            style={{ width: 'auto', height: 'auto' }}
                            className="h-[52px] brightness-0 invert mb-6"
                        />
                        <p className="text-slate-300 text-sm mb-4">
                            {siteTitle} - {siteDescription}
                        </p>
                        <p className="text-slate-300 text-xs mb-4">
                            Mã số thuế: 0111350715
                        </p>
                        <div className="flex gap-3">
                            {social?.facebook && (
                                <a
                                    href={social.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-accent flex items-center justify-center transition-colors"
                                    aria-label="Facebook"
                                >
                                    <Facebook className="h-4 w-4" />
                                </a>
                            )}
                            {social?.youtube && (
                                <a
                                    href={social.youtube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-accent flex items-center justify-center transition-colors"
                                    aria-label="Youtube"
                                >
                                    <Youtube className="h-4 w-4" />
                                </a>
                            )}
                            {social?.linkedin && (
                                <a
                                    href={social.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-accent flex items-center justify-center transition-colors"
                                    aria-label="LinkedIn"
                                >
                                    <Linkedin className="h-4 w-4" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Liên kết nhanh</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/san-pham" className="text-slate-300 hover:text-accent transition-colors">
                                    Sản phẩm
                                </Link>
                            </li>
                            <li>
                                <Link href="/du-an" className="text-slate-300 hover:text-accent transition-colors">
                                    Dự án tiêu biểu
                                </Link>
                            </li>
                            <li>
                                <Link href="/dich-vu" className="text-slate-300 hover:text-accent transition-colors">
                                    Dịch vụ
                                </Link>
                            </li>
                            <li>
                                <Link href="/tin-tuc" className="text-slate-300 hover:text-accent transition-colors">
                                    Tin tức
                                </Link>
                            </li>
                            <li>
                                <Link href="/lien-he" className="text-slate-300 hover:text-accent transition-colors">
                                    Liên hệ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Dịch vụ</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/dich-vu/tu-van-thiet-ke" className="text-slate-300 hover:text-accent transition-colors">
                                    Tư vấn thiết kế M&E
                                </Link>
                            </li>
                            <li>
                                <Link href="/dich-vu/lap-dat" className="text-slate-300 hover:text-accent transition-colors">
                                    Lắp đặt hệ thống
                                </Link>
                            </li>
                            <li>
                                <Link href="/dich-vu/van-hanh-bao-tri" className="text-slate-300 hover:text-accent transition-colors">
                                    Vận hành & bảo trì
                                </Link>
                            </li>
                            <li>
                                <Link href="/dich-vu/sua-chua" className="text-slate-300 hover:text-accent transition-colors">
                                    Sửa chữa & nâng cấp
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Liên hệ</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                                <span className="text-slate-300">
                                    {siteInfo?.address || 'Tầng 4, Tòa nhà N07-B1, Khu đô thị mới Dịch Vọng, Quận Cầu Giấy, Hà Nội'}
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                                <a href={`tel:${siteInfo?.phone || '0913381683'}`} className="text-slate-300 hover:text-accent transition-colors">
                                    {siteInfo?.phone || '0913 381 683'}
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                                <a href={`mailto:${siteInfo?.email || 'siphonetjsc@gmail.com'}`} className="text-slate-300 hover:text-accent transition-colors">
                                    {siteInfo?.email || 'siphonetjsc@gmail.com'}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
                        <p>
                            © {new Date().getFullYear()} {siteTitle}. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <Link href="/chinh-sach-bao-mat" className="hover:text-accent transition-colors">
                                Chính sách bảo mật
                            </Link>
                            <Link href="/dieu-khoan-su-dung" className="hover:text-accent transition-colors">
                                Điều khoản sử dụng
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
