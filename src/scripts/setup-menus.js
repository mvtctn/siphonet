const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.lchpcrquxjcnpubjqlof:OElrJOWdGaga8Ics@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres';
const sql = postgres(connectionString, { ssl: 'require' });

async function run() {
    try {
        console.log('Connecting to database...');
        await sql`SELECT 1`;
        console.log('Connected successfully!');

        console.log('Cleaning up old menus table...');
        await sql`DROP TABLE IF EXISTS menus`;

        console.log('Creating menus table...');
        await sql`
            CREATE TABLE IF NOT EXISTS menus (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(255) NOT NULL,
                location VARCHAR(50) NOT NULL UNIQUE,
                items JSONB NOT NULL DEFAULT '[]'::jsonb,
                active BOOLEAN NOT NULL DEFAULT true,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )
        `;

        console.log('Creating index on location...');
        await sql`CREATE INDEX IF NOT EXISTS idx_menus_location ON menus(location)`;

        console.log('Inserting default menus with initial items...');
        const defaultMenus = [
            {
                name: 'Header Menu',
                location: 'header',
                items: [
                    { id: '1', label: 'Trang chủ', url: '/', order: 0 },
                    { id: '2', label: 'Sản phẩm', url: '/san-pham', order: 1 },
                    { id: '3', label: 'Dự án', url: '/du-an', order: 2 },
                    { id: '4', label: 'Dịch vụ', url: '/dich-vu', order: 3 },
                    { id: '5', label: 'Tin tức', url: '/tin-tuc', order: 4 },
                    { id: '6', label: 'Giới thiệu', url: '/gioi-thieu', order: 5 },
                    { id: '7', label: 'Liên hệ', url: '/lien-he', order: 6 }
                ]
            },
            {
                name: 'Post Categories',
                location: 'post',
                items: [
                    { id: 'p1', label: 'Công ty', url: '/tin-tuc?category=Công ty', order: 0 },
                    { id: 'p2', label: 'Tuyển dụng', url: '/tin-tuc?category=Tuyển dụng', order: 1 },
                    { id: 'p3', label: 'Công nghệ', url: '/tin-tuc?category=Công nghệ', order: 2 },
                    { id: 'p4', label: 'Chuyên ngành', url: '/tin-tuc?category=Chuyên ngành', order: 3 },
                    { id: 'p5', label: 'Xã hội', url: '/tin-tuc?category=Xã hội', order: 4 }
                ]
            },
            {
                name: 'Sidebar Menu',
                location: 'side',
                items: []
            }
        ];

        for (const menu of defaultMenus) {
            await sql`
                INSERT INTO menus (name, location, items)
                VALUES (${menu.name}, ${menu.location}, ${JSON.stringify(menu.items)})
                ON CONFLICT (location) DO UPDATE SET items = EXCLUDED.items
            `;
        }

        console.log('Reloading PostgREST schema...');
        await sql`NOTIFY pgrst, 'reload schema'`;

        console.log('All operations completed successfully!');
    } catch (err) {
        console.error('ERROR during menus setup:', err);
    } finally {
        await sql.end();
    }
}

run();
