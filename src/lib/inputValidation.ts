import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(dirty: string): string {
    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
        ALLOWED_ATTR: ['href']
    })
}

/**
 * Escape HTML entities
 */
export function escapeHtml(str: string): string {
    const htmlEntities: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
        '/': '&#x2F;'
    }

    return str.replace(/[&<>"'\/]/g, (char) => htmlEntities[char])
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): string {
    return email.toLowerCase().trim()
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= 255
}

/**
 * Validate and sanitize phone number
 */
export function sanitizePhone(phone: string): string {
    // Remove all non-digit characters except + at the start
    return phone.replace(/[^\d+]/g, '').substring(0, 20)
}

/**
 * Validate input length
 */
export function validateLength(
    value: string,
    fieldName: string,
    minLength: number = 0,
    maxLength: number = 1000
): { valid: boolean; error?: string } {
    if (value.length < minLength) {
        return {
            valid: false,
            error: `${fieldName} must be at least ${minLength} characters`
        }
    }

    if (value.length > maxLength) {
        return {
            valid: false,
            error: `${fieldName} must not exceed ${maxLength} characters`
        }
    }

    return { valid: true }
}

/**
 * Sanitize general text input
 */
export function sanitizeText(text: string, maxLength: number = 1000): string {
    return text.trim().substring(0, maxLength)
}

/**
 * Validate and sanitize URL
 */
export function sanitizeUrl(url: string): string | null {
    try {
        const parsed = new URL(url)
        // Only allow http and https protocols
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            return null
        }
        return parsed.toString()
    } catch {
        return null
    }
}
