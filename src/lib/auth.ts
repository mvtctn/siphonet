import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'


const SECRET_KEY = process.env.JWT_SECRET_KEY
if (!SECRET_KEY) {
    throw new Error('SECURITY ERROR: JWT_SECRET_KEY environment variable is required. Please set it in your .env.local file.')
}
const key = new TextEncoder().encode(SECRET_KEY)

export async function signToken(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h') // SECURITY: Reduced from 24h to 2h
        .sign(key)
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, key)
        return payload
    } catch (error) {
        return null
    }
}

export async function minionLogin(userData: any) {
    // Create token
    const token = await signToken(userData)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_token', token, {
        httpOnly: true,
        secure: true, // SECURITY: Always use secure cookies
        sameSite: 'strict', // SECURITY: CSRF protection
        maxAge: 60 * 60 * 2, // 2 hours (match JWT expiration)
        path: '/',
    })

    return token
}

export async function minionLogout() {
    const cookieStore = await cookies()
    cookieStore.delete('admin_token')
}

export async function getSession() {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value
    if (!token) return null
    return await verifyToken(token)
}
