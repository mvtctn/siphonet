import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AboutPage } from '@/components/about/AboutPage'
import { supabase } from '@/lib/supabase'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
    const { data: page } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'gioi-thieu')
        .single()

    if (!page) return { title: 'Giới thiệu - Siphonet' }

    return {
        title: page.meta_title || page.title,
        description: page.meta_description,
    }
}

export default async function About() {
    const { data: pageData } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'gioi-thieu')
        .filter('status', 'eq', 'published')
        .single()

    return (
        <>
            <Header />
            <AboutPage initialData={pageData} />
            <Footer />
        </>
    )
}
