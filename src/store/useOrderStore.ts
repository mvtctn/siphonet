
import { create } from 'zustand'

export interface OrderItem {
    productId: string
    productName: string
    quantity: number
    price: number
}

export interface Order {
    id: string
    orderCode: string
    customerName: string
    customerPhone: string
    customerEmail: string
    customerCompany?: string
    deliveryAddress: string
    items: OrderItem[]
    totalAmount: string
    paymentMethod: 'PayOS' | 'COD' | 'Bank Transfer'
    paymentStatus: 'pending' | 'paid' | 'failed' | 'cancelled'
    payosOrderId?: string
    status: 'new' | 'processing' | 'shipped' | 'completed' | 'cancelled'
    notes?: string
    createdAt: string
    updatedAt: string
}

interface OrderState {
    orders: Order[]
    isLoading: boolean
    error: string | null

    // Actions
    fetchOrders: () => Promise<void>
    updateOrderStatus: (orderId: string, status: string) => Promise<void>
    updatePaymentStatus: (orderId: string, status: string) => Promise<void>
}

export const useOrderStore = create<OrderState>((set, get) => ({
    orders: [],
    isLoading: false,
    error: null,

    fetchOrders: async () => {
        set({ isLoading: true, error: null })
        try {
            const response = await fetch('/api/admin/orders')
            const result = await response.json()
            if (result.success) {
                set({ orders: result.data, isLoading: false })
            } else {
                set({ error: result.message, isLoading: false })
            }
        } catch (error) {
            set({ error: 'Failed to fetch orders', isLoading: false })
        }
    },

    updateOrderStatus: async (orderId: string, status: string) => {
        try {
            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })
            const result = await response.json()
            if (result.success) {
                const orders = get().orders.map(o =>
                    o.id === orderId ? { ...o, status: status as any } : o
                )
                set({ orders })
            }
        } catch (error) {
            console.error('Failed to update order status', error)
        }
    },

    updatePaymentStatus: async (orderId: string, status: string) => {
        try {
            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentStatus: status })
            })
            const result = await response.json()
            if (result.success) {
                const orders = get().orders.map(o =>
                    o.id === orderId ? { ...o, paymentStatus: status as any } : o
                )
                set({ orders })
            }
        } catch (error) {
            console.error('Failed to update payment status', error)
        }
    }
}))
