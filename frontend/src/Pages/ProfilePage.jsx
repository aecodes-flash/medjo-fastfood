import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../Store/useAuthStore'
import Navbar from '../components/Navbar'
import { FaUserCircle } from 'react-icons/fa'
import toast from 'react-hot-toast'
import axios from 'axios'

const API = 'http://localhost:5001/api'

export default function ProfilePage() {
  const { user, token, logout } = useAuthStore()
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState(user?.username || '')
  const [email, setEmail]       = useState(user?.email    || '')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSave = async () => {
    if (!username.trim() || !email.trim()) {
      toast.error('Username and email cannot be empty!')
      return
    }

    setIsLoading(true)
    try {
      const res = await axios.put(
        `${API}/profile`,
        { username, email },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      // Update localStorage + Zustand store with new user data
      const updatedUser = res.data.user
      localStorage.setItem('user', JSON.stringify(updatedUser))
      useAuthStore.setState({ user: updatedUser })

      toast.success('Profile updated!')
      setIsEditing(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-[#1a1a1a]'>
      <Navbar />
      <div className='flex items-center justify-center px-4 py-16'>
        <div className='bg-black/90 border border-[#3a1500] rounded-2xl p-10 w-full max-w-md flex flex-col gap-6'>

          {/* Avatar */}
          <div className='flex flex-col items-center gap-3'>
            <FaUserCircle size={90} className='text-[#E87722]' />
            <h2 className='text-white text-3xl font-black uppercase tracking-wide'>
              {user?.username || 'Guest'}
            </h2>
            <span className='bg-[#E87722] text-white text-xs font-bold px-4 py-1 rounded-full uppercase'>
              {user?.role || 'user'}
            </span>
          </div>

          <hr className='border-[#3a1500]' />

          {/* Fields */}
          <div className='flex flex-col gap-4'>
            <div>
              <label className='text-[#aaa] text-sm mb-1 block'>Username</label>
              <input
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!isEditing}
                className='w-full bg-[#191818] text-white placeholder-[#888] px-5 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#E87722] disabled:opacity-50'
              />
            </div>
            <div>
              <label className='text-[#aaa] text-sm mb-1 block'>Email</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className='w-full bg-[#191818] text-white placeholder-[#888] px-5 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#E87722] disabled:opacity-50'
              />
            </div>
          </div>

          {/* Buttons */}
          {isEditing ? (
            <div className='flex gap-3'>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className='flex-1 bg-[#E87722] text-white font-bold py-3 rounded-xl uppercase tracking-wide hover:bg-orange-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed'>
                {isLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setUsername(user?.username || '')
                  setEmail(user?.email || '')
                }}
                disabled={isLoading}
                className='flex-1 bg-[#191818] text-white font-bold py-3 rounded-xl uppercase tracking-wide hover:bg-[#333] transition duration-300'>
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className='w-full bg-white text-black hover:bg-[#E87722] hover:text-white font-bold py-3 rounded-xl uppercase tracking-wide transition duration-300'>
              Edit Profile
            </button>
          )}

          <button
            onClick={handleLogout}
            className='w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl uppercase tracking-wide transition duration-300'>
            Logout
          </button>

        </div>
      </div>
    </div>
  )
}