# Kế hoạch sửa lỗi Đăng nhập Admin (401 Unauthorized)

Lỗi xảy ra do thông tin trong file `.env.local` đang bị **trộn lẫn** giữa Project cũ và Project mới.

## Vấn đề hiện tại:
- `SUPABASE_URL`: Đang dùng ID mới (`akjkqovidwghxofresso`).
- `SERVICE_ROLE_KEY`: Đang dùng của ID cũ (`lchpcrquxjcnpubjqlof`).
- `DATABASE_URL`: Đang dùng của ID cũ (`lchpcrquxjcnpubjqlof`).

Vì API sử dụng đồng thời các biến này, việc lệch nhau khiến hệ thống không thể xác thực tài khoản.

## Các bước thực hiện:

1.  **Cập nhật Service Role Key mới**: Lấy từ Supabase Dashboard của project mới.
2.  **Cập nhật DATABASE_URL mới**: Sử dụng đúng host và project ref của project mới.
3.  **Đồng bộ hóa JWT Secret**: Đảm bảo sử dụng secret thống nhất.
4.  **Chạy lại script tạo Admin**: Đảm bảo tài khoản tồn tại trong đúng database.

## Chi tiết các biến cần cập nhật trong `.env.local`:

Bạn hãy mở file `.env.local` và thay thế bằng các giá trị sau (Lưu ý lấy từ Dashboard Supabase):

```env
# 1. Supabase URL & Keys (Lấy từ Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://akjkqovidwghxofresso.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_CObHO6gcZ20CNJr64J7utA_iBqfyaBo
SUPABASE_SERVICE_ROLE_KEY=[HÃY_DÁN_SERVICE_ROLE_KEY_MỚI_VÀO_ĐÂY]

# 2. Database Connection (Lấy từ Settings -> Database -> Connection String -> Session Pooler)
# Format đúng: postgresql://postgres.akjkqovidwghxofresso:[PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
DATABASE_URL=[HÃY_DÁN_DATABASE_URL_MỚI_VÀO_ĐÂY]

# 3. Auth
JWT_SECRET_KEY=super-secret-key-siphonet-2024-secure-v1
```

---
**Sau khi bạn cập nhật file `.env.local`, hãy báo cho tôi để tôi chạy lệnh tạo tài khoản admin cuối cùng!**
