
const { createClient } = require('@supabase/supabase-js');

// These should ideally come from env, but matches existing seed script pattern
const supabaseUrl = 'https://lchpcrquxjcnpubjqlof.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjaHBjcnF1eGpjbnB1YmpxbG9mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE1MjI4MSwiZXhwIjoyMDg1NzI4MjgxfQ.FYy2gDaaXBrx54noxRY9gcwMp2YE_x2dPTioQs1-JYE';
const supabase = createClient(supabaseUrl, supabaseKey);

const aboutHtml = `
<div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="bg-[#003B5C] text-white py-20" style="background-color: #003B5C;">
        <div class="container mx-auto px-4">
            <div class="max-w-3xl mx-auto text-center">
                <h1 class="text-5xl font-bold mb-6">Giới thiệu Siphonet</h1>
                <p class="text-xl text-white/90">
                    Chuyên gia hàng đầu về thiết bị cơ điện và xử lý nước tại Việt Nam
                </p>
            </div>
        </div>
    </section>

    <!-- Company Overview -->
    <section class="py-16">
        <div class="container mx-auto px-4">
            <div class="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3rem;">
                <div>
                    <h2 class="text-3xl font-bold text-[#003B5C] mb-6" style="color: #003B5C;">Về chúng tôi</h2>
                    <div class="space-y-4 text-slate-600" style="display: flex; flex-direction: column; gap: 1rem;">
                        <p>
                            <strong class="text-[#003B5C]" style="color: #003B5C;">Siphonet JSC</strong> là công ty chuyên cung cấp
                            thiết bị M&E, hệ thống cấp thoát nước và xử lý nước cho các công trình
                            dân dụng và công nghiệp tại Việt Nam.
                        </p>
                        <p>
                            Với hơn 10 năm kinh nghiệm trong ngành, chúng tôi tự hào là đối tác tin cậy
                            của nhiều dự án lớn trên toàn quốc, mang đến các giải pháp công nghệ hiện đại
                            và dịch vụ chuyên nghiệp.
                        </p>
                        <p>
                            Đội ngũ kỹ sư và chuyên gia của Siphonet luôn sẵn sàng tư vấn, thiết kế và
                            triển khai các hệ thống tối ưu nhất cho mọi nhu cầu của khách hàng.
                        </p>
                    </div>
                </div>
                <div class="relative h-96 rounded-xl overflow-hidden shadow-xl" style="position: relative; height: 24rem; overflow: hidden; border-radius: 0.75rem; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);">
                    <img
                        src="/about-hero.jpg"
                        alt="Siphonet Team"
                        style="width: 100%; height: 100%; object-fit: cover;"
                    />
                </div>
            </div>
        </div>
    </section>

    <!-- Mission & Vision -->
    <section class="py-16 bg-slate-50" style="background-color: #f8fafc;">
        <div class="container mx-auto px-4">
            <div class="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                <div class="bg-white p-8 rounded-xl shadow-md" style="background: white; padding: 2rem; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                    <h3 class="text-2xl font-bold text-[#003B5C] mb-4" style="color: #003B5C;">Sứ mệnh</h3>
                    <p class="text-slate-600">
                        Mang đến các giải pháp công nghệ tiên tiến trong lĩnh vực cơ điện và xử lý nước,
                        góp phần nâng cao chất lượng cuộc sống và bảo vệ môi trường Việt Nam.
                    </p>
                </div>
                <div class="bg-white p-8 rounded-xl shadow-md" style="background: white; padding: 2rem; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                    <h3 class="text-2xl font-bold text-[#003B5C] mb-4" style="color: #003B5C;">Tầm nhìn</h3>
                    <p class="text-slate-600">
                        Trở thành công ty hàng đầu trong lĩnh vực cung cấp thiết bị và giải pháp
                        M&E tại Việt Nam, được khách hàng tin tưởng và đối tác quốc tế công nhận.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Core Values -->
    <section class="py-16">
        <div class="container mx-auto px-4">
            <div class="text-center mb-12" style="text-align: center; margin-bottom: 3rem;">
                <h2 class="text-3xl font-bold text-[#003B5C] mb-4" style="color: #003B5C;">Giá trị cốt lõi</h2>
                <p class="text-lg text-slate-600">
                    Những giá trị định hướng mọi hoạt động của Siphonet
                </p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
                <div class="bg-white p-6 rounded-xl shadow-md text-center" style="background: white; padding: 1.5rem; border-radius: 0.75rem; text-align: center; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                    <h3 class="text-xl font-bold text-[#003B5C] mb-3" style="color: #003B5C;">Chất lượng</h3>
                    <p class="text-slate-600">Cam kết cung cấp sản phẩm và dịch vụ chất lượng cao nhất</p>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-md text-center" style="background: white; padding: 1.5rem; border-radius: 0.75rem; text-align: center; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                    <h3 class="text-xl font-bold text-[#003B5C] mb-3" style="color: #003B5C;">Chuyên nghiệp</h3>
                    <p class="text-slate-600">Đội ngũ kỹ thuật viên được đào tạo bài bản và chuyên sâu</p>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-md text-center" style="background: white; padding: 1.5rem; border-radius: 0.75rem; text-align: center; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                    <h3 class="text-xl font-bold text-[#003B5C] mb-3" style="color: #003B5C;">Uy tín</h3>
                    <p class="text-slate-600">Xây dựng niềm tin qua từng dự án và cam kết thực hiện</p>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-md text-center" style="background: white; padding: 1.5rem; border-radius: 0.75rem; text-align: center; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                    <h3 class="text-xl font-bold text-[#003B5C] mb-3" style="color: #003B5C;">Đổi mới</h3>
                    <p class="text-slate-600">Không ngừng cập nhật công nghệ và phương pháp tiên tiến</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Team Section -->
    <section class="py-16 bg-slate-50" style="background-color: #f8fafc;">
        <div class="container mx-auto px-4">
            <div class="text-center mb-12" style="text-align: center;">
                <h2 class="text-3xl font-bold text-[#003B5C] mb-4" style="color: #003B5C;">Đội ngũ chuyên gia</h2>
                <p class="text-lg text-slate-600 max-w-2xl mx-auto" style="max-width: 42rem; margin-left: auto; margin-right: auto;">
                    Hơn 50 kỹ sư và chuyên gia giàu kinh nghiệm trong lĩnh vực M&E và xử lý nước,
                    sẵn sàng tư vấn và hỗ trợ mọi dự án của bạn.
                </p>
            </div>
        </div>
    </section>
</div>
`;

