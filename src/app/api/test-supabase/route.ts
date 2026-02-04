import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        console.log('🔍 Testing Supabase connection...')

        // Test configuration
        const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
        const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY

        const config = {
            url: hasUrl ? process.env.NEXT_PUBLIC_SUPABASE_URL : 'MISSING',
            anonKey: hasAnonKey ? 'SET ✅' : 'MISSING ❌',
            serviceKey: hasServiceKey ? 'SET ✅' : 'MISSING ❌'
        }

        // Test 1: Fetch categories
        const { data: categories, error: categoriesError } = await supabase
            .from('categories')
            .select('id, name, slug')
            .limit(10)

        // Test 2: Fetch products
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id, name, price, stock')
            .limit(10)

        // Build response
        const result = {
            success: !categoriesError && !productsError,
            timestamp: new Date().toISOString(),
            config,
            tests: {
                categories: {
                    success: !categoriesError,
                    count: categories?.length || 0,
                    data: categories || [],
                    error: categoriesError?.message || null
                },
                products: {
                    success: !productsError,
                    count: products?.length || 0,
                    data: products || [],
                    error: productsError?.message || null
                }
            }
        }

        if (result.success) {
            return NextResponse.json({
                ...result,
                message: '🎉 Supabase connection successful!'
            })
        } else {
            return NextResponse.json({
                ...result,
                message: '⚠️ Connection issues detected'
            }, { status: 500 })
        }

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: '💥 Fatal error',
            error: error.message,
            stack: error.stack
        }, { status: 500 })
    }
}
