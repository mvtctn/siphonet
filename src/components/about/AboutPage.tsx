import { CheckCircle, Users, Award, Target } from 'lucide-react'
import Image from 'next/image'

interface AboutPageProps {
    initialData?: any
}

export function AboutPage({ initialData }: AboutPageProps) {
    // If we have dynamic content from database, render it
    if (initialData?.layout?.body) {
        return (
            <div
                className="min-h-screen bg-white"
                dangerouslySetInnerHTML={{ __html: initialData.layout.body }}
            />
        )
    }

    // Fallback to hardcoded content
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <section className="bg-primary text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-5xl font-bold mb-6">Giới thiệu Siphonet</h1>
                        <p className="text-xl text-slate-200">
                            Chuyên gia hàng đầu về thiết bị cơ điện và xử lý nước tại Việt Nam
                        </p>
                    </div>
                </div>
            </section>

            {/* Company Overview */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
                        <div>
                            <h2 className="text-3xl font-bold text-primary mb-6">Về chúng tôi</h2>
                            <div className="space-y-4 text-slate-600">
                                <p>
                                    <strong className="text-primary">Siphonet JSC</strong> là công ty chuyên cung cấp
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
                        <div className="relative h-96 rounded-xl overflow-hidden shadow-xl">
                            <Image
                                src="/about-hero.jpg"
                                alt="Siphonet Team"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        <div className="bg-white p-8 rounded-xl shadow-md">
                            <Target className="h-12 w-12 text-accent mb-4" />
                            <h3 className="text-2xl font-bold text-primary mb-4">Sứ mệnh</h3>
                            <p className="text-slate-600">
                                Mang đến các giải pháp công nghệ tiên tiến trong lĩnh vực cơ điện và xử lý nước,
                                góp phần nâng cao chất lượng cuộc sống và bảo vệ môi trường Việt Nam.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-md">
                            <Award className="h-12 w-12 text-accent mb-4" />
                            <h3 className="text-2xl font-bold text-primary mb-4">Tầm nhìn</h3>
                            <p className="text-slate-600">
                                Trở thành công ty hàng đầu trong lĩnh vực cung cấp thiết bị và giải pháp
                                M&E tại Việt Nam, được khách hàng tin tưởng và đối tác quốc tế công nhận.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-primary mb-4">Giá trị cốt lõi</h2>
                        <p className="text-lg text-slate-600">
                            Những giá trị định hướng mọi hoạt động của Siphonet
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {[
                            {
                                title: 'Chất lượng',
                                description: 'Cam kết cung cấp sản phẩm và dịch vụ chất lượng cao nhất'
                            },
                            {
                                title: 'Chuyên nghiệp',
                                description: 'Đội ngũ kỹ thuật viên được đào tạo bài bản và chuyên sâu'
                            },
                            {
                                title: 'Uy tín',
                                description: 'Xây dựng niềm tin qua từng dự án và cam kết thực hiện'
                            },
                            {
                                title: 'Đổi mới',
                                description: 'Không ngừng cập nhật công nghệ và phương pháp tiên tiến'
                            }
                        ].map((value, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
                            >
                                <CheckCircle className="h-12 w-12 text-accent mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-primary mb-3">{value.title}</h3>
                                <p className="text-slate-600">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Users className="h-16 w-16 text-accent mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-primary mb-4">Đội ngũ chuyên gia</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Hơn 50 kỹ sư và chuyên gia giàu kinh nghiệm trong lĩnh vực M&E và xử lý nước,
                            sẵn sàng tư vấn và hỗ trợ mọi dự án của bạn.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
