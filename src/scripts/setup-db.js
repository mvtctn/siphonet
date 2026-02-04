const postgres = require('postgres');
const sql = postgres('postgresql://postgres.fchpcrquxjcnpubjqlof:dAOJbTcSkABbGFHO@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres', { ssl: 'require' });

async function run() {
    try {
        console.log('Connecting to database...');
        await sql`SELECT 1`;
        console.log('Connected successfully!');

        console.log('Creating uuid-ossp extension...');
        await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        console.log('Creating contacts table...');
        await sql`
            CREATE TABLE IF NOT EXISTS contacts (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                subject TEXT,
                message TEXT NOT NULL,
                status TEXT DEFAULT 'unread',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )
        `;

        console.log('Creating settings table...');
        await sql`
            CREATE TABLE IF NOT EXISTS settings (
                key VARCHAR(255) PRIMARY KEY,
                value JSONB NOT NULL,
                description TEXT,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )
        `;

        console.log('Inserting default email config...');
        await sql`
            INSERT INTO settings (key, value, description)
            VALUES ('email_config', '{"host": "", "port": 587, "user": "", "pass": "", "from_name": "Siphonet", "receive_email": ""}'::jsonb, 'Cấu hình gửi nhận Email SMTP')
            ON CONFLICT (key) DO NOTHING
        `;

        console.log('Reloading PostgREST schema...');
        await sql`NOTIFY pgrst, 'reload schema'`;

        console.log('All operations completed successfully!');
    } catch (err) {
        console.error('ERROR during DB setup:', err);
    } finally {
        await sql.end();
    }
}

run();
