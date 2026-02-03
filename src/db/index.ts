import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
}

// For queries
const queryClient = postgres(process.env.DATABASE_URL)
export const db = drizzle(queryClient, { schema })

// Export schema and types
export * from './schema'
