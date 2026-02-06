# Siphonet Website - Project Roadmap & Progress Report

**Ngày cập nhật:** 06/02/2026

## 1. 📊 Trạng thái dự án hiện tại (Current Status)

Dự án đã hoàn thiện khung giao diện chính và kết nối cơ sở dữ liệu cho các tính năng cơ bản. Hiện đang ở giai đoạn hoàn thiện hệ thống quản trị và tích hợp thanh toán.

### ✅ Đã hoàn thành (Completed)
- **Hạ tầng**: Next.js 15, Supabase, Tailwind CSS, i18n setup.
- **Frontend**: Full 10+ trang công cộng (Trang chủ, Sản phẩm, Dự án, Dịch vụ, Tin tức, Liên hệ, Giỏ hàng).
- **Admin Dashboard**: Quản lý Bài viết, Sản phẩm, Danh mục, Menu, Hệ thống Auth bảo mật.
- **Database**: Schema hoàn chỉnh, đã seed dữ liệu thực tế (50+ sản phẩm, 20+ dự án).
- **Tính năng**: Lọc sản phẩm, tìm kiếm, giỏ hàng (State management với Zustand).

### 🚧 Đang thực hiện (In Progress)
- **Thanh toán**: Tích hợp PayOS (VietQR) và quy trình Checkout hoàn chỉnh.
- **Quản lý Media**: Upload hình ảnh trực tiếp từ Admin lên Supabase Storage.
- **Đa ngôn ngữ**: Hoàn thiện dịch nội dung dynamic từ database.

---

## 2. 📅 Kế hoạch triển khai tiếp theo (Next Steps)

### Giai đoạn 1: Hoàn thiện tính năng cốt lõi (Core Completion)
- [ ] **Tích hợp PayOS**: Hoàn tất flow thanh toán và gửi email xác nhận.
- [ ] **Quản lý Đơn hàng**: Thêm trang quản lý đơn hàng trong Admin để xử lý/cập nhật trạng thái đơn hàng.
- [ ] **Hoàn thiện Media Library**: Cho phép chọn ảnh từ thư viện đã upload.

### Giai đoạn 2: Tối ưu hóa & SEO (Optimization & Marketing)
- [ ] **SEO Matrix**: Triển khai Metadata động, Sitemap tự động, và JSON-LD.
- [ ] **Performance**: Tối ưu hóa Image caching và áp dụng ISR (Incremental Static Regeneration).
- [ ] **Analytics**: Tích hợp Google Analytics và Search Console.

### Giai đoạn 3: Tính năng nâng cao (Advanced Features)
- [ ] **Customer Portal**: Đăng ký/Đăng nhập khách hàng, theo dõi đơn hàng và Wishlist.
- [ ] **Hệ thống Notification**: Tích hợp thông báo qua Email (Nodemailer/Resend) và Telegram Bot cho Admin.
- [ ] **Live Support**: Tích hợp nút Zalo/Messenger/Hotline nổi.

---

## 3. 🛠️ Đề xuất kỹ thuật (Technical Recommendations)
1. **Consolidate DB Layer**: Thống nhất việc sử dụng Drizzle ORM hoặc Supabase Client để code clean hơn (Hiện tại đang dùng cả hai).
2. **Error Tracking**: Cài đặt Sentry hoặc LogRocket để theo dõi lỗi runtime từ người dùng.
3. **Testing**: Viết Unit Test cho các logic tính toán giỏ hàng và thanh toán.
