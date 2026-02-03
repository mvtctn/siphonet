import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductCard } from '../products/ProductCard'
import { mockProducts } from '@/lib/mock-data'

export function FeaturedProductsSection() {
    const featuredProducts = mockProducts.filter(p => p.featured)

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
                    {featuredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
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
