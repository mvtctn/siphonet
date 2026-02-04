import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedProductsSection } from '@/components/home/FeaturedProductsSection'
import { FeaturedProjectsSection } from '@/components/home/FeaturedProjectsSection'
import { ServicesSection } from '@/components/home/ServicesSection'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { FAQSection } from '@/components/home/FAQSection'
import { CTASection } from '@/components/home/CTASection'

export const dynamic = 'force-dynamic'

export default function HomePage() {
    return (
        <>
            <Header />
            <main>
                <HeroSection />
                <FeaturedProductsSection />
                <ServicesSection />
                <FeaturedProjectsSection />
                <TestimonialsSection />
                <FAQSection />
                <CTASection />
            </main>
            <Footer />
        </>
    )
}
