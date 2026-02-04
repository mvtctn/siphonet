# Supabase Database Setup Guide

## 📋 Mục lục
1. [Tạo Project Supabase](#1-tạo-project-supabase)
2. [Chạy Migration](#2-chạy-migration)
3. [Seed Data](#3-seed-data)
4. [Cấu hình Environment Variables](#4-cấu-hình-environment-variables)
5. [Kết nối Database](#5-kết-nối-database)

---

## 1. Tạo Project Supabase

### Bước 1: Tạo tài khoản
1. Truy cập [https://supabase.com](https://supabase.com)
2. Đăng ký tài khoản miễn phí (có thể dùng GitHub)

### Bước 2: Tạo Project mới
1. Click "New Project"
2. Điền thông tin:
   - **Name**: siphonet-database (hoặc tên bạn muốn)
   - **Database Password**: Tạo mật khẩu mạnh và lưu lại
   - **Region**: Southeast Asia (Singapore) - gần Việt Nam nhất
   - **Pricing Plan**: Free (đủ cho development)
3. Click "Create new project"
4. Đợi 2-3 phút để Supabase khởi tạo database

---

## 2. Chạy Migration

### Option A: Qua Supabase Dashboard (Khuyến nghị cho lần đầu)

1. Vào project vừa tạo
2. Click "SQL Editor" trong sidebar bên trái
3. Click "New Query"
4. Copy toàn bộ nội dung file `supabase/migrations/001_initial_schema.sql`
5. Paste vào SQL Editor
6. Click "Run" (hoặc Ctrl+Enter)
7. Kiểm tra kết quả: Nếu thành công sẽ thấy "Success. No rows returned"

### Option B: Qua CLI (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

---

## 3. Seed Data

### Chạy Seed Script

1. Vào "SQL Editor" trong Supabase Dashboard
2. Click "New Query"
3. Copy toàn bộ nội dung file `supabase/seed.sql`
4. Paste và click "Run"
5. Kiểm tra data:
   - Click "Table Editor" trong sidebar
   - Chọn table `categories` - Sẽ thấy 3 categories
   - Chọn table `products` - Sẽ thấy 3 products mẫu

---

## 4. Cấu hình Environment Variables

### Lấy API Keys

1. Trong Supabase Dashboard, click Settings (biểu tượng ⚙️)
2. Click "API" trong sidebar
3. Copy các thông tin sau:

#### Project URL
```
URL: https://xxxxxxxxxxx.supabase.co
```

#### API Keys
- **anon/public key**: Dùng cho client-side
- **service_role key**: Dùng cho server-side (GIỮ BÍ MẬT!)

### Tạo file .env.local

1. Trong folder project, tạo file `.env.local`
2. Copy nội dung từ `.env.example`
3. Điền thông tin từ Supabase:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database Connection String (for Drizzle migrations)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project-id.supabase.co:5432/postgres
```

**Lưu ý**: Replace `[YOUR-PASSWORD]` với database password bạn đã tạo ở bước 1.

### Lấy Database Connection String

1. Trong Settings → Database
2. Scroll xuống phần "Connection string"
3. Chọn tab "URI"
4. Copy string và replace `[YOUR-PASSWORD]`

---

## 5. Kết nối Database

### Test Connection

```bash
# Install dependencies
pnpm install

# Test connection
pnpm db:studio
```

### Verify Tables

1. Vào Supabase Dashboard → Table Editor
2. Kiểm tra các tables đã được tạo:
   - ✅ categories
   - ✅ products
   - ✅ projects
   - ✅ services
   - ✅ posts
   - ✅ orders
   - ✅ pages
   - ✅ reviews
   - ✅ faqs
   - ✅ team_members
   - ✅ testimonials
   - ✅ quote_requests
   - ✅ admin_users

---

## 📊 Database Schema Overview

### Core Tables

#### **categories**
- Danh mục sản phẩm
- Support parent-child relationship (categories con)

#### **products**
- Sản phẩm với thông số kỹ thuật (JSONB)
- Liên kết với categories
- Hỗ trợ SEO metadata

#### **orders**
- Đơn hàng từ khách hàng
- Tích hợp PayOS payment gateway
- Order tracking status

#### **quote_requests**
- Yêu cầu báo giá từ form
- Status tracking cho sales team

#### **reviews**
- Đánh giá sản phẩm từ khách hàng
- Moderation workflow

---

## ⚠️ Important Notes

1. **Keep service_role key SECRET** - Không commit vào Git
2. **Database Password** - Lưu ở nơi an toàn
3. **Free Tier Limits**:
   - 500 MB database storage
   - 1 GB file storage
   - 50,000 monthly active users
4. **Backups**: Supabase auto-backup daily (keep 7 days on free tier)

---

**Happy coding! 🎉**
