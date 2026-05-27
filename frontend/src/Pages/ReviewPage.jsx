import { useState }                    from 'react'
import { useParams, useNavigate }      from 'react-router-dom'
import { useAuthStore }                from '../Store/useAuthStore'
import StarRating                      from '../Components/StarRating'
import Navbar                          from '../Components/Navbar'
import axios                           from 'axios'
import toast                           from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL

const ReviewPage = () => {
  const { orderId }  = useParams()
  const navigate     = useNavigate()
  const { token }    = useAuthStore()

  const [rating,  setRating]  = useState(0)
  const [comment, setComment] = useState('')

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a star rating!')
      return
    }
    if (!comment.trim()) {
      toast.error('Please write a comment!')
      return
    }

    try {
      const currentToken = token || localStorage.getItem('token')
      await axios.post(
      `${API}/api/reviews`,
      { orderId, rating, comment },
      { headers: { Authorization: `Bearer ${currentToken}` } }
    )
      toast.success('Review submitted! Thank you! 🍔')
      navigate('/orders')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review')
    }
  }


  return (
    <div className='min-h-screen bg-[#1a1a1a] flex flex-col'>
      <Navbar />
      <div className='flex-1 flex items-center justify-center px-4 py-12'>
        <div className='bg-black/90 border border-[#3a1500] rounded-2xl p-10 w-full max-w-md flex flex-col gap-5'>

          <h2 className='text-white text-3xl font-black uppercase tracking-wide text-center'>
            Rate Your Order
          </h2>
          <p className='text-[#aaa] text-sm text-center'>How was your experience?</p>

          {/* Star rating component */}
          <StarRating rating={rating} setRating={setRating} />

          {/* Show selected rating text */}
          <p className='text-center text-[#E87722] font-bold text-sm'>
            {rating === 0 && 'Select a rating'}
            {rating === 1 && '⭐ Poor'}
            {rating === 2 && '⭐⭐ Fair'}
            {rating === 3 && '⭐⭐⭐ Good'}
            {rating === 4 && '⭐⭐⭐⭐ Very Good'}
            {rating === 5 && '⭐⭐⭐⭐⭐ Excellent!'}
          </p>

          {/* Comment box */}
          <textarea
            className='w-full bg-[#191818] text-white placeholder-[#666] px-5 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#E87722] resize-none'
            placeholder='Write your feedback here...'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className='w-full bg-[#E87722] hover:bg-orange-600 text-white font-black py-3 rounded-xl uppercase tracking-widest transition duration-300'>
            Submit Review
          </button>

          {/* Cancel */}
          <button
            onClick={() => navigate('/orders')}
            className='w-full bg-transparent border border-[#333] hover:border-[#E87722] text-[#aaa] font-bold py-2 rounded-xl uppercase text-sm transition duration-300'>
            Cancel
          </button>

        </div>
      </div>
    </div>
  )
}

export default ReviewPage