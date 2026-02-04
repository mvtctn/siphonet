import { ProductEditor } from '@/components/admin/ProductEditor'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function CreateProductPage() {
    // Fetch categories for the select dropdown
    const { data: categories } = await supabaseAdmin
        .from('categories')
        .select('*')
        .eq('type', 'product')
        .order('name')

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ProductEditor categories={categories || []} />
        </div>
    )
}
