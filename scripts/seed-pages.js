
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lchpcrquxjcnpubjqlof.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjaHBjcnF1eGpjbnB1YmpxbG9mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE1MjI4MSwiZXhwIjoyMDg1NzI4MjgxfQ.FYy2gDaaXBrx54noxRY9gcwMp2YE_x2dPTioQs1-JYE';
const supabase = createClient(supabaseUrl, supabaseKey);

const initialPages = [
    {
        title: 'Trang chủ',
        slug: 'home',
        layout: { body: '<h1>Chào mừng đến với Siphonet</h1><p>Thiết bị Cơ Điện & Xử Lý Nước hàng đầu.</p>' },
        status: 'published',
        meta_title: 'Siphonet - Thiết bị Cơ Điện & Xử Lý Nước',
        meta_description: 'Chuyên cung cấp giải pháp thoát nước Siphonic, xử lý nước thải và thiết bị M&E chuyên nghiệp.'
    },
    {
        title: 'Giới thiệu',
        slug: 'gioi-thieu',
        layout: { body: '<h1>Về chúng tôi</h1><p>Siphonet là đơn vị tiên phong trong lĩnh vực thoát nước Siphonic tại Việt Nam...</p>' },
        status: 'published',
        meta_title: 'Giới thiệu về Siphonet | Siphonic & M&E Solutions',
        meta_description: 'Tìm hiểu về lịch sử, tầm nhìn và sứ mệnh của Siphonet trong ngành xử lý nước.'
    },
    {
        title: 'Liên hệ',
        slug: 'lien-he',
        layout: { body: '<h1>Liên hệ với chúng tôi</h1><p>Địa chỉ: TP.HCM. Hotline: 0123456789.</p>' },
        status: 'published',
        meta_title: 'Liên hệ Siphonet | Hỗ trợ 24/7',
        meta_description: 'Thông tin liên hệ, bản đồ và form yêu cầu báo giá chính thức của Siphonet.'
    },
    {
        title: 'Chính sách bảo mật',
        slug: 'chinh-sach-bao-mat',
        layout: { body: '<h1>Chính sách bảo mật</h1><p>Chúng tôi cam kết bảo mật thông tin khách hàng...</p>' },
        status: 'published',
        meta_title: 'Chính sách bảo mật | Siphonet',
        meta_description: 'Các quy định về bảo mật thông tin người dùng trên website siphonet.com'
    }
];

async function seed() {
    console.log('🚀 Seeding initial pages...');

    for (const page of initialPages) {
        // Check if exists
        const { data: existing } = await supabase
            .from('pages')
            .select('id')
            .eq('slug', page.slug)
            .single();

        if (existing) {
            console.log(`ℹ️ Page already exists: ${page.slug}`);
            continue;
        }

        const { error } = await supabase
            .from('pages')
            .insert(page);

        if (error) {
            console.error(`❌ Error seeding page ${page.slug}:`, error.message);
        } else {
            console.log(`✅ Page seeded: ${page.slug}`);
        }
    }

    console.log('✨ Seeding pages completed!');
}

seed();
