// app/context/CartContext.tsx
"use client"
import { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Product {
  id: string
  name: string
  price: number
  image?: string
}

interface CartItem extends Product {
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load cart from localStorage on mount and when user changes
  useEffect(() => {
    if (status === 'loading') return

    const loadCart = () => {
      if (typeof window === 'undefined') return

      const userId = session?.user?.id
      const storageKey = userId ? `cart_${userId}` : 'cart_guest'
      const savedCart = localStorage.getItem(storageKey)

      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart))
        } catch (error) {
          console.error('Error loading cart:', error)
          setCartItems([])
        }
      }
      setIsInitialized(true)
    }

    loadCart()
  }, [session?.user?.id, status])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return
    if (typeof window === 'undefined') return

    const userId = session?.user?.id
    const storageKey = userId ? `cart_${userId}` : 'cart_guest'
    localStorage.setItem(storageKey, JSON.stringify(cartItems))
  }, [cartItems, session?.user?.id, isInitialized])

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevItems, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0)
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const itemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  )

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    itemCount,
  }

  // Don't render until we've initialized the cart
  if (!isInitialized && status === 'loading') {
    return null
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
