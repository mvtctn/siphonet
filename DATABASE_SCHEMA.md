# Drizzle ORM - Database Schema Guide

## 📋 Schema Overview

Siphonet website uses **Drizzle ORM** with **PostgreSQL (Supabase)** for type-safe database operations.

### Database Tables (11 total):

1. **categories** - Product categories hierarchy
2. **products** - Products with technical specifications
3. **projects** - Completed projects showcase
4. **services** - Service offerings
5. **posts** - Blog/news articles
6. **orders** - E-commerce orders with PayOS integration
7. **pages** - Dynamic landing pages
8. **reviews** - Product reviews and ratings
9. **faqs** - Frequently asked questions
10. **teamMembers** - Company team profiles
11. **testimonials** - Client feedback

---

## 🔧 Setup Instructions

### 1. Configure Environment

Make sure `.env` has your Supabase connection:

```bash
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### 2. Generate Migrations

```bash
pnpm db:generate
```

This creates SQL migration files in `./drizzle/` folder.

### 3. Push Schema to Database

```bash
pnpm db:push
```

This applies the schema to your Supabase database.

### 4. (Optional) Seed Sample Data

```bash
pnpm db:seed
```

Adds sample Vietnamese data for testing.

### 5. Open Drizzle Studio

```bash
pnpm db:studio
```

Visual database explorer at https://local.drizzle.studio

---

## 📊 Schema Details

### Products Table

```typescript
{
  id: uuid (primary key)
  name: string
  slug: string (unique)
  description: text
  
  // Technical Specs as JSON
  technicalSpecifications: [{
    parameter: 'Lưu lượng',
    value: '100',
    unit: 'l/s'
  }]
  
  price: decimal
  stock: integer
  categoryId: uuid (foreign key)
  images: [{ url, alt }]
  featured: boolean
  status: 'draft' | 'published'
  
  // SEO fields
  metaTitle, metaDescription, keywords
}
```

### Projects Table

```typescript
{
  id: uuid
  title: string
  slug: string
  description, technicalDetails: text
  location, client: string
  completionDate: date
  images: [{ url, caption }]
  category: string
  featured: boolean
}
```

### Orders Table

```typescript
{
  id: uuid
  orderCode: string (unique)
  
  // Customer info
  customerName, customerPhone, customerEmail
  customerCompany, deliveryAddress
  
  // Order items
  items: [{
    productId, productName, quantity, price
  }]
  
  totalAmount: decimal
  
  // PayOS integration
  paymentMethod: 'PayOS' | 'COD' | 'Bank Transfer'
  paymentStatus: 'pending' | 'paid' | 'failed'
  payosOrderId: string
  
  // Order tracking
  status: 'new' | 'processing' | 'shipped' | 'completed'
  notes: text
}
```

---

## 🎯 Usage Examples

### Import Database Client

```typescript
import { db } from '@/db'
import { products, categories } from '@/db/schema'
import type { Product, NewProduct } from '@/db/types'
```

### Fetch Data (Server Component)

```typescript
// Get all published products
const allProducts = await db
  .select()
  .from(products)
  .where(eq(products.status, 'published'))

// Get product with category
const productWithCategory = await db
  .select()
  .from(products)
  .leftJoin(categories, eq(products.categoryId, categories.id))
  .where(eq(products.slug, 'may-bom-grundfos'))
```

### Insert Data

```typescript
const newProduct: NewProduct = {
  name: 'Máy bơm Grundfos',
  slug: 'may-bom-grundfos',
  price: '15000000',
  stock: 10,
  categoryId: 'uuid-here'
}

await db.insert(products).values(newProduct)
```

### Update Data

```typescript
await db
  .update(products)
  .set({ stock: 5 })
  .where(eq(products.id, productId))
```

### Delete Data

```typescript
await db
  .delete(products)
  .where(eq(products.id, productId))
```

---

## 🔄 Relations

### Products ↔ Categories

```typescript
const productWithCategory = await db.query.products.findFirst({
  where: eq(products.slug, 'may-bom'),
  with: {
    category: true,
  },
})
```

### Products ↔ Reviews

```typescript
const productWithReviews = await db.query.products.findFirst({
  where: eq(products.id, productId),
  with: {
    reviews: true,
  },
})
```

---

## 🚀 Best Practices

1. **Always use TypeScript types** from `@/db/types`
2. **Server Components only** for direct database access
3. **Use API routes** for client-side data operations
4. **Index frequently queried fields** (slug, status, categoryId)
5. **Validate data** with Zod before inserting

---

## 📝 Migration Commands

```bash
# Generate migration after schema changes
pnpm db:generate

# Push schema (dev only - no migration)
pnpm db:push

# Open database studio
pnpm db:studio
```

---

## ⚠️ Important Notes

- **UUID Primary Keys**: All tables use UUID for better distribution
- **JSON Fields**: Used for flexible data (specs, images, features)
- **Timestamps**: Auto-managed `createdAt` and `updatedAt`
- **Soft Deletes**: Not implemented (use status fields instead)

---

For more info: https://orm.drizzle.team/docs/overview
