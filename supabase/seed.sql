-- Seed Categories
INSERT INTO categories (name, slug, description, icon) VALUES
('Thiết bị Cơ Điện', 'thiet-bi-co-dien', 'Biến tần, van điện từ, thiết bị cơ điện M&E', 'Zap'),
('Thiết bị Cấp Nước', 'thiet-bi-cap-nuoc', 'Bơm ly tâm, máy bơm công nghiệp, thiết bị cấp nước', 'Droplet'),
('Thiết bị Xử Lý Nước', 'thiet-bi-xu-ly-nuoc', 'Hệ thống RO, thiết bị lọc nước, xử lý nước thải', 'Waves')
ON CONFLICT (slug) DO NOTHING;

-- Seed Sample Products
WITH category_ids AS (
    SELECT id, slug FROM categories
)
INSERT INTO products (
    name, 
    slug, 
    description, 
    technical_specifications,
    price, 
    stock, 
    sku, 
    category_id,
    images,
    featured,
    status
)
SELECT 
    'Bơm ly tâm Grundfos CR3-36',
    'bom-ly-tam-grundfos-cr3-36',
    'Bơm ly tâm trục đứng Grundfos CR3-36 - Hàng chính hãng nhập khẩu từ Đan Mạch. Thiết kế compact, hiệu suất cao, phù hợp cho các công trình dân dụng và công nghiệp nhỏ.',
    '[
        {"parameter": "Lưu lượng", "value": "3", "unit": "m³/h"},
        {"parameter": "Cột áp", "value": "36", "unit": "m"},
        {"parameter": "Công suất", "value": "1.5", "unit": "kW"},
        {"parameter": "Điện áp", "value": "380", "unit": "V"}
    ]'::jsonb,
    15500000,
    5,
    'GRF-CR3-36',
    (SELECT id FROM category_ids WHERE slug = 'thiet-bi-cap-nuoc'),
    '[]'::jsonb,
    true,
    'published'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'bom-ly-tam-grundfos-cr3-36');

INSERT INTO products (
    name, 
    slug, 
    description, 
    technical_specifications,
    price, 
    stock, 
    sku, 
    category_id,
    images,
    featured,
    status
)
SELECT 
    'Hệ thống RO công nghiệp 500L/h',
    'he-thong-ro-cong-nghiep-500l',
    'Hệ thống lọc nước RO công nghiệp công suất 500 lít/giờ. Màng lọc RO Filmtec USA, khung inox 304, bảng điều khiển tự động. Phù hợp cho nhà máy, khách sạn, bệnh viện.',
    '[
        {"parameter": "Công suất", "value": "500", "unit": "L/h"},
        {"parameter": "Số màng RO", "value": "2", "unit": "cây"},
        {"parameter": "Áp lực hoạt động", "value": "3-8", "unit": "bar"},
        {"parameter": "Tỷ lệ thu hồi", "value": "60", "unit": "%"}
    ]'::jsonb,
    45000000,
    2,
    'RO-500L-IND',
    (SELECT id FROM category_ids WHERE slug = 'thiet-bi-xu-ly-nuoc'),
    '[]'::jsonb,
    true,
    'published'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'he-thong-ro-cong-nghiep-500l');

INSERT INTO products (
    name, 
    slug, 
    description, 
    technical_specifications,
    price, 
    stock, 
    sku, 
    category_id,
    images,
    featured,
    status
)
SELECT 
    'Bơm nước thải Ebara 3M 32-160',
    'bom-nuoc-thai-ebara-3m-32-160',
    'Bơm nước thải Ebara 3M 32-160 - Thiết kế chịu được chất thải có tạp chất. Vỏ gang chất lượng cao, trục inox 304. Phù hợp cho hệ thống thoát nước, xử lý nước thải.',
    '[
        {"parameter": "Lưu lượng", "value": "32", "unit": "m³/h"},
        {"parameter": "Cột áp", "value": "20", "unit": "m"},
        {"parameter": "Công suất", "value": "0.75", "unit": "kW"}
    ]'::jsonb,
    8900000,
    10,
    'EBR-3M32-160',
    (SELECT id FROM category_ids WHERE slug = 'thiet-bi-cap-nuoc'),
    '[]'::jsonb,
    true,
    'published'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'bom-nuoc-thai-ebara-3m-32-160');

-- Seed Admin User (password: admin123)
-- Note: In production, use proper bcrypt hash
INSERT INTO admin_users (email, password_hash, name, role)
VALUES (
    'admin@siphonet.com',
    '$2a$10$YourBcryptHashHere', -- Replace with actual bcrypt hash
    'Administrator',
    'admin'
)
ON CONFLICT (email) DO NOTHING;

-- Seed Services
INSERT INTO services (title, slug, description, icon, features, "order") VALUES
(
    'Tư vấn thiết kế M&E',
    'tu-van-thiet-ke-me',
    'Tư vấn và thiết kế hệ thống cơ điện M&E chuyên nghiệp cho công trình dân dụng và công nghiệp',
    'Lightbulb',
    '["Thiết kế chi tiết hệ thống", "Tính toán kỹ thuật chính xác", "Tối ưu chi phí đầu tư", "Đội ngũ kỹ sư giàu kinh nghiệm"]'::jsonb,
    1
),
(
    'Lắp đặt hệ thống',
    'lap-dat-he-thong',
    'Thi công lắp đặt hệ thống cấp thoát nước và xử lý nước theo tiêu chuẩn quốc tế',
    'Wrench',
    '["Thi công chuyên nghiệp", "Giám sát kỹ thuật 24/7", "Bảo hành dài hạn", "Nghiệm thu theo quy chuẩn"]'::jsonb,
    2
),
(
    'Vận hành & Bảo trì',
    'van-hanh-bao-tri',
    'Dịch vụ vận hành và bảo trì hệ thống định kỳ, đảm bảo hoạt động ổn định lâu dài',
    'Settings',
    '["Bảo trì định kỳ", "Sửa chữa khẩn cấp 24/7", "Đội ngũ kỹ thuật chuyên nghiệp", "Chi phí hợp lý"]'::jsonb,
    3
)
ON CONFLICT (slug) DO NOTHING;

-- Seed FAQs
INSERT INTO faqs (question, answer, category, "order", featured) VALUES
(
    'Siphonet cung cấp những loại thiết bị nào?',
    'Siphonet chuyên cung cấp thiết bị cơ điện M&E, hệ thống cấp thoát nước và xử lý nước từ các thương hiệu hàng đầu như Grundfos, Ebara, Schneider Electric, ASCO, và nhiều nhãn hiệu uy tín khác.',
    'General',
    1,
    true
),
(
    'Thời gian giao hàng là bao lâu?',
    'Thời gian giao hàng phụ thuộc vào sản phẩm và địa điểm. Thông thường, hàng có sẵn sẽ được giao trong 2-3 ngày. Hàng đặt theo yêu cầu có thể mất 2-4 tuần tùy nhà cung cấp.',
    'Delivery',
    2,
    true
),
(
    'Sản phẩm có được bảo hành không?',
    'Tất cả sản phẩm chính hãng đều được bảo hành từ 12-36 tháng tùy theo từng loại thiết bị. Chúng tôi cam kết hỗ trợ bảo hành nhanh chóng theo chính sách của nhà sản xuất.',
    'Products',
    3,
    true
)
ON CONFLICT DO NOTHING;
