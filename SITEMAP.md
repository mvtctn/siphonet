# Siphonet Website - Sitemap & Architecture

Sơ đồ cấu trúc trang web và luồng dữ liệu của hệ thống Siphonet.

## 1. 🗺️ Website Structure (Public)

```mermaid
graph TD
    Home["🏠 Trang chủ (/)"] --> Products["📦 Sản phẩm (/san-pham)"]
    Home --> Projects["🏗️ Dự án (/du-an)"]
    Home --> Services["🛠️ Dịch vụ (/dich-vu)"]
    Home --> Blog["📰 Tin tức (/tin-tuc)"]
    Home --> Contact["📞 Liên hệ (/lien-he)"]
    
    Products --> ProductCategory["🏷️ Danh mục (/san-pham/danh-muc/[slug])"]
    Products --> ProductDetail["📄 Chi tiết sản phẩm (/san-pham/[slug])"]
    ProductCategory --> ProductDetail
    
    Projects --> ProjectDetail["📄 Chi tiết dự án (/[slug])"]
    Blog --> BlogDetail["📄 Chi tiết bài viết (/[slug])"]
    
    ProductDetail --> Cart["🛒 Giỏ hàng (/gio-hang)"]
    Cart --> Checkout["💳 Thanh toán (/dat-hang)"]
```

## 2. 🔐 Admin Dashboard Structure

```mermaid
graph LR
    Admin["🔐 Admin (Protected)"] --> Dashboard["📊 Dashboard"]
    Admin --> Posts["📝 Quản lý Bài viết"]
    Admin --> Prod["📦 Quản lý Sản phẩm"]
    Admin --> Cat["🏷️ Quản lý Danh mục"]
    Admin --> Menus["🔗 Quản lý Menu"]
    Admin --> Orders["🧾 Quản lý Đơn hàng (🚧)"]
    Admin --> Media["🖼️ Thư viện Media (🚧)"]
```

## 3. 💾 Data Flow & Infrastructure

```mermaid
sequenceDiagram
    participant User as 🌐 Người dùng
    participant NextJS as 🚀 Next.js 15
    participant Supabase as ⚡ Supabase (DB/Auth/Storage)
    participant PayOS as 💳 PayOS (Payment)

    User->>NextJS: Truy cập & Tương tác
    NextJS->>Supabase: Query Data (Drizzle/REST)
    Supabase-->>NextJS: Trả về JSON Data
    NextJS-->>User: Render Giao diện (RSC/Client)
    
    User->>NextJS: Đặt hàng & Thanh toán
    NextJS->>PayOS: Tạo Link thanh toán
    PayOS-->>User: Hiển thị VietQR
    PayOS->>NextJS: Webhook xác nhận (🚧)
```

## 4. 📁 Directory Map

- `/src/app`: Routes & Pages (App Router)
- `/src/components`: UI Components (Shadcn/ui, Layout, Sections)
- `/src/lib`: Logic, Utils, Supabase Client, PayOS config
- `/src/db`: Drizzle Schema & Types
- `/public`: Static Assets (Images, Icons)
- `/scripts`: Seed data & system utilities
