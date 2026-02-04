const postgres = require('postgres');
const connectionString = 'postgresql://postgres.lchpcrquxjcnpubjqlof:dAOJbTcSkABbGFHO@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

async function setup() {
    const sql = postgres(connectionString);
    try {
        console.log('Task: Creating contacts table...');
        await sql`
            CREATE TABLE IF NOT EXISTS public.contacts (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                subject TEXT,
                message TEXT NOT NULL,
                status TEXT DEFAULT 'unread',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;
        console.log('Success: contacts table created.');

        console.log('Task: Creating settings table...');
        await sql`
            CREATE TABLE IF NOT EXISTS public.settings (
                key VARCHAR(255) PRIMARY KEY,
                value JSONB NOT NULL,
                description TEXT,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;
        console.log('Success: settings table created.');

        console.log('Task: Inserting default config...');
        await sql`
            INSERT INTO public.settings (key, value, description)
            VALUES ('email_config', '{"host": "", "port": 587, "user": "", "pass": "", "from_name": "Siphonet", "receive_email": ""}'::jsonb, 'Cấu hình gửi nhận Email SMTP')
            ON CONFLICT (key) DO NOTHING;
        `;
        console.log('Success: Default config inserted.');

        // Forcing a schema reload by doing a trivial DDL
        console.log('Task: Forcing schema reload...');
        await sql`COMMENT ON TABLE public.contacts IS 'Customer messages';`;
        console.log('Success: Schema reload triggered.');

    } catch (error) {
        console.error('FAILED:', error);
    } finally {
        await sql.end();
    }
}

setup();
