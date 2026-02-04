-- 1. Table for Settings (Key-Value store)
CREATE TABLE IF NOT EXISTS settings (
    key VARCHAR(255) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed initial settings
INSERT INTO settings (key, value, description)
VALUES 
    ('site_info', '{"title": "Siphonet", "description": "Thiết bị Cơ Điện & Xử Lý Nước", "email": "contact@siphonet.com", "phone": "0123456789", "address": "TP.HCM"}'::jsonb, 'Thông tin chung của website'),
    ('seo', '{"meta_title": "", "meta_description": "", "keywords": ""}'::jsonb, 'Cấu hình SEO mặc định'),
    ('analytics', '{"google_analytics_id": "", "google_console_id": "", "facebook_pixel": ""}'::jsonb, 'Mã theo dõi bên thứ 3'),
    ('social', '{"facebook": "", "zalo": "", "youtube": ""}'::jsonb, 'Liên kết mạng xã hội')
ON CONFLICT (key) DO NOTHING;

-- 2. Table for Blog Posts
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    image TEXT,
    status TEXT DEFAULT 'draft', -- draft, published
    featured BOOLEAN DEFAULT false,
    author_id UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS posts_slug_idx ON posts(slug);

-- 3. Table for Static Pages (About, Contact, Policy...)
CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content TEXT,
    status TEXT DEFAULT 'published',
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS pages_slug_idx ON pages(slug);

-- 4. Update Categories table to differentiate between Product categories and Post categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'product'; -- 'product' or 'post'

-- 5. Enable Storage Policies for 'public' bucket if we create one for generic uploads
-- (Assuming 'products' bucket handles images for now, we might want a 'general' bucket later)
