import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const addToCart = (item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }
  const updateQuantity = (id, delta) => {
    setCartItems(prev =>
      prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)
    )
  }
  const removeItem = (id) => {
    setCartItems(prev => prev.filter(i => i.id !== id))
  }
  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, updateQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  )
}
export function useCart() {
  return useContext(CartContext)
}