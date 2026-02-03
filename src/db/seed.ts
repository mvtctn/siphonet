import { db } from './index'
import { categories, products, projects, services, faqs, teamMembers, testimonials } from './schema'

async function seed() {
    console.log('🌱 Seeding database...')

    // Seed Categories
    console.log('📁 Creating categories...')
    const [meCategory, waterSupplyCategory, waterTreatmentCategory] = await db
        .insert(categories)
        .values([
            {
                name: 'Thiết bị Cơ Điện',
                slug: 'thiet-bi-co-dien',
                description: 'Thiết bị M&E cho công trình dân dụng và công nghiệp',
                icon: 'Zap',
            },
            {
                name: 'Thiết bị Cấp Nước',
                slug: 'thiet-bi-cap-nuoc',
                description: 'Hệ thống cấp nước sạch và phân phối',
                icon: 'Droplet',
            },
            {
                name: 'Thiết bị Xử Lý Nước',
                slug: 'thiet-bi-xu-ly-nuoc',
                description: 'Hệ thống xử lý nước thải và nước sạch',
                icon: 'Waves',
            },
        ])
        .returning()

    console.log(`✅ Created ${[meCategory, waterSupplyCategory, waterTreatmentCategory].length} categories`)

    // Seed Products
    console.log('📦 Creating sample products...')
    await db.insert(products).values([
        {
            name: 'Máy bơm ly tâm Grundfos CR 3-36',
            slug: 'may-bom-ly-tam-grundfos-cr-3-36',
            description: 'Máy bơm ly tâm đa tầng cánh Grundfos CR, phù hợp cho hệ thống cấp nước, tăng áp',
            technicalSpecifications: [
                { parameter: 'Lưu lượng', value: '3', unit: 'm³/h' },
                { parameter: 'Cột áp', value: '36', unit: 'm' },
                { parameter: 'Công suất', value: '1.5', unit: 'kW' },
                { parameter: 'Điện áp', value: '380', unit: 'V' },
            ],
            price: '15500000',
            stock: 5,
            sku: 'GRF-CR3-36',
            categoryId: waterSupplyCategory.id,
            images: [
                { url: '/placeholders/pump-1.jpg', alt: 'Grundfos CR 3-36' },
            ],
            featured: true,
            status: 'published',
            metaTitle: 'Máy bơm Grundfos CR 3-36 - Siphonet',
            metaDescription: 'Máy bơm ly tâm Grundfos CR 3-36, lưu lượng 3m³/h, cột áp 36m',
            keywords: 'máy bơm grundfos, máy bơm ly tâm, grundfos cr',
        },
        {
            name: 'Hệ thống lọc nước RO công nghiệp 500L/h',
            slug: 'he-thong-loc-nuoc-ro-500l',
            description: 'Hệ thống lọc nước RO công nghiệp, công suất 500 lít/giờ',
            technicalSpecifications: [
                { parameter: 'Công suất', value: '500', unit: 'L/h' },
                { parameter: 'Số màng RO', value: '4', unit: 'cái' },
                { parameter: 'Áp lực hoạt động', value: '3-8', unit: 'bar' },
                { parameter: 'Tỷ lệ thu hồi', value: '60', unit: '%' },
            ],
            price: '45000000',
            stock: 2,
            sku: 'RO-500L-IND',
            categoryId: waterTreatmentCategory.id,
            images: [
                { url: '/placeholders/ro-system.jpg', alt: 'Hệ thống RO 500L' },
            ],
            featured: true,
            status: 'published',
        },
    ])

    console.log('✅ Created sample products')

    // Seed Projects
    console.log('🏗️ Creating sample projects...')
    await db.insert(projects).values([
        {
            title: 'Hệ thống xử lý nước thải - Khu công nghiệp Tân Bình',
            slug: 'he-thong-xu-ly-nuoc-thai-kcn-tan-binh',
            description: 'Thi công lắp đặt hệ thống xử lý nước thải công suất 1000m³/ngày',
            technicalDetails: 'Công nghệ xử lý: AAO + MBR. Công suất: 1000m³/ngày. Tiêu chuẩn đầu ra: QCVN 40:2011/BTNMT',
            location: 'Khu công nghiệp Tân Bình, TP.HCM',
            client: 'Công ty TNHH ABC',
            completionDate: new Date('2025-06-15'),
            category: 'Xử lý nước thải',
            featured: true,
            images: [
                { url: '/placeholders/project-1.jpg', caption: 'Toàn cảnh hệ thống' },
            ],
        },
        {
            title: 'Hệ thống cấp nước - Chung cư Vinhomes',
            slug: 'he-thong-cap-nuoc-chung-cu-vinhomes',
            description: 'Lắp đặt hệ thống cấp nước, tăng áp cho chung cư 30 tầng',
            technicalDetails: 'Hệ thống bơm tăng áp biến tần Grundfos, công suất 150m³/h',
            location: 'Vinhomes Grand Park, TP.HCM',
            client: 'Vingroup',
            completionDate: new Date('2025-08-20'),
            category: 'Cấp nước',
            featured: true,
        },
    ])

    console.log('✅ Created sample projects')

    // Seed Services
    console.log('🔧 Creating services...')
    await db.insert(services).values([
        {
            title: 'Tư vấn thiết kế hệ thống M&E',
            slug: 'tu-van-thiet-ke-he-thong-me',
            description: 'Dịch vụ tư vấn, thiết kế hệ thống cơ điện cho công trình',
            icon: 'Lightbulb',
            features: [
                'Khảo sát hiện trạng',
                'Thiết kế bản vẽ kỹ thuật',
                'Tính toán phương án tối ưu',
                'Lập dự toán chi tiết',
            ],
            order: 1,
        },
        {
            title: 'Lắp đặt hệ thống cấp thoát nước',
            slug: 'lap-dat-he-thong-cap-thoat-nuoc',
            description: 'Thi công lắp đặt hệ thống cấp thoát nước cho mọi công trình',
            icon: 'Wrench',
            features: [
                'Lắp đặt đường ống',
                'Lắp đặt thiết bị bơm',
                'Thử nghiệm hệ thống',
                'Bảo hành 24 tháng',
            ],
            order: 2,
        },
    ])

    console.log('✅ Created services')

    // Seed FAQs
    console.log('❓ Creating FAQs...')
    await db.insert(faqs).values([
        {
            question: 'Siphonet cung cấp những thiết bị gì?',
            answer: 'Siphonet chuyên cung cấp thiết bị cơ điện (M&E), thiết bị cấp nước, thiết bị xử lý nước cho công trình dân dụng và công nghiệp.',
            category: 'General',
            order: 1,
            featured: true,
        },
        {
            question: 'Thời gian bảo hành sản phẩm là bao lâu?',
            answer: 'Thời gian bảo hành tiêu chuẩn là 12-24 tháng tùy theo sản phẩm. Một số sản phẩm cao cấp có bảo hành lên đến 36 tháng.',
            category: 'Products',
            order: 2,
            featured: true,
        },
    ])

    console.log('✅ Created FAQs')

    // Seed Team Members
    console.log('👥 Creating team members...')
    await db.insert(teamMembers).values([
        {
            name: 'Nguyễn Văn A',
            position: 'Giám đốc kỹ thuật',
            bio: 'Hơn 15 năm kinh nghiệm trong lĩnh vực M&E',
            email: 'nguyenvana@siphonet.com',
            specialization: ['Hệ thống M&E', 'Xử lý nước', 'Quản lý dự án'],
            order: 1,
        },
    ])

    console.log('✅ Created team members')

    // Seed Testimonials
    console.log('💬 Creating testimonials...')
    await db.insert(testimonials).values([
        {
            clientName: 'Trần Văn B',
            clientPosition: 'Giám đốc',
            clientCompany: 'Công ty TNHH XYZ',
            testimonial: 'Siphonet đã hỗ trợ chúng tôi rất tận tình trong dự án xử lý nước thải. Chất lượng thi công tốt, tiến độ đúng cam kết.',
            rating: 5,
            featured: true,
            order: 1,
        },
    ])

    console.log('✅ Created testimonials')

    console.log('🎉 Database seeded successfully!')
}

seed()
    .catch((error) => {
        console.error('❌ Error seeding database:', error)
        process.exit(1)
    })
    .finally(() => {
        process.exit(0)
    })
