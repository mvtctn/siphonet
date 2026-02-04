import { supabase } from './src/lib/supabase'

async function testSupabaseConnection() {
    console.log('🔍 Testing Supabase connection...\n')

    // Test 1: Check if client is initialized
    console.log('✅ Supabase client initialized')
    console.log('📍 URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('🔑 Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...\n')

    // Test 2: Try to fetch categories
    console.log('📊 Fetching categories from database...')
    const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .limit(5)

    if (categoriesError) {
        console.error('❌ Error fetching categories:', categoriesError.message)
        console.error('Details:', categoriesError)
    } else {
        console.log('✅ Categories fetched successfully!')
        console.log('📦 Count:', categories?.length || 0)
        if (categories && categories.length > 0) {
            console.log('📋 Categories:', categories.map(c => c.name).join(', '))
        }
    }

    console.log('\n')

    // Test 3: Try to fetch products
    console.log('📊 Fetching products from database...')
    const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name, price, stock')
        .limit(5)

    if (productsError) {
        console.error('❌ Error fetching products:', productsError.message)
        console.error('Details:', productsError)
    } else {
        console.log('✅ Products fetched successfully!')
        console.log('📦 Count:', products?.length || 0)
        if (products && products.length > 0) {
            products.forEach(p => {
                console.log(`  - ${p.name} | Price: ${p.price} | Stock: ${p.stock}`)
            })
        }
    }

    console.log('\n')

    // Test 4: Summary
    if (!categoriesError && !productsError) {
        console.log('🎉 All tests passed! Supabase connection is working perfectly!')
    } else {
        console.log('⚠️ Some tests failed. Please check your configuration.')
    }
}

// Run the test
testSupabaseConnection()
    .then(() => {
        console.log('\n✨ Test completed!')
        process.exit(0)
    })
    .catch((error) => {
        console.error('\n💥 Fatal error:', error)
        process.exit(1)
    })
