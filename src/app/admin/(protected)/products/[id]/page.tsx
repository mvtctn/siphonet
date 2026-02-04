import { ProductEditor } from '@/components/admin/ProductEditor'
import { supabaseAdmin } from '@/lib/supabase'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    console.log('Fetching product:', id)

    // 1. Fetch Product
    const { data: product, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching product:', error)
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
