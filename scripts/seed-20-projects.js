
const { createClient } = require('@supabase/supabase-js');

// Using the same credentials as seed-50-products.js
const supabaseUrl = 'https://lchpcrquxjcnpubjqlof.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjaHBjcnF1eGpjbnB1YmpxbG9mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE1MjI4MSwiZXhwIjoyMDg1NzI4MjgxfQ.FYy2gDaaXBrx54noxRY9gcwMp2YE_x2dPTioQs1-JYE';
const supabase = createClient(supabaseUrl, supabaseKey);

function generateSlug(text) {
    return text.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

const projects = [
    {
        title: "Hệ thống thoát nước mái Siphonic - Nhà máy Lego Bình Dương",
        description: "Thi công hệ thống thoát nước mưa Siphonic công suất lớn cho mái nhà máy diện tích 44 hecta. Đảm bảo thoát nước nhanh chóng trong điều kiện mưa cực đoan.",
        location: "KCN VSIP III, Bình Dương",
        client: "Tập đoàn LEGO",
        category: "Cơ điện",
        featured: true,
        images: ["https://images.unsplash.com/photo-1541888946425-d81bb19480c5?w=800&q=80"]
    },
    {
        title: "Trạm xử lý nước thải tập trung KCN Nhơn Trạch VI",
        description: "Xây dựng và lắp đặt thiết bị cho trạm xử lý nước thải công suất 10.000 m3/ngày đêm. Sử dụng công nghệ AAO kết hợp màng MBR tiên tiến.",
        location: "KCN Nhơn Trạch VI, Đồng Nai",
        client: "Tổng công ty Tín Nghĩa",
        category: "Xử lý nước thải",
        featured: true,
        images: ["https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80"]
    },
    {
        title: "Hệ thống cấp nước và tăng áp - Tòa nhà Landmark 81",
        description: "Cung cấp và lắp đặt cụm bơm tăng áp biến tần Grundfos và hệ thống lọc nước trung tâm cho tòa nhà cao nhất Việt Nam.",
        location: "Bình Thạnh, TP.HCM",
        client: "Vingroup",
        category: "Cấp nước",
        featured: true,
        images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"]
    },
    {
        title: "Hệ thống thoát nước Siphonic - Sân bay quốc tế Long Thành",
        description: "Tư vấn và thi công hệ thống thoát nước mưa Siphonic cho nhà ga hành khách. Đảm bảo mỹ quan kiến trúc và hiệu suất thoát nước tối đa.",
        location: "Long Thành, Đồng Nai",
        client: "ACV",
        category: "Cơ điện",
        featured: true,
        images: ["https://images.unsplash.com/photo-1436491865332-7a61a109c051?w=800&q=80"]
    },
    {
        title: "Dự án lọc nước biển khử mặn - Đảo Trường Sa Lớn",
        description: "Lắp đặt hệ thống lọc nước biển công nghệ SWRO cung cấp nước ngọt sinh hoạt cho cán bộ chiến sĩ và nhân dân trên đảo.",
        location: "Huyện đảo Trường Sa, Khánh Hòa",
        client: "Bộ Quốc Phòng",
        category: "Xử lý nước thải",
        featured: true,
        images: ["https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?w=800&q=80"]
    },
    {
        title: "Hệ thống M&E tổng thể - Bệnh viện Đa khoa Tâm Anh",
        description: "Thiết kế và thi công trọn gói hệ thống điện chiếu sáng, cấp thoát nước và điều hòa thông gió.",
        location: "Long Biên, Hà Nội",
        client: "Bệnh viện Tâm Anh",
        category: "Cơ điện",
        featured: false,
        images: ["https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80"]
    },
    {
        title: "Trạm cấp nước sạch KCN Quang Châu",
        description: "Nâng cấp công suất trạm cấp nước sạch lên 20.000 m3/ngày đêm phục vụ sản xuất cho các nhà máy điện tử.",
        location: "KCN Quang Châu, Bắc Giang",
        client: "Công ty CP KBC",
        category: "Cấp nước",
        featured: false,
        images: ["https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=800&q=80"]
    },
    {
        title: "Xử lý nước thải sinh hoạt - Khu đô thị Ecopark",
        description: "Lắp đặt hệ thống bể Jokaso Composite cho các phân khu biệt thự cao cấp, đảm bảo nước thải đạt chuẩn đầu ra loại A.",
        location: "Văn Giang, Hưng Yên",
        client: "Tập đoàn Ecopark",
        category: "Xử lý nước thải",
        featured: false,
        images: ["https://images.unsplash.com/photo-1542013936693-884638324252?w=800&q=80"]
    },
    {
        title: "Hệ thống thoát nước Siphonic - Trung tâm Logistics FedEx",
        description: "Giải pháp thoát nước mái thông minh cho kho bãi diện tích lớn, giảm số lượng ống đứng và tối ưu không gian kho.",
        location: "KCN Bắc Ninh",
        client: "FedEx Vietnam",
        category: "Cơ điện",
        featured: false,
        images: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80"]
    },
    {
        title: "Cấp nước và PCCC - Nhà máy Samsung Electronics",
        description: "Cung cấp hệ thống máy bơm PCCC đạt tiêu chuẩn UL/FM và hệ thống làm mát dây chuyền sản xuất.",
        location: "KCN Yên Phong, Bắc Ninh",
        client: "Samsung Việt Nam",
        category: "Cấp nước",
        featured: true,
        images: ["https://images.unsplash.com/photo-1504917595217-d4dc5ebe6bd2?w=800&q=80"]
    },
    {
        title: "Hệ thống lọc nước tinh khiết - Nhà máy dược phẩm Hậu Giang",
        description: "Hệ thống lọc nước đạt tiêu chuẩn dược điển IV, sử dụng công nghệ EDI kết hợp RO 2 cấp.",
        location: "Cần Thơ",
        client: "DHG Pharma",
        category: "Xử lý nước thải",
        featured: false,
        images: ["https://images.unsplash.com/photo-1563213126-a4273aed2016?w=800&q=80"]
    },
    {
        title: "Thoát nước mái Siphonic - Nhà thi đấu đa năng Đà Nẵng",
        description: "Hệ thống thoát nước cho mái vòm kiến trúc phức tạp, sử dụng phễu Siphonic SUS304.",
        location: "Hải Châu, Đà Nẵng",
        client: "UBND TP Đà Nẵng",
        category: "Cơ điện",
        featured: false,
        images: ["https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80"]
    },
    {
        title: "Hệ thống điều hòa trung tâm - Khách sạn Sheraton Phú Quốc",
        description: "Thi công hệ thống Chiller giải nhiệt nước và mạng lưới đường ống cấp nước lạnh.",
        location: "Phú Quốc, Kiên Giang",
        client: "Sun Group",
        category: "Cơ điện",
        featured: false,
        images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"]
    },
    {
        title: "Trạm bơm thoát nước chống ngập TP Cần Thơ",
        description: "Cung cấp 04 máy bơm trục đứng công suất lớn phục vụ chống ngập úng đô thị.",
        location: "Ninh Kiều, Cần Thơ",
        client: "Ban QLDA ODA Cần Thơ",
        category: "Cấp nước",
        featured: false,
        images: ["https://images.unsplash.com/photo-1527552339064-5867d3cce650?w=800&q=80"]
    },
    {
        title: "Xử lý nước thải y tế - Bệnh viện Chợ Rẫy",
        description: "Nâng cấp hệ thống xử lý nước thải y tế đạt chuẩn môi trường môi trường mới.",
        location: "Quận 5, TP.HCM",
        client: "Bệnh viện Chợ Rẫy",
        category: "Xử lý nước thải",
        featured: false,
        images: ["https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80"]
    },
    {
        title: "Cấp nước trung tâm - Khu nghỉ dưỡng Amanoi",
        description: "Hệ thống lọc tổng và tăng áp cho toàn bộ khu resort 6 sao tại Ninh Thuận.",
        location: "Vịnh Vĩnh Hy, Ninh Thuận",
        client: "Tập đoàn Sovereign",
        category: "Cấp nước",
        featured: false,
        images: ["https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80"]
    },
    {
        title: "Hệ thống điện năng lượng mặt trời áp mái KCN Sóng Thần",
        description: "Thi công 2MWp điện mặt trời áp mái kết hợp hệ thống thoát nước mái hiện hữu.",
        location: "Dĩ An, Bình Dương",
        client: "Công ty Tiếp vận Gemadept",
        category: "Cơ điện",
        featured: false,
        images: ["https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80"]
    },
    {
        title: "Xử lý nước thải rỉ rác - Bãi rác Nam Sơn",
        description: "Trình diễn công nghệ xử lý nước rỉ rác bậc cao, loại bỏ Nitơ và Amoni triệt để.",
        location: "Sóc Sơn, Hà Nội",
        client: "URENCO Hà Nội",
        category: "Xử lý nước thải",
        featured: false,
        images: ["https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80"]
    },
    {
        title: "Thoát nước Siphonic - Nhà máy dệt may Regent",
        description: "Lắp đặt hệ thống thoát nước mưa cho xưởng may quy mô 5000 công nhân.",
        location: "KCN Lai Cách, Hải Dương",
        client: "Tập đoàn Crystal",
        category: "Cơ điện",
        featured: false,
        images: ["https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80"]
    },
    {
        title: "Cung cấp van và phụ kiện M&E - Dự án Metro số 1",
        description: "Cung cấp các loại van công nghiệp và thiết bị phụ trợ cho các nhà ga ngầm.",
        location: "TP.HCM",
        client: "Liên danh NJPT",
        category: "Cơ điện",
        featured: true,
        images: ["https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?w=800&q=80"]
    }
];

async function seed() {
    console.log('🧹 Cleaning up old project samples...');
    const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .ilike('client', '%LEGO%') // Cleanup based on one of our unique clients or similar logic

    // Actually, let's just delete all and re-seed 20 since it's a small number
    const { error: clearError } = await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    if (clearError) {
        console.error('❌ Error cleaning up:', clearError.message);
    } else {
        console.log('✅ Cleaned up existing projects');
    }

    const dataToInsert = projects.map(p => ({
        ...p,
        slug: generateSlug(p.title) + '-' + Math.random().toString(36).substring(2, 6),
        completion_date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
        technical_details: `Quy mô: ${Math.floor(Math.random() * 50000) + 5000} m2. Thiết bị chủ đạo: Siphonet M&E Solutions.`,
    }));

    console.log(`🚀 Seeding ${dataToInsert.length} projects...`);

    const { data, error } = await supabase.from('projects').insert(dataToInsert);

    if (error) {
        console.error('❌ Error inserting projects:', error.message);
    } else {
        console.log('✨ Seeding completed successfully!');
    }
}

seed();
