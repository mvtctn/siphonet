
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    image: string
    slug: string
}

interface CartState {
    items: CartItem[]

    // Actions
    addItem: (item: CartItem) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void

    // Selectors
    getTotalItems: () => number
    getSubtotal: () => number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => {
                const items = get().items
                const existing = items.find(i => i.id === item.id)
                if (existing) {
                    set({
                        items: items.map(i =>
                            i.id === item.id
                                ? { ...i, quantity: i.quantity + item.quantity }
                                : i
                        )
                    })
                } else {
                    set({ items: [...items, item] })
                }
            },

            removeItem: (id) => {
                set({ items: get().items.filter(i => i.id !== id) })
            },

            updateQuantity: (id, quantity) => {
                set({
                    items: get().items.map(i =>
                        i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
                    )
                })
            },

            clearCart: () => set({ items: [] }),

            getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
            getSubtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }),
        {
            name: 'siphonet-cart'
        }
    )
)
