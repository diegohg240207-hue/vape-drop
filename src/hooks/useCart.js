import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart:  () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart:() => set(s => ({ isOpen: !s.isOpen })),

      addItem(product) {
        const items = get().items
        const existing = items.find(i => i.id === product.id)
        if (existing) {
          set({ items: items.map(i =>
            i.id === product.id
              ? { ...i, qty: i.qty + 1 }
              : i
          )})
        } else {
          set({ items: [...items, { ...product, qty: 1 }] })
        }
        set({ isOpen: true })
      },

      removeItem(id) {
        set({ items: get().items.filter(i => i.id !== id) })
      },

      changeQty(id, delta) {
        const items = get().items.map(i =>
          i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
        )
        set({ items })
      },

      clearCart() {
        set({ items: [], isOpen: false })
      },

      get total() {
        return get().items.reduce((sum, i) => sum + i.price * i.qty, 0)
      },

      get count() {
        return get().items.reduce((sum, i) => sum + i.qty, 0)
      },
    }),
    { name: 'vape-drop-cart' }
  )
)
