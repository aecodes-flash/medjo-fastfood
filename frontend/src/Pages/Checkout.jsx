// ─── Checkout.jsx ─────────────────────────────────────────────
// 3-step checkout flow:
//   Step 1 — Cart review (items, address, phone) → just validates & moves to Step 2
//            NO API call here — nothing is saved to the DB yet.
//   Step 2 — Payment method + confirm
//            This is where the order is ACTUALLY created:
//              1) POST /api/orders     → orderController.placeOrder()
//              2) POST /api/checkout   → checkoutController.submitPayment()
//            Both happen together, only when the user clicks "Submit Payment".
//   Step 3 — Success screen
//
// Order schema requirements (from Order.js):
//   menuItemId — MongoDB ObjectId (must be 24-char hex — from GET /api/menu _id)
//   name       — String
//   price      — Number
//   quantity   — Number (min: 1)
//   img        — String (image field name — must match this, NOT "image")
// ─────────────────────────────────────────────────────────────

import { useState, useRef }                        from 'react'
import { useNavigate }                             from 'react-router-dom'
import Navbar                                      from '../Components/Navbar'
import { useCart }                                 from './CartPage'
import { useAuthStore }                            from '../Store/useAuthStore'
import { FaCheckCircle, FaMobileAlt, FaMoneyBillWave } from 'react-icons/fa'
import axios                                       from 'axios'
import toast                                       from 'react-hot-toast'
import gcashQR                                     from '../assets/gcashQR.jpg'
import logo                                        from '../assets/logo.png'


const API = import.meta.env.VITE_API_URL + "/api"
const DELIVERY_FEE = 49

