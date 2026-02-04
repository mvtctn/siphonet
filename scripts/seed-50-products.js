
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lchpcrquxjcnpubjqlof.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjaHBjcnF1eGpjbnB1YmpxbG9mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE1MjI4MSwiZXhwIjoyMDg1NzI4MjgxfQ.FYy2gDaaXBrx54noxRY9gcwMp2YE_x2dPTioQs1-JYE';
const supabase = createClient(supabaseUrl, supabaseKey);

const categories = {
    waterTreatment: '5af05992-2fd1-422c-b1eb-d81ae763d172',
    waterSupply: 'aa46d94e-cb0c-4cca-8f85-5b4d9d9cf242',
    siphonic: '802479ee-84f7-4281-b32e-98557b487bfc'
};

function generateSlug(name) {
    return name.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") + '-' + Math.random().toString(36).substring(2, 6);
}

const products = [];

// 1. Hệ thống lọc nước (15 products)
for (let i = 1; i <= 15; i++) {
    const name = `Hệ thống lọc nước RO công nghiệp Siphonet-RO${i * 100}`;
    products.push({
        name,
        slug: generateSlug(name),
        description: `Hệ thống lọc nước RO công suất ${i * 100} lít/giờ, sử dụng công nghệ màng lọc tiên tiến nhất. Đảm bảo nước đầu ra đạt tiêu chuẩn nước uống của Bộ Y tế.`,
        technical_specifications: [
            { parameter: "Công suất", value: `${i * 100}`, unit: "L/h" },
            { parameter: "Màng lọc", value: "RO Dow Filmtec", unit: "" },
            { parameter: "Điện năng", value: "1.5", unit: "kW" }
        ],
        price: 25000000 + (i * 5000000),
        stock: 10,
        sku: `RO-SYS-${i}`,
        category_id: categories.waterTreatment,
        images: ["https://picsum.photos/seed/ro" + i + "/800/600"],
        featured: i % 5 === 0,
        status: 'published'
    });
}

// 2. Thiết bị xử lý nước thải Jokaso (15 products)
for (let i = 1; i <= 15; i++) {
    const name = `Bể xử lý nước thải Jokaso Composite JKS-${i * 5}`;
    products.push({
        name,
        slug: generateSlug(name),
        description: `Bể Jokaso công nghệ Nhật Bản, chuyên dùng cho xử lý nước thải sinh hoạt hộ gia đình và tòa nhà. Hiệu quả xử lý cao, không mùi, độ bền composite trên 50 năm.`,
        technical_specifications: [
            { parameter: "Công suất", value: `${i * 2}`, unit: "m³/ngày" },
            { parameter: "Vật liệu", value: "Composite (FRP)", unit: "" },
            { parameter: "Công nghệ", value: "Jokaso Japan", unit: "" }
        ],
        price: 45000000 + (i * 10000000),
        stock: 5,
        sku: `JKS-TANK-${i}`,
        category_id: categories.waterTreatment,
        images: ["https://picsum.photos/seed/jks" + i + "/800/600"],
        featured: i % 4 === 0,
        status: 'published'
    });
}

// 3. Xử lý nước biển (10 products)
for (let i = 1; i <= 10; i++) {
    const name = `Máy lọc nước biển khử mặn SW-RO-${i * 200}`;
    products.push({
        name,
        slug: generateSlug(name),
        description: `Máy khử mặn nước biển chuyên dụng cho tàu cá và khu du lịch biển. Loại bỏ độ mặn 99.9%, cung cấp nước ngọt sinh hoạt sạch từ nguồn nước biển.`,
        technical_specifications: [
            { parameter: "Công suất", value: `${i * 0.5}`, unit: "m³/ngày" },
            { parameter: "Độ mặn đầu vào", value: "35000", unit: "ppm" },
            { parameter: "Màng lọc", value: "SWRO", unit: "" }
        ],
        price: 80000000 + (i * 15000000),
        stock: 3,
        sku: `SWRO-${i}`,
        category_id: categories.waterTreatment,
        images: ["https://picsum.photos/seed/sw" + i + "/800/600"],
        featured: i % 3 === 0,
        status: 'published'
    });
}

// 4. Giải pháp thoát nước mưa Siphonic (10 products)
for (let i = 1; i <= 10; i++) {
    const name = `Phễu thu nước mưa Siphonic SUS304 D${i * 10 + 60}`;
    products.push({
        name,
        slug: generateSlug(name),
        description: `Phễu thu nước siphonic hiệu suất cao, làm bằng thép không gỉ 304. Thiết kế khí động học giúp tối ưu hóa dòng chảy, ngăn rác và giảm tiếng ồn khi thoát nước mái.`,
        technical_specifications: [
            { parameter: "Đường kính", value: `${i * 10 + 60}`, unit: "mm" },
            { parameter: "Vật liệu", value: "Inox 304", unit: "" },
            { parameter: "Lưu lượng", value: `${i * 10}`, unit: "L/s" }
        ],
        price: 3500000 + (i * 500000),
        stock: 50,
        sku: `SPH-DRN-${i}`,
        category_id: categories.siphonic,
        images: ["https://picsum.photos/seed/sph" + i + "/800/600"],
        featured: i % 2 === 0,
        status: 'published'
    });
}

async function seed() {
    console.log(`🚀 Starting to seed ${products.length} products...`);

    // Insert in batches of 10 to be safe
    for (let i = 0; i < products.length; i += 10) {
        const batch = products.slice(i, i + 10);
        const { data, error } = await supabase.from('products').insert(batch);

        if (error) {
            console.error(`❌ Error inserting batch ${i / 10 + 1}:`, error.message);
        } else {
            console.log(`✅ Inserted batch ${i / 10 + 1}`);
        }
    }

    console.log('✨ Seeding completed!');
}

seed();