async function update() {
    console.log('🚀 Updating About page content...');

    const { data: existing, error: fetchError } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'gioi-thieu')
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('❌ Error fetching page:', fetchError.message);
        return;
    }

    const existingImages = existing?.layout?.images || ['/about-hero.jpg'];
    const currentImage = existingImages[0];
    const finalHtml = aboutHtml.replace('/about-hero.jpg', currentImage);

    const pageData = {
        title: 'Giới thiệu',
        slug: 'gioi-thieu',
        layout: {
            body: finalHtml,
            images: existingImages
        },
        status: 'published',
        meta_title: 'Giới thiệu Siphonet - Giải pháp Cơ Điện & Xử Lý Nước',
        meta_description: 'Tìm hiểu về Siphonet JSC, hơn 10 năm kinh nghiệm trong lĩnh vực M&E, cấp thoát nước và xử lý nước tại Việt Nam.'
    };

    if (existing) {
        const { error } = await supabase
            .from('pages')
            .update(pageData)
            .eq('id', existing.id);

        if (error) console.error('❌ Error updating page:', error.message);
        else console.log('✅ About page updated successfully!');
    } else {
        const { error } = await supabase
            .from('pages')
            .insert(pageData);

        if (error) console.error('❌ Error creating page:', error.message);
        else console.log('✅ About page created successfully!');
    }
}

update();
