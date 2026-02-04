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

    // Update user
    const { data, error } = await supabase
        .from('admin_users')
        .update({ password_hash: passwordHash })
        .eq('email', email)
        .select()

    if (error) {
        console.error('❌ Failed to update password:', error)
    } else {
        console.log('✅ Password updated successfully!')
        console.log('New Admin User:', data)
    }
}

updateAdminPassword()
