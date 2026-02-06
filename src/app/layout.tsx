import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { FloatingContact } from '@/components/common/FloatingContact'
import { supabaseAdmin } from '@/lib/supabase'
import { SettingsProvider } from '@/components/providers/SettingsProvider'

const inter = Inter({
    subsets: ['latin', 'vietnamese'],
    display: 'swap',
    variable: '--font-inter',
})

export async function generateMetadata(): Promise<Metadata> {
    try {
        const { data: settings } = await supabaseAdmin
            .from('settings')
            .select('*')
            .in('key', ['seo', 'site_info'])

        const seo = settings?.find(s => s.key === 'seo')?.value || {}
        const siteInfo = settings?.find(s => s.key === 'site_info')?.value || {}

        return {
            title: seo.meta_title || 'Siphonet | Thiết bị Cơ Điện & Xử Lý Nước',
            description: seo.meta_description || 'Chuyên cung cấp thiết bị M&E, hệ thống cấp thoát nước và xử lý nước cho công trình dân dụng và công nghiệp',
            keywords: seo.keywords || 'siphonet, m&e, xử lý nước, cấp thoát nước',
            icons: {
                icon: siteInfo.favicon_url || '/favicon.ico',
            }
        }
    } catch (error) {
        return {
            title: 'Siphonet | Thiết bị Cơ Điện & Xử Lý Nước',
            description: 'Chuyên cung cấp thiết bị M&E, hệ thống cấp thoát nước và xử lý nước cho công trình dân dụng và công nghiệp',
        }
    }
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    let gaScript = ''
    try {
        const { data: analyticsSettings } = await supabaseAdmin
            .from('settings')
            .select('value')
            .eq('key', 'analytics')
            .single()
        gaScript = analyticsSettings?.value?.google_analytics_script || ''
    } catch (error) {
        console.error('Failed to fetch GA settings', error)
    }

    return (
        <html lang="vi" className={inter.variable}>
            <head />
            <body className={inter.className}>
                {gaScript && (
                    <div dangerouslySetInnerHTML={{ __html: gaScript }} style={{ display: 'none' }} />
                )}
                <SettingsProvider>
                    {children}
                    <FloatingContact />
                </SettingsProvider>
            </body>
        </html>
    )
}
