import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { FloatingContact } from '@/components/common/FloatingContact'

const inter = Inter({
    subsets: ['latin', 'vietnamese'],
    display: 'swap',
    variable: '--font-inter',
})

export const metadata: Metadata = {
    title: 'Siphonet | Thiết bị Cơ Điện & Xử Lý Nước',
    description: 'Chuyên cung cấp thiết bị M&E, hệ thống cấp thoát nước và xử lý nước cho công trình dân dụng và công nghiệp',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="vi" className={inter.variable}>
            <body className={inter.className}>
                {children}
                <FloatingContact />
            </body>
        </html>
    )
}
