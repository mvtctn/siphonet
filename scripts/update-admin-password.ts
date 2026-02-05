import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateAdminPassword() {
    const email = 'admin@siphonet.com'
    const password = 'admin123'

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    console.log(`🔒 Hashing password for ${email}...`)

    // Upsert user (Create if missing, update if exists)
    const { data, error } = await supabase
        .from('admin_users')
        .upsert({
            email,
            password_hash: passwordHash,
            name: 'Siphonet Admin',
            role: 'admin',
            active: true
        }, { onConflict: 'email' })
        .select()

    if (error) {
        console.error('❌ Failed to update/create admin:', error)
        if (error.message.includes('Tenant or user not found')) {
            console.error('\n📢 PHÁT HIỆN LỖI KẾT NỐI: Cấu hình DATABASE_URL trong .env.local của bạn vẫn sai.')
            console.error('Hãy đảm bảo username trong DATABASE_URL là: postgres.lchpcrquxjcnpubjqlof')
        }
    } else {
        console.log('✅ Admin user processed successfully (Created or Updated)!')
        console.log('User Details:', data)
    }
}

updateAdminPassword()
