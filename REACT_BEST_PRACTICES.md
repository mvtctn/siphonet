# React & Next.js Best Practices for Siphonet Project

## 📋 Project Standards

### 1. File & Folder Structure
```
src/
├── app/                    # Next.js 15 App Router pages
├── components/
│   ├── ui/                # Shadcn/ui components (primitives)
│   ├── layout/            # Layout components (Header, Footer)
│   ├── home/              # Homepage-specific components
│   ├── products/          # Product-related components
│   └── shared/            # Shared/reusable components
├── collections/           # Payload CMS collections
├── lib/                   # Utility functions, helpers
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── styles/                # Global styles
```

### 2. Component Organization

#### Server Components (Default)
- Use for static content and data fetching
- File naming: `ComponentName.tsx`
- No `useState`, `useEffect`, or browser APIs

```typescript
// src/components/home/HeroSection.tsx
import { getConfig } from '@/lib/payload'

export default async function HeroSection() {
  const config = await getConfig()
  return <section>...</section>
}
```

#### Client Components
- Add `'use client'` directive at top
- Use for interactivity, state, browser APIs
- File naming: `ComponentName.tsx`

```typescript
// src/components/products/AddToCartButton.tsx
'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/useCart'

export function AddToCartButton({ product }) {
  const { addItem } = useCart()
  // ... interactive logic
}
```

### 3. TypeScript Best Practices

#### Strict Type Definitions
```typescript
// src/types/product.ts
export interface Product {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  images: Media[]
  specifications: SpecificationRow[]
  category: Category
}

export interface SpecificationRow {
  parameter: string
  value: string
  unit?: string
}
```

#### Use Zod for Runtime Validation
```typescript
import { z } from 'zod'

export const orderSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().regex(/^[0-9]{10,11}$/),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1)
  }))
})

export type OrderInput = z.infer<typeof orderSchema>
```

### 4. State Management

#### Zustand for Global State (Cart)
```typescript
// src/lib/cart.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  product: Product
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, quantity: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  total: number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity) => set((state) => {
        const existing = state.items.find(i => i.product.id === product.id)
        if (existing) {
          return {
            items: state.items.map(i =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            )
          }
        }
        return { items: [...state.items, { product, quantity }] }
      }),
      // ... other methods
      total: () => get().items.reduce((sum, item) => 
        sum + (item.product.price * item.quantity), 0
      )
    }),
    { name: 'siphonet-cart' }
  )
)
```

### 5. Data Fetching Patterns

#### Server-Side Data Fetching
```typescript
// app/san-pham/page.tsx
import { getPayloadClient } from '@/lib/payload'

export default async function ProductsPage() {
  const payload = await getPayloadClient()
  
  const { docs: products } = await payload.find({
    collection: 'products',
    where: { status: { equals: 'published' } },
    limit: 20,
    sort: '-createdAt'
  })

  return <ProductsList products={products} />
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 3600 // 1 hour
```

#### Client-Side Data Fetching (when needed)
```typescript
'use client'

import useSWR from 'swr'

export function useProducts(category?: string) {
  const { data, error, isLoading } = useSWR(
    category ? `/api/products?category=${category}` : '/api/products',
    fetcher
  )

  return {
    products: data?.products ?? [],
    isLoading,
    isError: error
  }
}
```

### 6. Performance Optimization

#### Image Optimization
```typescript
import Image from 'next/image'

<Image
  src={product.images[0].url}
  alt={product.name}
  width={800}
  height={600}
  className="object-cover"
  placeholder="blur"
  blurDataURL={product.images[0].blurDataURL}
  priority={isFeatured} // Only for above-the-fold images
/>
```

#### Dynamic Imports for Heavy Components
```typescript
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <Skeleton />,
  ssr: false // Disable SSR if component uses browser APIs
})
```

#### Metadata for SEO
```typescript
// app/san-pham/[slug]/page.tsx
import { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.slug)
  
  return {
    title: `${product.name} | Siphonet`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.images[0].url }],
    },
    keywords: ['thiết bị cơ điện', product.category.name, product.name]
  }
}
```

### 7. Custom Hooks

#### Example: useMediaQuery
```typescript
// src/hooks/useMediaQuery.ts
'use client'

import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

// Usage
const isMobile = useMediaQuery('(max-width: 768px)')
```

### 8. Error Handling

#### Error Boundaries
```typescript
// app/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2>Đã xảy ra lỗi!</h2>
      <button onClick={() => reset()}>Thử lại</button>
    </div>
  )
}
```

#### API Error Handling
```typescript
// app/api/orders/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = orderSchema.parse(body)
    
    // Process order...
    
    return NextResponse.json({ success: true, orderId })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Order creation failed:', error)
    return NextResponse.json(
      { error: 'Không thể tạo đơn hàng' },
      { status: 500 }
    )
  }
}
```

### 9. Accessibility (a11y)

```typescript
// Proper semantic HTML
<nav aria-label="Main navigation">
  <ul role="list">
    <li><a href="/">Trang chủ</a></li>
  </ul>
</nav>

// Focus management
<button
  onClick={handleClick}
  aria-label="Thêm vào giỏ hàng"
  disabled={isLoading}
>
  {isLoading ? 'Đang thêm...' : 'Thêm vào giỏ'}
</button>

// Skip to content link
<a href="#main-content" className="sr-only focus:not-sr-only">
  Bỏ qua đến nội dung chính
</a>
```

### 10. Testing Strategy

#### Unit Tests (Vitest)
```typescript
import { describe, it, expect } from 'vitest'
import { useCart } from '@/lib/cart'

describe('Cart Store', () => {
  it('should add item to cart', () => {
    const { addItem, items } = useCart.getState()
    addItem(mockProduct, 2)
    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(2)
  })
})
```

### 11. Code Quality

#### ESLint Configuration
```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

#### Prettier Configuration
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

## 🎯 Project-Specific Guidelines

### Vietnamese Language
```typescript
// Use Vietnamese for all user-facing text
const messages = {
  addToCart: 'Thêm vào giỏ hàng',
  outOfStock: 'Hết hàng',
  loading: 'Đang tải...',
  error: 'Đã xảy ra lỗi'
}
```

### Navy & Cyan Theme
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f172a', // Navy
          light: '#1e293b',
        },
        accent: {
          DEFAULT: '#06b6d4', // Cyan
          light: '#22d3ee',
        }
      }
    }
  }
}
```

### Supabase Integration
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Upload image to Supabase Storage
export async function uploadImage(file: File, bucket: string) {
  const fileName = `${Date.now()}-${file.name}`
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file)
  
  if (error) throw error
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)
    
  return publicUrl
}
```

## ✅ Checklist Before Commit

- [ ] TypeScript types are properly defined
- [ ] Components use Server Components unless interactivity needed
- [ ] Images use Next.js Image component
- [ ] SEO metadata is added
- [ ] Vietnamese language throughout
- [ ] Accessibility attributes added
- [ ] Error handling implemented
- [ ] No console.logs in production code
- [ ] Code formatted with Prettier
- [ ] ESLint shows no errors
