// ─── Checkout.jsx ─────────────────────────────────────────────
// 3-step checkout flow:
//   Step 1 — Cart review (items, address, payment method)
//   Step 2 — Payment (GCash QR + reference OR Cash instructions)
//   Step 3 — Success screen
//
// Backend connections:
//   Step 1 → POST /api/orders   { items: [{ menuItemId, name, price, quantity }] }
//             orderController.placeOrder() calculates totalPrice server-side
//
//   Step 2 → POST /api/checkout { orderId, method, reference }
//             checkoutController.submitPayment()
//
// Order schema requirements (from Order.js):
//   menuItemId — MongoDB ObjectId (must be 24-char hex — from GET /api/menu _id)
//   name       — String
//   price      — Number
//   quantity   — Number (min: 1)
// ─────────────────────────────────────────────────────────────

import { useState, useRef }                        from 'react'
import { useNavigate }                             from 'react-router-dom'
import Navbar                                      from '../Components/Navbar'
import { useCart }                                 from './CartPage'
import { useAuthStore }                            from '../Store/useAuthStore'
import { FaCheckCircle, FaMobileAlt, FaMoneyBillWave } from 'react-icons/fa'
import axios                                       from 'axios'
import toast                                       from 'react-hot-toast'
import gcashQR from '../assets/gcashQR.jpg'

const API          = 'http://localhost:5001/api'
const DELIVERY_FEE = 49

