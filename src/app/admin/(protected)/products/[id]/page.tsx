import { ProductEditor } from '@/components/admin/ProductEditor'
import { supabaseAdmin } from '@/lib/supabase'
import { notFound, redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    console.log('Fetching product:', id)

    // Handle 'new' if user accidentally goes to /[id] instead of /create
    if (id === 'new') {
        redirect('/admin/products/create')
    }

    // Basic UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
        console.error('Invalid product ID format:', id)
        notFound()
    }

    // 1. Fetch Product
    const { data: product, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching product:', JSON.stringify(error, null, 2))
    }

    if (!product) {
        console.error('Product not found for ID:', id)
        notFound()
    }

    // 2. Fetch Categories
    const { data: categories } = await supabaseAdmin
        .from('categories')
        .select('*')
        .eq('type', 'product')
        .order('name')

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ProductEditor
                initialData={product}
                categories={categories || []}
            />
        </div>
    )
}
