const postgres = require('postgres');

async function tryConnect(id) {
    const connectionString = `postgresql://postgres.${id}:dAOJbTcSkABbGFHO@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`;
    console.log(`Trying ID: ${id}...`);
    const sql = postgres(connectionString, { ssl: 'require', connect_timeout: 10 });
    try {
        await sql`SELECT 1`;
        console.log(`SUCCESS with ID: ${id}`);
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
        console.log('Table ensured.');
        return true;
    } catch (err) {
        console.error(`FAILED with ID: ${id} - ${err.message}`);
        return false;
    } finally {
        await sql.end();
    }
}

async function run() {
    if (await tryConnect('lchpcrquxjcnpubjqlof')) return;
    if (await tryConnect('fchpcrquxjcnpubjqlof')) return;
    if (await tryConnect('lchpcrquxjcnpubjqlof'.replace('l', 'f'))) return;
}

run();