export default function Checkout() {
  const navigate               = useNavigate()
  const { token }              = useAuthStore()
  const { getCart, clearCart } = useCart()

  // ── State ──────────────────────────────────────────────────
  const [cartItems,    setCartItems]    = useState(getCart())
  // checkedItems holds the menuItemId of each selected item (all checked by default)
  const [checkedItems, setCheckedItems] = useState(getCart().map(i => i.menuItemId))
  const [address,      setAddress]      = useState('')
  const [phone,        setPhone]        = useState('')
  const [payment,      setPayment]      = useState('cash')  // 'cash' | 'gcash'
  const [reference,    setReference]    = useState('')       // GCash reference number
  const [isLoading,    setIsLoading]    = useState(false)
  const [step,         setStep]         = useState(1)        // 1 | 2 | 3
  const [orderId,      setOrderId]      = useState(null)     // set after POST /api/orders
  // savedTotal: snapshot of total BEFORE cart is cleared — used on Step 2 & 3
  const [savedTotal,   setSavedTotal]   = useState(0)

  // useRef guard — prevents double-submit even if React hasn't re-rendered disabled yet
  const isSubmitting = useRef(false)

  // ── Derived values (Step 1 only — cart is cleared on Step 2+) ──
  const selected = cartItems.filter(i => checkedItems.includes(i.menuItemId))
  const subtotal  = selected.reduce((s, i) => s + i.price * i.quantity, 0)
  const total     = subtotal + DELIVERY_FEE

  // On Step 2/3 the cart is already cleared — use savedTotal instead
  const displayTotal = step === 1 ? total : savedTotal

  // ── Quantity stepper ───────────────────────────────────────
  const updateQuantity = (menuItemId, delta) => {
    const updated = cartItems.map(i =>
      i.menuItemId === menuItemId
        ? { ...i, quantity: Math.max(1, i.quantity + delta) }
        : i
    )
    setCartItems(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  // ── Remove item ────────────────────────────────────────────
  const removeItem = (menuItemId) => {
    const updated = cartItems.filter(i => i.menuItemId !== menuItemId)
    setCartItems(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
    setCheckedItems(prev => prev.filter(id => id !== menuItemId))
    toast.success('Item removed')
  }

  // ── Checkbox toggle ────────────────────────────────────────
  const toggleCheck = (menuItemId) => {
    setCheckedItems(prev =>
      prev.includes(menuItemId)
        ? prev.filter(id => id !== menuItemId)
        : [...prev, menuItemId]
    )
  }

  // ── STEP 1: Place order → POST /api/orders ─────────────────
  const handlePlaceOrder = async () => {
    // Ref guard: blocks second call on rapid clicks
    if (isSubmitting.current) return
    isSubmitting.current = true

    // Token — check both Zustand state and localStorage
    const currentToken = token || localStorage.getItem('token')
    if (!currentToken) {
      toast.error('Please login first!')
      isSubmitting.current = false
      return navigate('/login')
    }
    if (selected.length === 0) {
      toast.error('Please select at least one item!')
      isSubmitting.current = false
      return
    }
    if (!address.trim()) {
      toast.error('Please enter your delivery address!')
      isSubmitting.current = false
      return
    }
    if (!phone.trim() || phone.length < 11) {
      toast.error('Please enter a valid phone number!')
      isSubmitting.current = false
      return
    }

    // Build payload matching Order schema exactly:
    //   menuItemId — MongoDB ObjectId string (24 hex chars) from GET /api/menu
    //   name, price (Number), quantity (Number)
    const orderItems = selected.map(i => ({
      menuItemId: i.menuItemId,
      name:       i.name,
      price:      Number(i.price),
      quantity:   Number(i.quantity),
    }))

    // Guard: menuItemId must be a valid 24-char MongoDB ObjectId
    // Stale items from before backend was connected have numeric ids — auto-clear them
    const invalid = orderItems.filter(
      i => !i.menuItemId || String(i.menuItemId).length !== 24
    )
    if (invalid.length > 0) {
      localStorage.removeItem('cart')  // wipe the bad cart
      setCartItems([])
      setCheckedItems([])
      toast.error('Old cart items cleared — please re-add from the menu.', { duration: 4000 })
      isSubmitting.current = false
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      console.log('→ POST /api/orders payload:', { items: orderItems })

      // POST /api/orders — placeOrder() in orderController.js
      // totalPrice is calculated server-side: items.reduce(sum + price * qty)
      const res = await axios.post(
        `${API}/orders`,
        { items: orderItems },
        { headers: { Authorization: `Bearer ${currentToken}` } }
      )

      setOrderId(res.data.order._id)  // needed for POST /api/checkout
      setSavedTotal(total)            // snapshot before cart is wiped
      clearCart()
      setCartItems([])
      toast.success('Order placed! Proceed to payment 🍔')
      setStep(2)
    } catch (error) {
      console.error('✗ Order failed:', error.response?.data)
      if (error.response?.status === 429) {
        toast.error('Too many orders. Please wait an hour.', { duration: 6000 })
      } else {
        toast.error(error.response?.data?.message || 'Failed to place order')
      }
    } finally {
      setIsLoading(false)
      isSubmitting.current = false
    }
  }

  // ── STEP 2: Submit payment → POST /api/checkout ────────────
  const handleSubmitPayment = async () => {
    if (payment === 'gcash' && !reference.trim()) {
      toast.error('Please enter your GCash reference number!')
      return
    }
    const currentToken = token || localStorage.getItem('token')
    setIsLoading(true)
    try {
      // POST /api/checkout — submitPayment() in checkoutController.js
      // Schema: { orderId, method: 'cash'|'gcash', reference }
      await axios.post(
        `${API}/checkout`,
        { orderId, method: payment, reference },
        { headers: { Authorization: `Bearer ${currentToken}` } }
      )
      toast.success('Payment submitted! 🍔')
      setStep(3)
    } catch (error) {
      console.error('✗ Payment failed:', error.response?.data)
      toast.error(error.response?.data?.message || 'Failed to submit payment')
    } finally {
      setIsLoading(false)
    }
  }

  // ─────────────────────────────────────────────────────────
  // STEP 3 — Success screen
  // ─────────────────────────────────────────────────────────
  if (step === 3) return (
    <div className='min-h-screen bg-[#1a1a1a] flex flex-col'>
      <Navbar />
      <div className='flex-1 flex items-center justify-center px-4'>
        <div className='bg-black/90 border border-[#3a1500] rounded-2xl p-12 w-full max-w-md
          flex flex-col items-center gap-5 text-center'>
          <FaCheckCircle size={70} className='text-[#E87722]' />
          <h2 className='text-white text-3xl font-black uppercase tracking-widest'>
            Order Confirmed!
          </h2>
          <p className='text-[#aaa]'>
            Your payment has been submitted. We'll verify it shortly.
          </p>
          <div className='bg-[#1a1a1a] rounded-xl px-6 py-3 w-full'>
            <p className='text-[#666] text-sm'>Total Paid</p>
            {/* displayTotal — savedTotal snapshot, not live cart total */}
            <p className='text-[#E87722] font-black text-2xl'>₱{displayTotal.toFixed(2)}</p>
          </div>
          <button onClick={() => navigate('/orders')}
            className='w-full bg-[#E87722] hover:bg-orange-600 text-white font-black py-3
              rounded-xl uppercase tracking-widest transition duration-300'>
            View My Orders
          </button>
        </div>
      </div>
    </div>
  )

  // ─────────────────────────────────────────────────────────
  // STEP 2 — Payment screen
  // ─────────────────────────────────────────────────────────
  if (step === 2) return (
    <div className='min-h-screen bg-[#1a1a1a] flex flex-col'>
      <Navbar />
      <div className='flex-1 flex items-center justify-center px-4 py-12'>
        <div className='w-full max-w-4xl flex flex-col gap-6'>

          <h2 className='text-white text-4xl font-black uppercase tracking-widest text-center'>
            Payment
          </h2>

          {/* Order total — displayTotal keeps the correct amount after cart is cleared */}
          <div className='bg-black/90 border border-[#E87722] rounded-2xl px-8 py-4
            flex justify-between items-center'>
            <span className='text-white font-black text-lg uppercase'>Order Total</span>
            <span className='text-[#E87722] font-black text-3xl'>₱{displayTotal.toFixed(2)}</span>
          </div>

          {/* Payment method toggle */}
          <div className='flex gap-3'>
            <button onClick={() => setPayment('cash')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
                font-black uppercase border-2 transition duration-200
                ${payment === 'cash'
                  ? 'bg-[#E87722] border-[#E87722] text-white'
                  : 'bg-transparent border-[#333] text-[#aaa] hover:border-[#E87722]'}`}>
              <FaMoneyBillWave size={18} /> Cash
            </button>
            <button onClick={() => setPayment('gcash')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
                font-black uppercase border-2 transition duration-200
                ${payment === 'gcash'
                  ? 'bg-[#00a8e8] border-[#00a8e8] text-white'
                  : 'bg-transparent border-[#333] text-[#aaa] hover:border-[#00a8e8]'}`}>
              <FaMobileAlt size={18} /> GCash
            </button>
          </div>

          <div className='flex flex-col md:flex-row gap-6'>

            {/* LEFT — Instructions + submit button */}
            <div className='flex-1 bg-black/90 border border-[#3a1500] rounded-2xl p-6
              flex flex-col gap-5'>
              {payment === 'gcash' ? (
                <>
                  <h3 className='text-white font-black text-xl uppercase'>GCash Instructions</h3>
                  <ol className='flex flex-col gap-3 text-[#aaa] text-sm'>
                    {[
                      'Open your GCash app',
                      'Tap Send Money → GCash',
                      `Send ₱${displayTotal.toFixed(2)} to the number on the QR`,
                      'Take a screenshot of your receipt',
                      'Enter your 13-digit reference number below',
                      'Click Submit Payment',
                    ].map((s, i) => (
                      // key=i safe — static ordered list, never reordered
                      <li key={i} className='flex items-start gap-3'>
                        <span className='bg-[#E87722] text-white text-xs font-black
                          w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5'>
                          {i + 1}
                        </span>
                        {s}
                      </li>
                    ))}
                  </ol>
                  <div>
                    <label className='text-[#888] text-xs font-bold uppercase tracking-widest block mb-1.5'>
                      GCash Reference Number
                    </label>
                    <input
                      type='text'
                      placeholder='e.g. 1234567890123'
                      maxLength={13}
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      className='w-full bg-[#1e1e1e] text-white placeholder-[#555] px-5 py-3
                        rounded-xl border border-[#2a2a2a] focus:border-[#E87722] outline-none'
                    />
                    <p className='text-[#555] text-xs mt-1'>{reference.length}/13 digits</p>
                  </div>
                </>
              ) : (
                <>
                  <h3 className='text-white font-black text-xl uppercase'>Cash on Delivery</h3>
                  <div className='flex flex-col gap-3 text-[#aaa] text-sm'>
                    {[
                      'Prepare the exact amount in cash',
                      `Total to pay: ₱${displayTotal.toFixed(2)}`,
                      'Present your order number to the delivery rider',
                      'Pay cash upon receiving your order',
                    ].map((s, i) => (
                      // key=i safe — static ordered list
                      <div key={i} className='flex items-start gap-3'>
                        <span className='bg-[#E87722] text-white text-xs font-black
                          w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5'>
                          {i + 1}
                        </span>
                        {s}
                      </div>
                    ))}
                  </div>
                  <div className='bg-[#1a1a1a] rounded-xl p-4 text-center mt-2'>
                    <FaMoneyBillWave size={40} className='text-[#E87722] mx-auto mb-2' />
                    <p className='text-white font-bold'>Pay exact amount to the delivery rider</p>
                    <p className='text-[#555] text-sm'>No reference number needed</p>
                  </div>
                </>
              )}

              {/* Submit payment → POST /api/checkout */}
              <button onClick={handleSubmitPayment} disabled={isLoading}
                className='w-full bg-[#E87722] hover:bg-orange-600 disabled:opacity-50
                  text-white font-black py-4 rounded-xl uppercase tracking-widest
                  text-lg transition duration-300 mt-auto'>
                {isLoading ? 'Submitting...' : 'Submit Payment'}
              </button>
            </div>

            {/* RIGHT — GCash QR (only shown when gcash selected) */}
            {payment === 'gcash' && (
              <div className='w-full md:w-72 bg-black/90 border border-[#3a1500] rounded-2xl p-6
                flex flex-col items-center justify-center gap-4'>
                <h3 className='text-white font-black text-lg uppercase text-center'>Scan to Pay</h3>
                {/* Replace gcashQR.jpg in src/assets/ with your real QR code image */}
                <img src={gcashQR} alt='GCash QR Code' className='w-52 h-52 rounded-2xl object-cover' />
                <div className='bg-[#1a1a1a] rounded-xl px-4 py-2 text-center w-full'>
                  <p className='text-[#666] text-xs'>Gcash No. 0993 510 7977</p>
                  <p className='text-[#666] text-xs'>Amount to send</p>
                  <p className='text-[#E87722] font-black text-xl'>₱{displayTotal.toFixed(2)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  // ─────────────────────────────────────────────────────────
  // STEP 1 — Cart review + address + payment method
  // ─────────────────────────────────────────────────────────

  // Empty cart guard
  if (cartItems.length === 0) return (
    <div className='min-h-screen bg-[#1a1a1a] flex flex-col'>
      <Navbar />
      <div className='flex-1 flex items-center justify-center flex-col gap-4'>
        <div className='text-6xl'>🛒</div>
        <h2 className='text-white text-2xl font-black uppercase'>Your cart is empty</h2>
        <button onClick={() => navigate('/menu')}
          className='bg-[#E87722] text-white font-bold px-8 py-3 rounded-xl
            uppercase hover:bg-orange-600 transition duration-300'>
          Browse Menu
        </button>
      </div>
    </div>
  )

  return (
    <div className='min-h-screen bg-[#1a1a1a]'>
      <Navbar />
      <div className='max-w-6xl mx-auto px-6 py-8'>

        <h1 className='text-white text-4xl font-black uppercase tracking-widest mb-8 text-center'>
          Checkout
        </h1>

        {/* Step indicator — key=label (unique string, no index needed) */}
        <div className='flex items-center justify-center gap-2 mb-8'>
          {['Cart Review', 'Payment', 'Confirmed'].map((label, i) => (
            <div key={label} className='flex items-center gap-2'>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center
                font-black text-sm transition-colors
                ${step > i + 1 ? 'bg-green-500 text-white'
                  : step === i + 1 ? 'bg-[#E87722] text-white'
                  : 'bg-[#333] text-[#666]'}`}>
                {i + 1}
              </div>
              <span className={`text-sm font-bold hidden sm:block
                ${step === i + 1 ? 'text-[#E87722]' : 'text-[#555]'}`}>
                {label}
              </span>
              {i < 2 && <div className='w-8 h-0.5 bg-[#333]' />}
            </div>
          ))}
        </div>

        <div className='flex flex-col lg:flex-row gap-6'>

          {/* ── LEFT: Cart items ─────────────────────────────── */}
          <div className='flex-1 flex flex-col gap-4'>
            {/* key=menuItemId — MongoDB ObjectId from backend, guaranteed unique */}
            {cartItems.map(item => (
              <div key={item.menuItemId}
                className='bg-[#2a2a2a] rounded-2xl flex items-center gap-4 px-5 py-4
                  border border-[#333] hover:border-[#E87722]/40 transition-all'>

                <input type='checkbox'
                  checked={checkedItems.includes(item.menuItemId)}
                  onChange={() => toggleCheck(item.menuItemId)}
                  className='w-5 h-5 accent-[#E87722] cursor-pointer shrink-0' />

                {item.img || item.image ? (
                  <img src={item.img || item.image} alt={item.name}
                    className='w-16 h-16 rounded-xl object-cover shrink-0' />
                ) : (
                  <div className='w-16 h-16 bg-[#1a1a1a] rounded-xl shrink-0
                    flex items-center justify-center text-2xl'>🍔</div>
                )}

                <span className='text-white font-semibold text-lg flex-1 min-w-0 truncate'>
                  {item.name}
                </span>

                <span className='text-[#E87722] font-bold w-20 text-right shrink-0'>
                  ₱{(item.price * item.quantity).toFixed(2)}
                </span>

                {/* Qty stepper */}
                <div className='flex items-center bg-[#1a1a1a] border border-[#444]
                  rounded-xl overflow-hidden shrink-0'>
                  <button onClick={() => updateQuantity(item.menuItemId, -1)}
                    className='px-3 py-2 text-white font-bold hover:bg-[#E87722] transition duration-150'>
                    −
                  </button>
                  <span className='px-3 text-white font-bold text-sm'>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.menuItemId, 1)}
                    className='px-3 py-2 text-white font-bold hover:bg-[#E87722] transition duration-150'>
                    +
                  </button>
                </div>

                <button onClick={() => removeItem(item.menuItemId)}
                  className='text-[#666] hover:text-red-400 text-xl ml-2 transition shrink-0'>
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* ── RIGHT: Order summary sidebar ─────────────────── */}
          <div className='w-full lg:w-80 shrink-0'>
            <div className='bg-[#2a2a2a] rounded-2xl p-6 border border-[#333]
              sticky top-24 flex flex-col gap-4'>

              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full bg-[#1a1a1a] border-2 border-[#E87722]
                  flex items-center justify-center text-lg'>🍔</div>
                <h2 className='text-white font-black text-xl uppercase'>Order Summary</h2>
              </div>

              {/* Price rows — plain JSX, no .map() so no key needed */}
              <div className='flex flex-col gap-2'>
                <div className='flex justify-between text-[#aaa] text-sm'>
                  <span>Subtotal</span>
                  <span className='text-white font-semibold'>₱{subtotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between text-[#aaa] text-sm'>
                  <span>Delivery Fee</span>
                  <span className='text-white font-semibold'>₱{DELIVERY_FEE}</span>
                </div>
                <div className='flex justify-between text-white font-black
                  border-t border-[#444] pt-3 mt-1'>
                  <span>Total</span>
                  <span className='text-[#E87722] text-xl'>₱{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery address */}
              <div>
                <label className='text-[#888] text-xs font-bold uppercase tracking-widest block mb-1.5'>
                  Delivery Address
                </label>
                <input type='text' placeholder='Enter your address...'
                  value={address} onChange={e => setAddress(e.target.value)}
                  className='w-full bg-[#1a1a1a] border border-[#444] rounded-xl px-4 py-3
                    text-white text-sm placeholder-[#555] outline-none
                    focus:border-[#E87722] transition-colors' />
              </div>

              <div>
                <label className='text-[#888] text-xs font-bold uppercase tracking-widest block mb-1.5'>
                  Phone Number (for delivery rider)
                </label>
                <input type='text' placeholder='Enter your phone number...'
                  value={phone} onChange={e => setPhone(e.target.value)}
                  className='w-full bg-[#1a1a1a] border border-[#444] rounded-xl px-4 py-3
                    text-white text-sm placeholder-[#555] outline-none
                    focus:border-[#E87722] transition-colors' />
              </div>

              {/* Payment method */}
              <div>
                <label className='text-[#888] text-xs font-bold uppercase tracking-widest block mb-2'>
                  Payment Method
                </label>
                <div className='flex flex-col gap-2'>
                  <button onClick={() => setPayment('cash')}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all border-2
                      ${payment === 'cash'
                        ? 'bg-[#E87722] border-[#E87722] text-white'
                        : 'bg-transparent border-[#444] text-[#aaa] hover:border-[#E87722]'}`}>
                    💵 Cash on Delivery
                  </button>
                  <button onClick={() => setPayment('gcash')}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all border-2
                      ${payment === 'gcash'
                        ? 'bg-[#00a8e8] border-[#00a8e8] text-white'
                        : 'bg-transparent border-[#444] text-[#aaa] hover:border-[#00a8e8]'}`}>
                    📱 GCash
                  </button>
                </div>
              </div>

              <p className='text-[#555] text-xs text-center'>
                {selected.length} of {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} selected
              </p>

              {/* Place Order — POST /api/orders */}
              <button onClick={handlePlaceOrder}
                disabled={selected.length === 0 || isLoading}
                className='w-full py-4 bg-[#E87722] hover:bg-[#c96a10]
                  disabled:bg-[#555] disabled:cursor-not-allowed
                  text-white font-black text-sm uppercase tracking-widest rounded-xl
                  transition-all hover:scale-[1.02] active:scale-[0.98]'>
                {isLoading ? 'Placing Order...' : 'Place Order 🍔'}
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}