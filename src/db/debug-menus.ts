import postgres from 'postgres'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function main() {
    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL is not set')
        process.exit(1)
    }

    const sql = postgres(process.env.DATABASE_URL)

    try {
        const menus = await sql`SELECT * FROM menus`
        console.log('--- MENUS DATA ---')
        menus.forEach(menu => {
            console.log(`ID: ${menu.id}`)
            console.log(`Name: ${menu.name}`)
            console.log(`Location: ${menu.location}`)
            console.log(`Items type: ${typeof menu.items}`)
            console.log(`Items: ${JSON.stringify(menu.items, null, 2)}`)
            console.log('------------------')
        })
    } catch (error) {
        console.error('Error fetching menus:', error)
    } finally {
        await sql.end()
    }
}

main()