// shared font + keyframe styles, injected once per screen (kept as a plain string
// so it can just be dropped into each returned tree below without touching logic)
const BrandStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;800&display=swap');
    .font-display { font-family: 'Bebas Neue', 'Impact', sans-serif; letter-spacing: 0.03em; }
    .font-body { font-family: 'Inter', sans-serif; }
  `}</style>
)

export default function Checkout() {
  const navigate               = useNavigate()
  const { token, user }              = useAuthStore()
  const { getCart, clearCart } = useCart()

  // ── State ──────────────────────────────────────────────────
  const [cartItems,    setCartItems]    = useState(getCart())
  // checkedItems holds the menuItemId of each selected item (all checked by default)
  const [checkedItems, setCheckedItems] = useState(getCart().map(i => i.menuItemId))
  const [address,      setAddress]      = useState(user?.homeAddress || '')
  const [phone,        setPhone]        = useState(user?.phone || '')
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

  // ── Build the order items payload (shared by validation + submit) ──
  const buildOrderItems = () =>
    selected.map(i => ({
      menuItemId: i.menuItemId,
      name:       i.name,
      price:      Number(i.price),
      quantity:   Number(i.quantity),
      img:        i.img || i.image || "", // schema field is "img" — must match exactly
    }))

  // ── STEP 1 → STEP 2: Validate details, move to payment screen ──────
  // IMPORTANT: no API call here. Nothing is saved to the database yet.
  // The order is only created once the user confirms payment in Step 2.
  const goToPayment = () => {
    const currentToken = token || localStorage.getItem('token')
    if (!currentToken) {
      toast.error('Please login first!')
      return navigate('/login')
    }
    if (selected.length === 0) {
      toast.error('Please select at least one item!')
      return
    }
    if (!address.trim()) {
      toast.error('Please enter your delivery address!')
      return
    }
    const phoneStr = String(phone || '')
    if (!phoneStr.trim() || phoneStr.length < 10) {
      toast.error('Please enter a valid phone number!')
      return
    }

    const orderItems = buildOrderItems()

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
      return
    }

    setSavedTotal(total)  // snapshot total for Step 2/3 display
    setStep(2)             // just moves screens — nothing saved to DB yet
  }

  // ── STEP 2: Confirm payment → creates the order, THEN submits payment ──
  // This is the ONLY place that touches the database for order creation.
  // If the user backs out before this point, nothing exists in the DB.
  const handleSubmitPayment = async () => {
    if (isSubmitting.current) return
    isSubmitting.current = true

    if (payment === 'gcash' && !reference.trim()) {
      toast.error('Please enter your GCash reference number!')
      isSubmitting.current = false
      return
    }

    const currentToken = token || localStorage.getItem('token')
    if (!currentToken) {
      toast.error('Please login first!')
      isSubmitting.current = false
      return navigate('/login')
    }

    const orderItems = buildOrderItems()
    if (orderItems.length === 0) {
      toast.error('Your order is empty — please go back and select items.')
      isSubmitting.current = false
      return
    }

    setIsLoading(true)
    try {
      console.log('→ POST /api/orders payload:', { items: orderItems })

      // 1. Create the order NOW — this is the actual "place order" moment
      // placeOrder() in orderController.js — totalPrice is calculated server-side
      const orderRes = await axios.post(
        `${API}/orders`,
        { items: orderItems, address, phone, paymentMethod: payment },
        { headers: { Authorization: `Bearer ${currentToken}` } }
      )
      const newOrderId = orderRes.data.order._id
      setOrderId(newOrderId)

      // 2. Immediately submit payment info for that order
      // submitPayment() in checkoutController.js — Schema: { orderId, method, reference }
      await axios.post(
        `${API}/checkout`,
        { orderId: newOrderId, method: payment, reference },
        { headers: { Authorization: `Bearer ${currentToken}` } }
      )

      clearCart()
      setCartItems([])
      toast.success('Order placed! 🍔')
      setStep(3)
    } catch (error) {
      console.error('✗ Order/payment failed:', error.response?.data)
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

  // ─────────────────────────────────────────────────────────
  // STEP 3 — Success screen
  // ─────────────────────────────────────────────────────────
  if (step === 3) return (
    <div className='min-h-screen bg-[#161513] flex flex-col font-body'>
      <BrandStyles />
      <Navbar />
      <div className='flex-1 flex items-center justify-center px-4'>
        <div className='bg-white/03 border border-white/10 rounded-3xl p-12 w-full max-w-md
          flex flex-col items-center gap-5 text-center shadow-2xl shadow-black/40'>
          <div className='w-20 h-20 rounded-full bg-[#E87722]/10 flex items-center justify-center'>
            <FaCheckCircle size={44} className='text-[#E87722]' />
          </div>
          <h2 className='font-display text-4xl text-white tracking-widest'>
            Order Confirmed!
          </h2>
          <p className='text-[#999] text-sm leading-relaxed'>
            Your payment has been submitted. We'll verify it shortly.
          </p>
          <div className='bg-white/03 border border-white/5 rounded-2xl px-6 py-4 w-full'>
            <p className='text-[#666] text-xs uppercase tracking-widest font-bold'>Total Paid</p>
            {/* displayTotal — savedTotal snapshot, not live cart total */}
            <p className='text-[#E87722] font-display text-3xl tracking-wide'>₱{displayTotal.toFixed(2)}</p>
          </div>
          <button onClick={() => navigate('/orders')}
            className='w-full bg-[#E87722] hover:bg-white hover:text-[#161513] text-white font-black py-3.5
              rounded-xl uppercase tracking-widest text-sm transition-all duration-300 hover:scale-[1.01] cursor-pointer'>
            View My Orders
          </button>
        </div>
      </div>
    </div>
  )

  // ─────────────────────────────────────────────────────────
  // STEP 2 — Payment screen (order is created on confirm)
  // ─────────────────────────────────────────────────────────
  if (step === 2) return (
    <div className='min-h-screen bg-[#161513] flex flex-col font-body'>
      <BrandStyles />
      <Navbar />
      <div className='flex-1 flex items-center justify-center px-4 py-12'>
        <div className='w-full max-w-4xl flex flex-col gap-6'>

          <div className='text-center'>
            <span className='text-[#E87722] font-bold tracking-[0.3em] text-xs'>STEP 2 OF 3</span>
            <h2 className='font-display text-4xl md:text-5xl text-white tracking-widest'>
              Payment
            </h2>
          </div>

          {/* Order total — displayTotal keeps the correct amount after cart is cleared */}
          <div className='bg-white/03 border border-[#E87722]/40 rounded-2xl px-8 py-4
            flex justify-between items-center'>
            <span className='text-white font-black text-sm uppercase tracking-widest'>Order Total</span>
            <span className='text-[#E87722] font-display text-3xl tracking-wide'>₱{displayTotal.toFixed(2)}</span>
          </div>

          {/* Payment method toggle */}
          <div className='flex gap-3'>
            <button onClick={() => setPayment('cash')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl cursor-pointer
                font-black uppercase text-sm tracking-wide border-2 transition duration-200
                ${payment === 'cash'
                  ? 'bg-[#E87722] border-[#E87722] text-white shadow-lg shadow-[#E87722]/20'
                  : 'bg-transparent border-white/10 text-[#999] hover:border-[#E87722]/50'}`}>
              <FaMoneyBillWave size={18} /> Cash
            </button>
            <button onClick={() => setPayment('gcash')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl cursor-pointer
                font-black uppercase text-sm tracking-wide border-2 transition duration-200
                ${payment === 'gcash'
                  ? 'bg-[#22B8CF] border-[#22B8CF] text-white shadow-lg shadow-[#22B8CF]/20'
                  : 'bg-transparent border-white/10 text-[#999] hover:border-[#22B8CF]/50'}`}>
              <FaMobileAlt size={18} /> GCash
            </button>
          </div>

          <div className='flex flex-col md:flex-row gap-6'>

            {/* LEFT — Instructions + submit button */}
            <div className='flex-1 bg-white/03 border border-white/10 rounded-2xl p-6
              flex flex-col gap-5'>
              {payment === 'gcash' ? (
                <>
                  <h3 className='font-display text-2xl text-white tracking-wide'>GCash Instructions</h3>
                  <ol className='flex flex-col gap-3 text-[#999] text-sm'>
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
                        <span className='bg-[#22B8CF] text-[#161513] text-xs font-black
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
                      className='w-full bg-white/04 text-white placeholder-[#666] px-5 py-3
                        rounded-xl border border-white/10 focus:border-[#22B8CF] outline-none transition-colors'
                    />
                    <p className='text-[#555] text-xs mt-1'>{reference.length}/13 digits</p>
                  </div>
                </>
              ) : (
                <>
                  <h3 className='font-display text-2xl text-white tracking-wide'>Cash on Delivery</h3>
                  <div className='flex flex-col gap-3 text-[#999] text-sm'>
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
                  <div className='bg-white/03 border border-white/5 rounded-xl p-4 text-center mt-2'>
                    <FaMoneyBillWave size={36} className='text-[#E87722] mx-auto mb-2' />
                    <p className='text-white font-bold text-sm'>Pay exact amount to the delivery rider</p>
                    <p className='text-[#666] text-xs mt-1'>No reference number needed</p>
                  </div>
                </>
              )}

              {/* Confirm & Submit — THIS is the button that creates the order in the DB */}
              <button onClick={handleSubmitPayment} disabled={isLoading}
                className='w-full bg-[#E87722] hover:bg-white hover:text-[#161513] disabled:opacity-50
                  text-white font-black py-4 rounded-xl uppercase tracking-widest
                  text-lg transition-all duration-300 mt-auto cursor-pointer disabled:cursor-not-allowed'>
                {isLoading ? 'Placing Order...' : 'Confirm & Place Order'}
              </button>

              {/* Back to cart review — safe, nothing has been saved yet */}
              <button onClick={() => setStep(1)} disabled={isLoading}
                className='w-full bg-transparent border border-white/10 hover:border-[#E87722]
                  text-[#999] hover:text-[#E87722] font-bold py-3 rounded-xl
                  uppercase tracking-wide text-sm transition-all duration-300 cursor-pointer disabled:cursor-not-allowed'>
                ← Back to Cart Review
              </button>
            </div>

            {/* RIGHT — GCash QR (only shown when gcash selected) */}
            {payment === 'gcash' && (
              <div className='w-full md:w-72 bg-white/03 border border-white/10 rounded-2xl p-6
                flex flex-col items-center justify-center gap-4'>
                <h3 className='font-display text-xl text-white tracking-wide text-center'>Scan to Pay</h3>
                {/* Replace gcashQR.jpg in src/assets/ with your real QR code image */}
                <div className='p-2 bg-white rounded-2xl'>
                  <img src={gcashQR} alt='GCash QR Code' className='w-48 h-48 rounded-xl object-cover' />
                </div>
                <div className='bg-white/04 border border-white/5 rounded-xl px-4 py-3 text-center w-full'>
                  <p className='text-[#777] text-xs'>Gcash No. 0993 510 7977</p>
                  <p className='text-[#666] text-xs mt-1'>Amount to send</p>
                  <p className='text-[#22B8CF] font-display text-2xl tracking-wide'>₱{displayTotal.toFixed(2)}</p>
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
  // No API call happens on this screen — "Continue" just moves to Step 2.
  // ─────────────────────────────────────────────────────────

  // Empty cart guard
  // if (cartItems.length === 0) return (
  //   <div className='min-h-screen bg-[#1a1a1a] flex flex-col'>
  //     <Navbar />
  //     <div className='flex-1 flex items-center justify-center flex-col gap-4'>
  //       <div className='text-6xl'>🛒</div>
  //       <h2 className='text-white text-2xl font-black uppercase'>Your cart is empty</h2>
  //       <button onClick={() => navigate('/menu')}
  //         className='bg-[#E87722] text-white font-bold px-8 py-3 rounded-xl
  //           uppercase hover:bg-orange-600 transition duration-300'>
  //         Browse Menu
  //       </button>
  //     </div>
  //   </div>
  // )

  return (
    <div className='min-h-screen bg-[#161513] font-body'>
      <BrandStyles />
      <Navbar />
      <div className='max-w-6xl mx-auto px-6 py-10'>

        <div className='text-center mb-8'>
          <span className='text-[#E87722] font-bold tracking-[0.3em] text-xs'>STEP 1 OF 3</span>
          <h1 className='font-display text-4xl md:text-5xl text-white tracking-widest'>
            Checkout
          </h1>
        </div>

        {/* Step indicator — key=label (unique string, no index needed) */}
        <div className='flex items-center justify-center gap-2 mb-10'>
          {['Cart Review', 'Payment', 'Confirmed'].map((label, i) => (
            <div key={label} className='flex items-center gap-2'>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center
                font-black text-sm transition-colors
                ${step > i + 1 ? 'bg-emerald-500 text-white'
                  : step === i + 1 ? 'bg-[#E87722] text-white'
                  : 'bg-white/5 text-[#666]'}`}>
                {i + 1}
              </div>
              <span className={`text-sm font-bold hidden sm:block
                ${step === i + 1 ? 'text-[#E87722]' : 'text-[#555]'}`}>
                {label}
              </span>
              {i < 2 && <div className='w-8 h-0.5 bg-white/10' />}
            </div>
          ))}
        </div>

        <div className='flex flex-col lg:flex-row gap-6'>

          {/* ── LEFT: Cart items ─────────────────────────────── */}
          <div className='flex-1 flex flex-col gap-4'>
            {/* key=menuItemId — MongoDB ObjectId from backend, guaranteed unique */}
            {cartItems.map(item => (
              <div key={item.menuItemId}
                className='bg-white/03 rounded-2xl flex items-center gap-4 px-5 py-4
                  border border-white/5 hover:border-[#E87722]/40 transition-all duration-200'>

                <input type='checkbox'
                  checked={checkedItems.includes(item.menuItemId)}
                  onChange={() => toggleCheck(item.menuItemId)}
                  className='w-5 h-5 accent-[#E87722] cursor-pointer shrink-0' />

                {item.img || item.image ? (
                  <img src={item.image || item.img} alt={item.name}
                    className='w-16 h-16 rounded-xl object-cover shrink-0 ring-1 ring-white/5' />
                ) : (
                  <div className='w-16 h-16 bg-white/5 rounded-xl shrink-0
                    flex items-center justify-center text-2xl'>🍔</div>
                )}

                <span className='text-white font-semibold text-lg flex-1 min-w-0 truncate'>
                  {item.name}
                </span>

                <span className='text-[#E87722] font-bold w-20 text-right shrink-0'>
                  ₱{(item.price * item.quantity).toFixed(2)}
                </span>

                {/* Qty stepper */}
                <div className='flex items-center bg-white/04 border border-white/10
                  rounded-xl overflow-hidden shrink-0'>
                  <button onClick={() => updateQuantity(item.menuItemId, -1)}
                    className='px-3 py-2 text-white font-bold hover:bg-[#E87722] transition duration-150 cursor-pointer'>
                    −
                  </button>
                  <span className='px-3 text-white font-bold text-sm'>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.menuItemId, 1)}
                    className='px-3 py-2 text-white font-bold hover:bg-[#E87722] transition duration-150 cursor-pointer'>
                    +
                  </button>
                </div>

                <button onClick={() => removeItem(item.menuItemId)}
                  className='text-[#666] hover:text-red-400 text-xl ml-2 transition shrink-0 cursor-pointer'>
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* ── RIGHT: Order summary sidebar ─────────────────── */}
          <div className='w-full lg:w-80 shrink-0'>
            <div className='bg-white/03 rounded-2xl p-6 border border-white/10
              sticky top-24 flex flex-col gap-4 shadow-xl shadow-black/30'>

              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full overflow-hidden border-2 border-[#E87722] shrink-0 bg-white'>
                  <img src={logo} alt='Logo' className='w-full h-full object-contain' />
                  </div>
                <h2 className='font-display text-xl text-white tracking-wide'>Order Summary</h2>
              </div>

              {/* Price rows — plain JSX, no .map() so no key needed */}
              <div className='flex flex-col gap-2'>
                <div className='flex justify-between text-[#999] text-sm'>
                  <span>Subtotal</span>
                  <span className='text-white font-semibold'>₱{subtotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between text-[#999] text-sm'>
                  <span>Delivery Fee</span>
                  <span className='text-white font-semibold'>₱{DELIVERY_FEE}</span>
                </div>
                <div className='flex justify-between text-white font-black
                  border-t border-white/10 pt-3 mt-1'>
                  <span>Total</span>
                  <span className='text-[#E87722] font-display text-2xl tracking-wide'>₱{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery address */}
    {user?.homeAddress && (
  <div className='flex flex-col gap-2'>
    <label className='text-[#888] text-xs font-bold uppercase tracking-widest block'>
      Use Saved Address
    </label>
    <label className='flex items-center gap-3 cursor-pointer'>
      <input type='checkbox' className='w-4 h-4 accent-[#E87722]'
        checked={address === user.homeAddress}
        onChange={e => setAddress(e.target.checked ? user.homeAddress : '')}
      />
      <span className='text-[#999] text-sm'>🏠 Home — {user.homeAddress}</span>
    </label>
  </div>
)}
              <div>
                <label className='text-[#888] text-xs font-bold uppercase tracking-widest block mb-1.5'>
                  Delivery Address
                </label>
                <input type='text' placeholder='Enter your address...'
                  value={address} onChange={e => setAddress(e.target.value)}
                  className='w-full bg-white/04 border border-white/10 rounded-xl px-4 py-3
                    text-white text-sm placeholder-[#666] outline-none
                    focus:border-[#E87722] transition-colors' />
              </div>

              <div>
                <label className='text-[#888] text-xs font-bold uppercase tracking-widest block mb-1.5'>
                  Phone Number (for delivery rider)
                </label>
                <input type='text' placeholder='Enter your phone number...'
                  value={phone} onChange={e => setPhone(e.target.value)}
                  className='w-full bg-white/04 border border-white/10 rounded-xl px-4 py-3
                    text-white text-sm placeholder-[#666] outline-none
                    focus:border-[#E87722] transition-colors' />
              </div>

              {/* Payment method */}
              <div>
                <label className='text-[#888] text-xs font-bold uppercase tracking-widest block mb-2'>
                  Payment Method
                </label>
                <div className='flex flex-col gap-2'>
                  <button onClick={() => setPayment('cash')}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all border-2 cursor-pointer
                      ${payment === 'cash'
                        ? 'bg-[#E87722] border-[#E87722] text-white'
                        : 'bg-transparent border-white/10 text-[#999] hover:border-[#E87722]/50'}`}>
                    💵 Cash on Delivery
                  </button>
                  <button onClick={() => setPayment('gcash')}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all border-2 cursor-pointer
                      ${payment === 'gcash'
                        ? 'bg-[#22B8CF] border-[#22B8CF] text-white'
                        : 'bg-transparent border-white/10 text-[#999] hover:border-[#22B8CF]/50'}`}>
                    📱 GCash
                  </button>
                </div>
              </div>

              <p className='text-[#666] text-xs text-center'>
                {selected.length} of {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} selected
              </p>

              {/* Continue to Payment — NO API call, just moves to Step 2 */}
              <button onClick={goToPayment}
                disabled={selected.length === 0}
                className='w-full py-4 bg-[#E87722] hover:bg-white hover:text-[#161513]
                  disabled:bg-white/10 disabled:text-[#666] disabled:cursor-not-allowed
                  text-white font-black text-sm uppercase tracking-widest rounded-xl
                  transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer'>
                Continue to Payment 🍔
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}