# Siphonet Website - Supabase Setup Guide

## Bước 1: Tạo Supabase Project

1. Truy cập https://supabase.com
2. Đăng nhập hoặc tạo tài khoản mới
3. Click "New Project"
4. Điền thông tin:
   - **Project Name**: `siphonet-website`
   - **Database Password**: Tạo password mạnh (lưu lại!)
   - **Region**: Singapore (gần Việt Nam nhất)
   - **Pricing Plan**: Free (đủ cho start-up)

## Bước 2: Lấy Database Connection String

1. Trong project dashboard, vào **Settings** → **Database**
2. Tìm section "Connection string"
3. Chọn "URI" tab
4. Copy connection string, format:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
5. Thay `[YOUR-PASSWORD]` bằng password bạn đã tạo
6. Paste vào file `.env` với key `DATABASE_URL`

## Bước 3: Lấy Supabase API Keys

1. Vào **Settings** → **API**
2. Copy 2 keys sau:
   - **Project URL**: `https://[PROJECT-REF].supabase.co`
   - **anon/public key**: Key dài bắt đầu bằng `eyJ...`

3. Thêm vào file `.env`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

## Bước 4: Tạo Storage Bucket cho Images

1. Trong dashboard, vào **Storage**
2. Click "Create a new bucket"
3. Tạo các buckets:
   - **Name**: `products` (cho ảnh sản phẩm)
   - **Public**: ✅ Checked
   - Click "Save"
   
4. Lặp lại cho:
   - `projects` (ảnh dự án)
   - `posts` (ảnh blog)
   - `team` (ảnh team members)

## Bước 5: Cấu hình Row Level Security (RLS)

### Cho Public Buckets (products, projects, posts, team):

1. Vào **Storage** → chọn bucket → **Policies**
2. Click "New Policy"
3. Tạo policy "Public Read Access":
   ```sql
   -- Policy Name: Public Read Access
   -- Allowed operation: SELECT
   
   CREATE POLICY "Public can read" 
   ON storage.objects FOR SELECT 
   USING (bucket_id = 'products');
   ```

4. Tạo policy "Authenticated Upload":
   ```sql
   -- Policy Name: Authenticated users can upload
   -- Allowed operation: INSERT
   
   CREATE POLICY "Auth users can upload" 
   ON storage.objects FOR INSERT 
   WITH CHECK (
     bucket_id = 'products' 
     AND auth.role() = 'authenticated'
   );
   ```

5. Lặp lại cho các buckets khác

## Bước 6: Test Connection

Tạo file test `test-supabase.js`:

```javascript
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  const { data, error } = await supabase
    .from('_supabase_migrations')
    .select('*')
    .limit(1)
  
  if (error) {
    console.error('❌ Connection failed:', error)
  } else {
    console.log('✅ Supabase connected successfully!')
  }
}

testConnection()
```

Chạy: `node test-supabase.js`

## Bước 7: File `.env` Hoàn chỉnh

Tạo file `.env` (copy từ `.env.example`):

```bash
# Supabase
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Payload CMS
PAYLOAD_SECRET=your-super-secret-32-char-minimum
PAYLOAD_ADMIN_EMAIL=admin@siphonet.com
PAYLOAD_ADMIN_PASSWORD=your-strong-password

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# PayOS (điền sau)
PAYOS_CLIENT_ID=
PAYOS_API_KEY=
PAYOS_CHECKSUM_KEY=

# Email (điền sau)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
```

## ✅ Checklist

- [ ] Đã tạo Supabase project
- [ ] Đã copy DATABASE_URL vào .env
- [ ] Đã copy SUPABASE_URL và ANON_KEY vào .env
- [ ] Đã tạo 4 storage buckets (products, projects, posts, team)
- [ ] Đã cấu hình RLS policies cho public read
- [ ] Đã test connection thành công

## 🎯 Tiếp theo

Sau khi setup xong, quay lại terminal và chạy:

```bash
pnpm run dev
```

Truy cập http://localhost:3000 để xem website!

Dashboard Payload CMS sẽ ở: http://localhost:3000/admin
