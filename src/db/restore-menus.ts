import postgres from 'postgres'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function main() {
    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL is not set')
        process.exit(1)
    }

    const sql = postgres(process.env.DATABASE_URL)

    const defaultItems = [
        { id: '1', label: 'Trang chủ', url: '/', order: 0 },
        { id: '2', label: 'Sản phẩm', url: '/san-pham', order: 1 },
        { id: '3', label: 'Dự án', url: '/du-an', order: 2 },
        { id: '4', label: 'Dịch vụ', url: '/dich-vu', order: 3 },
        { id: '5', label: 'Tin tức', url: '/tin-tuc', order: 4 },
        { id: '6', label: 'Giới thiệu', url: '/gioi-thieu', order: 5 },
        { id: '7', label: 'Liên hệ', url: '/lien-he', order: 6 }
    ]

    try {
        console.log('Restoring default header menu items...')

        // Use sql.json() to ensure postgres-js handles it as JSONB
        const result = await sql`
            UPDATE menus 
            SET items = ${sql.json(defaultItems)},
                style = 'list'
            WHERE location = 'header'
            RETURNING *
        `

        if (result.length === 0) {
            console.log('Header menu not found, creating it...')
            await sql`
                INSERT INTO menus (name, location, items, style)
                VALUES ('Header Menu', 'header', ${sql.json(defaultItems)}, 'list')
            `
        }

        console.log('Restoring post categories...')
        const postItems = [
            { id: 'p1', label: 'Công ty', url: '/tin-tuc?category=Công ty', order: 0 },
            { id: 'p2', label: 'Tuyển dụng', url: '/tin-tuc?category=Tuyển dụng', order: 1 },
            { id: 'p3', label: 'Công nghệ', url: '/tin-tuc?category=Công nghệ', order: 2 },
            { id: 'p4', label: 'Chuyên ngành', url: '/tin-tuc?category=Chuyên ngành', order: 3 },
            { id: 'p5', label: 'Xã hội', url: '/tin-tuc?category=Xã hội', order: 4 }
        ]

        await sql`
            UPDATE menus 
            SET items = ${sql.json(postItems)}
            WHERE location = 'post'
        `

        console.log('Menu content restoration completed successfully!')
    } catch (error) {
        console.error('Failed to restore menu content:', error)
    } finally {
        await sql.end()
    }
}

main()
