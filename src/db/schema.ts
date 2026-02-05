import { pgTable, text, timestamp, integer, boolean, jsonb, uuid, varchar, decimal, type PgTableWithColumns } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Categories Table
export const categories: PgTableWithColumns<any> = pgTable('categories', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    description: text('description'),
    icon: varchar('icon', { length: 50 }),
    parentId: uuid('parent_id').references(() => categories.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Products Table
export const products = pgTable('products', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 500 }).notNull(),
    slug: varchar('slug', { length: 500 }).notNull().unique(),
    description: text('description'),

    // Technical Specifications as JSON array
    // Format: [{ parameter: 'Lưu lượng', value: '100', unit: 'l/s' }, ...]
    technicalSpecifications: jsonb('technical_specifications').$type<{
        parameter: string
        value: string
        unit?: string
    }[]>(),

    // Pricing & Inventory
    price: decimal('price', { precision: 12, scale: 2 }).notNull(),
    stock: integer('stock').default(0).notNull(),
    sku: varchar('sku', { length: 100 }),

    // Category relationship
    categoryId: uuid('category_id').references(() => categories.id),

    // Images as JSON array of URLs
    images: jsonb('images').$type<{
        url: string
        alt?: string
    }[]>(),

    // Flags
    featured: boolean('featured').default(false),
    status: varchar('status', { length: 20 }).default('draft'), // draft, published

    // SEO
    metaTitle: varchar('meta_title', { length: 255 }),
    metaDescription: text('meta_description'),
    keywords: text('keywords'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Projects Table
export const projects = pgTable('projects', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 500 }).notNull(),
    slug: varchar('slug', { length: 500 }).notNull().unique(),
    description: text('description'),
    technicalDetails: text('technical_details'),

    // Project Info
    location: varchar('location', { length: 500 }),
    client: varchar('client', { length: 500 }),
    completionDate: timestamp('completion_date'),

    // Images as JSON array
    images: jsonb('images').$type<{
        url: string
        caption?: string
    }[]>(),

    // Category (M&E, Water Supply, Treatment)
    category: varchar('category', { length: 100 }),

    // Flags
    featured: boolean('featured').default(false),

    // SEO
    metaTitle: varchar('meta_title', { length: 255 }),
    metaDescription: text('meta_description'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Services Table
export const services = pgTable('services', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 500 }).notNull(),
    slug: varchar('slug', { length: 500 }).notNull().unique(),
    description: text('description'),
    icon: varchar('icon', { length: 50 }),

    // Features as JSON array
    features: jsonb('features').$type<string[]>(),

    // Image
    imageUrl: varchar('image_url', { length: 1000 }),

    order: integer('order').default(0),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Posts (Blog/News) Table
export const posts = pgTable('posts', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 500 }).notNull(),
    slug: varchar('slug', { length: 500 }).notNull().unique(),
    content: text('content').notNull(),
    excerpt: text('excerpt'),

    featuredImageUrl: varchar('featured_image_url', { length: 1000 }),

    // Category
    category: varchar('category', { length: 100 }),

    // Tags as JSON array
    tags: jsonb('tags').$type<string[]>(),

    author: varchar('author', { length: 255 }),
    publishedDate: timestamp('published_date'),
    status: varchar('status', { length: 20 }).default('draft'),

    // SEO
    metaTitle: varchar('meta_title', { length: 255 }),
    metaDescription: text('meta_description'),
    focusKeywords: text('focus_keywords'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Orders Table
export const orders = pgTable('orders', {
    id: uuid('id').defaultRandom().primaryKey(),
    orderCode: varchar('order_code', { length: 50 }).notNull().unique(),

    // Customer Info
    customerName: varchar('customer_name', { length: 255 }).notNull(),
    customerPhone: varchar('customer_phone', { length: 20 }).notNull(),
    customerEmail: varchar('customer_email', { length: 255 }).notNull(),
    customerCompany: varchar('customer_company', { length: 500 }),
    deliveryAddress: text('delivery_address').notNull(),

    // Items as JSON array
    items: jsonb('items').$type<{
        productId: string
        productName: string
        quantity: number
        price: number
    }[]>().notNull(),

    totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),

    // Payment
    paymentMethod: varchar('payment_method', { length: 50 }).notNull(), // PayOS, COD, Bank Transfer
    paymentStatus: varchar('payment_status', { length: 50 }).default('pending'), // pending, paid, failed, cancelled
    payosOrderId: varchar('payos_order_id', { length: 255 }),

    // Order Status
    status: varchar('status', { length: 50 }).default('new'), // new, processing, shipped, completed, cancelled
    notes: text('notes'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Pages Table (Landing Page Builder)
export const pages = pgTable('pages', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 500 }).notNull(),
    slug: varchar('slug', { length: 500 }).notNull().unique(),

    // Page layout as JSON blocks
    layout: jsonb('layout').$type<{
        blockType: string
        content: any
    }[]>(),

    status: varchar('status', { length: 20 }).default('draft'),
    publishedDate: timestamp('published_date'),

    // SEO
    metaTitle: varchar('meta_title', { length: 255 }),
    metaDescription: text('meta_description'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Reviews Table
export const reviews = pgTable('reviews', {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id').references(() => products.id).notNull(),

    customerName: varchar('customer_name', { length: 255 }).notNull(),
    rating: integer('rating').notNull(), // 1-5
    title: varchar('title', { length: 500 }),
    comment: text('comment'),

    verified: boolean('verified').default(false),
    helpful: integer('helpful').default(0),

    status: varchar('status', { length: 20 }).default('pending'), // pending, approved, rejected

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// FAQs Table
export const faqs = pgTable('faqs', {
    id: uuid('id').defaultRandom().primaryKey(),
    question: text('question').notNull(),
    answer: text('answer').notNull(),

    category: varchar('category', { length: 100 }), // General, Products, Services, Payment, Delivery
    order: integer('order').default(0),
    featured: boolean('featured').default(false),

    // Related products as JSON array of IDs
    relatedProductIds: jsonb('related_product_ids').$type<string[]>(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Team Members Table
export const teamMembers = pgTable('team_members', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    position: varchar('position', { length: 255 }).notNull(),

    photoUrl: varchar('photo_url', { length: 1000 }),
    bio: text('bio'),

    email: varchar('email', { length: 255 }),
    phone: varchar('phone', { length: 20 }),

    // Specialization as JSON array
    specialization: jsonb('specialization').$type<string[]>(),

    // Social links
    linkedinUrl: varchar('linkedin_url', { length: 500 }),
    zaloUrl: varchar('zalo_url', { length: 500 }),

    order: integer('order').default(0),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Testimonials Table
export const testimonials = pgTable('testimonials', {
    id: uuid('id').defaultRandom().primaryKey(),

    clientName: varchar('client_name', { length: 255 }).notNull(),
    clientPosition: varchar('client_position', { length: 255 }),
    clientCompany: varchar('client_company', { length: 500 }),
    clientPhotoUrl: varchar('client_photo_url', { length: 1000 }),

    testimonial: text('testimonial').notNull(),

    projectId: uuid('project_id').references(() => projects.id),
    rating: integer('rating'), // 1-5

    featured: boolean('featured').default(false),
    order: integer('order').default(0),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Settings Table
export const settings = pgTable('settings', {
    key: varchar('key', { length: 255 }).primaryKey(),
    value: jsonb('value').notNull(),
    description: text('description'),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Contacts Table
export const contacts = pgTable('contacts', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }),
    subject: varchar('subject', { length: 500 }),
    message: text('message').notNull(),
    status: varchar('status', { length: 20 }).default('unread'), // unread, read, replied
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Media Table
export const media = pgTable('media', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 500 }).notNull(),
    fileName: varchar('file_name', { length: 500 }).notNull(),
    url: varchar('url', { length: 1000 }).notNull(),
    type: varchar('type', { length: 50 }).notNull(), // image, video, document
    mimeType: varchar('mime_type', { length: 100 }).notNull(),
    size: integer('size'), // in bytes
    width: integer('width'),
    height: integer('height'),
    altText: text('alt_text'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Menus Table
export const menus = pgTable('menus', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    location: varchar('location', { length: 50 }).notNull().unique(), // header, side, post
    items: jsonb('items').$type<{
        id: string
        label: string
        url: string
        order: number
        parentId?: string
        icon?: string
    }[]>().notNull().default([]),
    active: boolean('active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Quote Requests Table
export const quoteRequests = pgTable('quote_requests', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    company: varchar('company', { length: 500 }),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }).notNull(),
    productCategory: varchar('product_category', { length: 100 }).notNull(),
    quantity: varchar('quantity', { length: 255 }),
    description: text('description').notNull(),
    budget: varchar('budget', { length: 50 }),
    timeline: varchar('timeline', { length: 50 }),
    status: varchar('status', { length: 50 }).default('new'), // new, contacted, quoted, won, lost
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Admin Users Table
export const adminUsers = pgTable('admin_users', {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 500 }).notNull(),
    name: varchar('name', { length: 255 }),
    role: varchar('role', { length: 50 }).default('admin'),
    active: boolean('active').default(true),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Relations
export const categoriesRelations = relations(categories, ({ many, one }) => ({
    products: many(products),
    parent: one(categories, {
        fields: [categories.parentId],
        references: [categories.id],
    }),
    children: many(categories),
}))

export const productsRelations = relations(products, ({ one, many }) => ({
    category: one(categories, {
        fields: [products.categoryId],
        references: [categories.id],
    }),
    reviews: many(reviews),
}))

export const reviewsRelations = relations(reviews, ({ one }) => ({
    product: one(products, {
        fields: [reviews.productId],
        references: [products.id],
    }),
}))

export const testimonialsRelations = relations(testimonials, ({ one }) => ({
    project: one(projects, {
        fields: [testimonials.projectId],
        references: [projects.id],
    }),
}))
