import postgres from 'postgres'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function main() {
    const sql = postgres(process.env.DATABASE_URL!)
    const data = await sql`SELECT * FROM menus WHERE location = 'header'`
    const menu = data[0]
    console.log('Menu Location:', menu.location)
    console.log('Menu Style:', menu.style)
    console.log('Total Items:', menu.items.length)

    const itemsWithParent = menu.items.filter((i: any) => i.parentId)
    console.log('Items with parentId:', JSON.stringify(itemsWithParent, null, 2))

    console.log('All Items Sample (First 5):')
    console.log(JSON.stringify(menu.items.slice(0, 5), null, 2))

    await sql.end()
}

main()
