// Type exports for all database tables
export type {
    // Tables
    categories,
    products,
    projects,
    services,
    posts,
    orders,
    pages,
    reviews,
    faqs,
    teamMembers,
    testimonials,
} from './schema'

// Inferred types for inserts and selects
import {
    categories,
    products,
    projects,
    services,
    posts,
    orders,
    pages,
    reviews,
    faqs,
    teamMembers,
    testimonials,
} from './schema'

// Category types
export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert

// Product types
export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert

// Project types
export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert

// Service types
export type Service = typeof services.$inferSelect
export type NewService = typeof services.$inferInsert

// Post types
export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert

// Order types
export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert

// Page types
export type Page = typeof pages.$inferSelect
export type NewPage = typeof pages.$inferInsert

// Review types
export type Review = typeof reviews.$inferSelect
export type NewReview = typeof reviews.$inferInsert

// FAQ types
export type FAQ = typeof faqs.$inferSelect
export type NewFAQ = typeof faqs.$inferInsert

// Team Member types
export type TeamMember = typeof teamMembers.$inferSelect
export type NewTeamMember = typeof teamMembers.$inferInsert

// Testimonial types
export type Testimonial = typeof testimonials.$inferSelect
export type NewTestimonial = typeof testimonials.$inferInsert
