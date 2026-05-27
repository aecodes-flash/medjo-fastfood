import { useState, useEffect } from 'react'
import { useNavigate }         from 'react-router-dom'
import Navbar                  from './Navbar'
import { useAuthStore }        from '../Store/useAuthStore'
import { useCart }             from '../Pages/CartPage'
import axios                   from 'axios'
import toast                   from 'react-hot-toast'


const API = import.meta.env.VITE_API_URL + "/api"

const statusConfig = {
  Delivered: { border: 'border-l-[#22c55e]', badge: 'bg-[#22c55e] text-white' },
  Preparing: { border: 'border-l-[#e07b20]', badge: 'bg-[#e07b20] text-white' },
  Ready:     { border: 'border-l-[#3b82f6]', badge: 'bg-[#3b82f6] text-white' },
  Cancelled: { border: 'border-l-[#ef4444]', badge: 'bg-[#ef4444] text-white' },
  Pending:   { border: 'border-l-[#888]',    badge: 'bg-[#555]    text-white' },
}

export default function Orders() {
  const { token }      = useAuthStore()
  const { addToCart }  = useCart()
  const navigate       = useNavigate()

  const [orders,      setOrders]      = useState([])
  const [isLoading,   setIsLoading]   = useState(true)
  const [cancelling,  setCancelling]  = useState(null) // tracks which order is being cancelled

  // ── Fetch orders from backend on mount ────────────────────
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) { navigate('/login'); return }
      try {
        const res = await axios.get(`${API}/orders/history`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setOrders(res.data)
      } catch (error) {
        toast.error('Failed to load orders')
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [token])

  // ── Reorder — adds all items back to cart ─────────────────
  const handleReorder = (order) => {
    order.items.forEach(item => {
      addToCart({
        menuItemId: item.menuItemId || item._id,
        name:       item.name,
        price:      item.price,
        quantity:   1,
        img:        item.image || '',
      })
    })
    toast.success('Items added to cart! 🍔')
    navigate('/cart')
  }

  // ── Cancel order — only allowed when status is Pending ────
  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return
    setCancelling(orderId)
    try {
      await axios.patch(
        `${API}/orders/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      // Update status locally so UI reflects change immediately
      setOrders(prev =>
        prev.map(o => o._id === orderId ? { ...o, status: 'Cancelled' } : o)
      )
      toast.success('Order cancelled successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order')
    } finally {
      setCancelling(null)
    }
  }

  // ── Loading state ─────────────────────────────────────────
  if (isLoading) return (
    <div className='min-h-screen bg-[#111] flex flex-col'>
      <Navbar />
      <div className='flex-1 flex items-center justify-center'>
        <p className='text-[#E87722] text-xl font-black uppercase animate-pulse'>
          Loading Orders...
        </p>
      </div>
    </div>
  )

  return (
    <div className='min-h-screen bg-[#111]'>
      <Navbar />
      <div className='px-6 md:px-10 py-8 max-w-4xl mx-auto'>

        <h1 className="text-5xl font-black text-white uppercase mb-7">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className='flex flex-col items-center gap-4 py-20 text-center'>
            <div className='text-6xl'>📦</div>
            <p className='text-[#aaa] text-xl'>No orders yet</p>
            <button onClick={() => navigate('/menu')}
              className='bg-[#E87722] text-white font-bold px-8 py-3 rounded-xl uppercase hover:bg-orange-600 transition duration-300'>
              Order Now
            </button>
          </div>
        ) : (
          <div className='flex flex-col gap-4'>
            {orders.map(order => {
              const config = statusConfig[order.status] || statusConfig.Pending
              return (
                <div key={order._id}
                  className={`bg-[#2a2a2a] rounded-xl px-6 py-5 border-l-4 ${config.border} flex flex-col gap-3`}>

                  {/* Order header */}
                  <div className='flex items-center justify-between flex-wrap gap-2'>
                    <div className='flex flex-col'>
                      <span className='text-[#aaa] text-xs uppercase tracking-widest'>Order ID</span>
                      <span className='text-white font-bold text-sm'>
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full font-black text-xs ${config.badge}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Items list */}
                  <div className='flex flex-col gap-1'>
                    {order.items.map((item, i) => (
                      <div key={i} className='flex justify-between text-sm'>
                        <span className='text-[#ccc]'>{item.name} × {item.quantity}</span>
                        <span className='text-[#E87722] font-bold'>
                          ₱{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className='flex items-center justify-between border-t border-[#333] pt-3'>
                    <div className='flex flex-col'>
                      <span className='text-[#666] text-xs'>
                        {new Date(order.createdAt).toLocaleDateString('en-PH', {
                          year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                      <span className='text-[#E87722] font-black text-lg'>
                        ₱{order.totalPrice?.toFixed(2)}
                      </span>
                    </div>

                    <div className='flex gap-2'>
                      {/* Review button — only if delivered */}
                      {order.status === 'Delivered' && (
                        <button
                          onClick={() => navigate(`/review/${order._id}`)}
                          className='bg-[#333] hover:bg-[#444] text-white font-bold text-xs px-4 py-2 rounded-lg transition duration-150'>
                          Review
                        </button>
                      )}

                      {/* Cancel button — only if Pending */}
                      {order.status === 'Pending' && (
                        <button
                          onClick={() => handleCancel(order._id)}
                          disabled={cancelling === order._id}
                          className='bg-[#ef4444] hover:bg-[#dc2626] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs px-5 py-2 rounded-lg transition duration-150'>
                          {cancelling === order._id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}

                      {/* Reorder button */}
                      <button
                        onClick={() => handleReorder(order)}
                        className='bg-[#E87722] hover:bg-[#c96a10] text-white font-black text-xs px-5 py-2 rounded-lg transition duration-150'>
                        Reorder
                      </button>
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}