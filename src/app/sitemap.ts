import { supabaseAdmin } from '@/lib/supabase'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://siphonet.com'

    // Fetch all entities for dynamic routes
    const [products, posts, projects, pages] = await Promise.all([
        supabaseAdmin.from('products').select('slug, updated_at').eq('status', 'published'),
        supabaseAdmin.from('posts').select('slug, updated_at').eq('status', 'published'),
        supabaseAdmin.from('projects').select('slug, updated_at').eq('status', 'published'),
        supabaseAdmin.from('pages').select('slug, updated_at').eq('status', 'published'),
    ])

    const productUrls = (products.data || []).map((item) => ({
        url: `${baseUrl}/san-pham/${item.slug}`,
        lastModified: new Date(item.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    const postUrls = (posts.data || []).map((item) => ({
        url: `${baseUrl}/tin-tuc/${item.slug}`,
        lastModified: new Date(item.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }))

    const projectUrls = (projects.data || []).map((item) => ({
        url: `${baseUrl}/du-an/${item.slug}`,
        lastModified: new Date(item.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }))

    const pageUrls = (pages.data || []).map((item) => {
        // Handle home page specifically if it's in the pages table
        const url = item.slug === 'home' || item.slug === '/' ? baseUrl : `${baseUrl}/${item.slug}`
        return {
            url,
            lastModified: new Date(item.updated_at),
            changeFrequency: 'monthly' as const,
            priority: item.slug === 'home' ? 1.0 : 0.5,
        }
    })

    // Static routes that might not be in the 'pages' table
    const staticRoutes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/san-pham`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/tin-tuc`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/du-an`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/bao-gia`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/lien-he`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
    ]

    // Filter out duplicates from static routes if they exist in pageUrls
    const dynamicUrlStrings = pageUrls.map(p => p.url)
    const uniqueStaticRoutes = staticRoutes.filter(s => !dynamicUrlStrings.includes(s.url))

    return [...uniqueStaticRoutes, ...pageUrls, ...productUrls, ...postUrls, ...projectUrls]
}
