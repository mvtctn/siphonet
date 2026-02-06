
export const CATEGORY_MAP: Record<string, string> = {
    'Công ty': 'cong-ty',
    'Tuyển dụng': 'tuyen-dung',
    'Công nghệ': 'cong-nghe',
    'Chuyên ngành': 'chuyen-nganh',
    'Xã hội': 'xa-hoi'
}

export const SLUG_TO_CATEGORY: Record<string, string> = Object.fromEntries(
    Object.entries(CATEGORY_MAP).map(([name, slug]) => [slug, name])
)

export function getCategorySlug(categoryName: string): string {
    return CATEGORY_MAP[categoryName] || categoryName.toLowerCase().replace(/\s+/g, '-')
}

export function getCategoryName(slug: string): string {
    return SLUG_TO_CATEGORY[slug] || slug
}
