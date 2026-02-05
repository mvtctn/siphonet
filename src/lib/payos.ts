
import PayOS from '@payos/node'

const clientId = process.env.PAYOS_CLIENT_ID
const apiKey = process.env.PAYOS_API_KEY
const checksumKey = process.env.PAYOS_CHECKSUM_KEY

if (!clientId || !apiKey || !checksumKey) {
    console.error('PayOS environment variables are not set. Payment functionality will be disabled.')
}

export const payos = new PayOS(
    clientId || 'dummy',
    apiKey || 'dummy',
    checksumKey || 'dummy'
)
