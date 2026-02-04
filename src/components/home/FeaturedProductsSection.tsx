import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductCard } from '../products/ProductCard'
import { supabase } from '@/lib/supabase'

export async function FeaturedProductsSection() {
    // Fetch featured products from Supabase
    const { data: featuredProductsData } = await supabase
        .from('products')
        .select(`
            *,
            categories (name)
        `)
        .eq('featured', true)
        .eq('status', 'published')
        .limit(6)

    // Transform data
    const featuredProducts = featuredProductsData?.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description || '',
        price: parseFloat(p.price),
        stock: p.stock,
        sku: p.sku || '',
        category: p.categories?.name || '',
        categoryId: p.category_id,
        images: p.images || [],
        technicalSpecifications: p.technical_specifications || [],
        featured: p.featured || false,
        rating: 4.5,
    })) || []

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                        Sản phẩm nổi bật
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Thiết bị chất lượng cao
                    </h2>
                    <p className="text-lg text-slate-600">
                        Nhập khẩu chính hãng từ các thương hiệu hàng đầu thế giới
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {featuredProducts.length > 0 ? (
                        featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 text-slate-500">
                            Đang cập nhật sản phẩm nổi bật...
                        </div>
                    )}
                </div>

                {/* View All Button */}
                <div className="text-center">
                    <Link
                        href="/san-pham"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-800 text-white font-medium rounded-lg transition-colors"
                    >
                        Xem tất cả sản phẩm
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
