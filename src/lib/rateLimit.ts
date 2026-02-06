import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory rate limiter
// For production, consider using Redis or a dedicated rate limiting service
interface RateLimitEntry {
    count: number
    resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries every 10 minutes
setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetTime < now) {
            rateLimitStore.delete(key)
        }
    }
}, 10 * 60 * 1000)

export interface RateLimitConfig {
    windowMs: number // Time window in milliseconds
    maxRequests: number // Max requests per window
}

export const RATE_LIMIT_CONFIGS: { [key: string]: RateLimitConfig } = {
    // Login endpoint: 5 attempts per 15 minutes
    '/api/admin/login': {
        windowMs: 15 * 60 * 1000,
        maxRequests: 5
    },
    // Contact form: 3 submissions per hour
    '/api/contact': {
        windowMs: 60 * 60 * 1000,
        maxRequests: 3
    },
    // Quote request: 3 submissions per hour
    '/api/quote': {
        windowMs: 60 * 60 * 1000,
        maxRequests: 3
    },
    // Admin APIs: 100 requests per minute
    '/api/admin': {
        windowMs: 60 * 1000,
        maxRequests: 100
    },
    // Public APIs: 30 requests per minute
    '/api': {
        windowMs: 60 * 1000,
        maxRequests: 30
    }
}

/**
 * Get client identifier (IP address)
 */
function getClientIdentifier(request: NextRequest): string {
    // Try to get real IP from headers (for proxied requests)
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')

    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim()
    }

    if (realIp) {
        return realIp
    }

    // Fallback to a generic identifier
    return 'client'
}

/**
 * Get rate limit config for a given path
 */
function getRateLimitConfig(pathname: string): RateLimitConfig | null {
    // Check for exact match first
    if (RATE_LIMIT_CONFIGS[pathname]) {
        return RATE_LIMIT_CONFIGS[pathname]
    }

    // Check for prefix match (most specific first)
    const sortedPaths = Object.keys(RATE_LIMIT_CONFIGS).sort((a, b) => b.length - a.length)

    for (const path of sortedPaths) {
        if (pathname.startsWith(path)) {
            return RATE_LIMIT_CONFIGS[path]
        }
    }

    return null
}

/**
 * Check if request should be rate limited
 */
export function checkRateLimit(request: NextRequest): {
    allowed: boolean
    limit?: number
    remaining?: number
    resetTime?: number
} {
    const { pathname } = request.nextUrl

    // Skip rate limiting for non-API routes
    if (!pathname.startsWith('/api')) {
        return { allowed: true }
    }

    const config = getRateLimitConfig(pathname)
    if (!config) {
        return { allowed: true }
    }

    const clientId = getClientIdentifier(request)
    const key = `${pathname}:${clientId}`
    const now = Date.now()

    let entry = rateLimitStore.get(key)

    // Create new entry if doesn't exist or expired
    if (!entry || entry.resetTime < now) {
        entry = {
            count: 0,
            resetTime: now + config.windowMs
        }
        rateLimitStore.set(key, entry)
    }

    // Increment counter
    entry.count++

    const allowed = entry.count <= config.maxRequests

    return {
        allowed,
        limit: config.maxRequests,
        remaining: Math.max(0, config.maxRequests - entry.count),
        resetTime: entry.resetTime
    }
}

/**
 * Create rate limit response with headers
 */
export function createRateLimitResponse(result: ReturnType<typeof checkRateLimit>): NextResponse {
    const response = NextResponse.json(
        {
            error: 'Too many requests. Please try again later.',
            retryAfter: result.resetTime ? Math.ceil((result.resetTime - Date.now()) / 1000) : undefined
        },
        { status: 429 }
    )

    if (result.limit !== undefined) {
        response.headers.set('X-RateLimit-Limit', result.limit.toString())
    }
    if (result.remaining !== undefined) {
        response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
    }
    if (result.resetTime !== undefined) {
        response.headers.set('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000).toString())
    }

    return response
}

/**
 * Add rate limit headers to response
 */
export function addRateLimitHeaders(response: NextResponse, result: ReturnType<typeof checkRateLimit>): NextResponse {
    if (result.limit !== undefined) {
        response.headers.set('X-RateLimit-Limit', result.limit.toString())
    }
    if (result.remaining !== undefined) {
        response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
    }
    if (result.resetTime !== undefined) {
        response.headers.set('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000).toString())
    }

    return response
}
