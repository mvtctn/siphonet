import { NextResponse } from 'next/server'

// Allowed file extensions by category
const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
const ALLOWED_VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov']
const ALLOWED_DOCUMENT_EXTENSIONS = ['pdf']

const ALL_ALLOWED_EXTENSIONS = [
    ...ALLOWED_IMAGE_EXTENSIONS,
    ...ALLOWED_VIDEO_EXTENSIONS,
    ...ALLOWED_DOCUMENT_EXTENSIONS
]

// File size limits (in bytes)
const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB
const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024 // 5MB

// Magic bytes for file type validation
const FILE_SIGNATURES: { [key: string]: string[] } = {
    'jpg': ['ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2', 'ffd8ffe3', 'ffd8ffe8'],
    'jpeg': ['ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2', 'ffd8ffe3', 'ffd8ffe8'],
    'png': ['89504e47'],
    'gif': ['47494638'],
    'webp': ['52494646'],
    'pdf': ['25504446'],
    'mp4': ['66747970'],
}

export interface FileValidationResult {
    valid: boolean
    error?: string
    extension?: string
    size?: number
}

/**
 * Validate file extension against whitelist
 */
export function validateFileExtension(fileName: string): FileValidationResult {
    const ext = fileName.split('.').pop()?.toLowerCase()

    if (!ext) {
        return { valid: false, error: 'File has no extension' }
    }

    if (!ALL_ALLOWED_EXTENSIONS.includes(ext)) {
        return {
            valid: false,
            error: `File type .${ext} is not allowed. Allowed types: ${ALL_ALLOWED_EXTENSIONS.join(', ')}`
        }
    }

    return { valid: true, extension: ext }
}

/**
 * Validate file size based on file type
 */
export function validateFileSize(file: File, extension: string): FileValidationResult {
    let maxSize = MAX_IMAGE_SIZE

    if (ALLOWED_VIDEO_EXTENSIONS.includes(extension)) {
        maxSize = MAX_VIDEO_SIZE
    } else if (ALLOWED_DOCUMENT_EXTENSIONS.includes(extension)) {
        maxSize = MAX_DOCUMENT_SIZE
    }

    if (file.size > maxSize) {
        const maxSizeMB = Math.round(maxSize / (1024 * 1024))
        return {
            valid: false,
            error: `File size (${Math.round(file.size / (1024 * 1024))}MB) exceeds maximum allowed size (${maxSizeMB}MB)`
        }
    }

    return { valid: true, size: file.size }
}

/**
 * Validate file magic bytes (file signature)
 */
export async function validateFileMagicBytes(file: File, extension: string): Promise<FileValidationResult> {
    try {
        // Only validate known file types
        if (!FILE_SIGNATURES[extension]) {
            return { valid: true } // Skip validation for unknown types
        }

        const buffer = await file.arrayBuffer()
        const bytes = new Uint8Array(buffer)
        const hex = Array.from(bytes.slice(0, 8))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')

        const validSignatures = FILE_SIGNATURES[extension]
        const isValid = validSignatures.some(sig => hex.startsWith(sig))

        if (!isValid) {
            return {
                valid: false,
                error: `File content does not match .${extension} format. File may be corrupted or renamed.`
            }
        }

        return { valid: true }
    } catch (error) {
        return {
            valid: false,
            error: 'Failed to validate file content'
        }
    }
}

/**
 * Comprehensive file validation
 */
export async function validateUploadedFile(file: File): Promise<FileValidationResult> {
    // 1. Validate extension
    const extResult = validateFileExtension(file.name)
    if (!extResult.valid) return extResult

    const extension = extResult.extension!

    // 2. Validate size
    const sizeResult = validateFileSize(file, extension)
    if (!sizeResult.valid) return sizeResult

    // 3. Validate magic bytes
    const magicResult = await validateFileMagicBytes(file, extension)
    if (!magicResult.valid) return magicResult

    return {
        valid: true,
        extension,
        size: file.size
    }
}

/**
 * Sanitize filename to prevent path traversal
 */
export function sanitizeFileName(fileName: string): string {
    // Remove path separators and special characters
    return fileName
        .replace(/[\/\\]/g, '')
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .substring(0, 255) // Limit length
}
