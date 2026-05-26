// ─── CartPage.jsx ─────────────────────────────────────────────
// Shows items stored in localStorage cart.
// Does NOT place the order — that happens in Checkout.jsx.
// This page is purely a cart review + "Proceed to Checkout" gate.
//
// useCart() is exported from here so Navbar, MenuPage, and
// Checkout can all read/write the same localStorage cart.
//
// Backend connection:
//   No direct API calls here.
//   Order placement → POST /api/orders   (inside Checkout.jsx)
//   Payment submit  → POST /api/payments (inside Checkout.jsx)
// ─────────────────────────────────────────────────────────────

import { useState }                from 'react'
import { useNavigate }             from 'react-router-dom'
import Navbar                      from '../components/Navbar'
import { useAuthStore }            from '../store/useAuthStore'
import { FaTrash, FaShoppingCart } from 'react-icons/fa'
import toast                       from 'react-hot-toast'
import Checkout from '../pages/Checkout'
import MenuPage from '../pages/MenuPage'

// ─────────────────────────────────────────────────────────────
// useCart — exported so Navbar, MenuPage, Checkout can import:
//   import { useCart } from '../pages/CartPage'
//
// localStorage is the cart store — survives page refreshes.
// When backend is ready: swap localStorage with /api/cart calls.
// ─────────────────────────────────────────────────────────────
export function useCart() {
  // Read cart from localStorage — filters out stale items with invalid menuItemIds
  // (items added before backend was connected had numeric ids like 2, 3 — unusable)
  const getCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    // A valid MongoDB ObjectId is exactly 24 hex characters
    const valid = cart.filter(i => {
      const id = i.menuItemId || i._id || i.id
      return id && String(id).length === 24
    })
    // If we filtered any out, update localStorage silently
    if (valid.length !== cart.length) {
      localStorage.setItem('cart', JSON.stringify(valid))
    }
    return valid
  }

  // Persist full cart array to localStorage
  const saveCart = (cart) => localStorage.setItem('cart', JSON.stringify(cart))

  // Add item or increment qty if already in cart
  // item shape: { menuItemId, name, price, img? }
  const addToCart = (item) => {
    const cart = getCart()

    // menuItemId = real MongoDB _id (from GET /api/menu response)
    // id         = numeric fallback from local FoodCard.js data
    // We normalise to always store as menuItemId so Checkout can send it to the backend
    const itemId   = item._id || item.menuItemId || item.id
    const existing = cart.find((i) => (i.menuItemId || i.id) === itemId)

    if (existing) {
      existing.quantity += 1
    } else {
      cart.push({
        ...item,
        menuItemId: itemId,  // always set — used as key and sent to POST /api/orders
        quantity: 1,
      })
    }
    saveCart(cart)
  }

  // Remove single item by menuItemId (backend _id of the menu item)
  const removeFromCart = (menuItemId) => {
    // Match on either field — handles both backend and local items
    const updated = getCart().filter((i) => (i.menuItemId || i.id) !== menuItemId)
    saveCart(updated)
  }

  // Wipe entire cart — called after order is successfully placed
  const clearCart = () => localStorage.removeItem('cart')

  return { getCart, addToCart, removeFromCart, clearCart }
}

// ─────────────────────────────────────────────────────────────
// CartPage component
// ─────────────────────────────────────────────────────────────
export default function CartPage() {
  const { token }                              = useAuthStore()
  const navigate                               = useNavigate()
  const { getCart, removeFromCart, clearCart } = useCart()

  // Mirror localStorage in state so UI re-renders on mutations
  const [cartItems, setCartItems] = useState(getCart())

  const handleRemove = (menuItemId) => {
    removeFromCart(menuItemId)
    setCartItems(getCart())
    toast.success('Item removed')
  }

  const handleClear = () => {
    clearCart()
    setCartItems([])
    toast.success('Cart cleared')
  }

  // Guard before going to Checkout: need items + JWT token
  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) { toast.error('Your cart is empty!'); return }
    if (!token) { toast.error('Please login first!'); return navigate('/login') }
    navigate('/checkout')
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className='min-h-screen bg-[#1a1a1a]'>
      <Navbar />
      <div className='max-w-2xl mx-auto px-4 py-12'>

        <div className='flex items-center justify-center gap-3 mb-8'>
          <FaShoppingCart size={28} className='text-[#E87722]' />
          <h2 className='text-white text-4xl font-black uppercase tracking-widest'>Your Cart</h2>
        </div>

        {cartItems.length === 0 ? (
          /* ── Empty state ──────────────────────────────────── */
          <div className='flex flex-col items-center gap-4 text-center py-20'>
            <FaShoppingCart size={60} className='text-[#333]' />
            <p className='text-[#aaa] text-xl'>Your cart is empty</p>
            <button onClick={() => navigate('/menu')}
              className='bg-[#E87722] text-white font-bold px-8 py-3 rounded-xl uppercase hover:bg-orange-600 transition duration-300'>
              Browse Menu
            </button>
          </div>
        ) : (
          <div className='flex flex-col gap-4'>

            {/* ── Cart item rows ─────────────────────────────── */}
            {cartItems.map((item) => (
              // key = menuItemId (MongoDB _id of the menu item)
              <div key={item.menuItemId || item.id}
                className='bg-black/90 border border-[#3a1500] rounded-2xl px-6 py-4 flex items-center justify-between gap-4'>

                {/* Image or emoji fallback */}
                {item.img || item.image ? (
                  <img src={item.img || item.image} alt={item.name}
                    className='w-14 h-14 rounded-xl object-cover shrink-0' />
                ) : (
                  <div className='w-14 h-14 bg-[#1a1a1a] rounded-xl shrink-0 flex items-center justify-center text-2xl'>🍔</div>
                )}

                <div className='flex flex-col flex-1 min-w-0'>
                  <span className='text-white font-bold text-lg truncate'>{item.name}</span>
                  <span className='text-[#aaa] text-sm'>₱{item.price} × {item.quantity}</span>
                </div>

                <div className='flex items-center gap-4 shrink-0'>
                  <span className='text-[#E87722] font-black text-lg'>
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button onClick={() => handleRemove(item.menuItemId)}
                    className='text-red-500 hover:text-red-400 transition duration-200'>
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>
            ))}

            {/* ── Cart total ──────────────────────────────────── */}
            <div className='bg-black/90 border border-[#E87722] rounded-2xl px-6 py-4 flex justify-between items-center mt-2'>
              <span className='text-white font-black text-xl uppercase'>Total</span>
              <span className='text-[#E87722] font-black text-2xl'>₱{totalPrice.toFixed(2)}</span>
            </div>

            {/* ── Proceed to checkout ─────────────────────────── */}
            <button onClick={handleProceedToCheckout}
              className='w-full bg-[#E87722] hover:bg-orange-600 text-white font-black py-4 rounded-xl uppercase tracking-widest text-lg transition duration-300 mt-2'>
              Proceed to Checkout 🍔
            </button>

            {/* ── Clear cart ──────────────────────────────────── */}
            <button onClick={handleClear}
              className='w-full bg-[#191818] hover:bg-[#333] text-[#aaa] font-bold py-3 rounded-xl uppercase tracking-wide transition duration-300'>
              Clear Cart
            </button>

          </div>
        )}
      </div>
    </div>
  )
}