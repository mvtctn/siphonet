const postgres = require('postgres');
const connectionString = 'postgresql://postgres.lchpcrquxjcnpubjqlof:dAOJbTcSkABbGFHO@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';

async function run() {
    console.log('Using port 5432...');
    const sql = postgres(connectionString, { ssl: 'require' });
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS contacts (
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
        console.log('Table created!');
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await sql.end();
    }
}
run();
