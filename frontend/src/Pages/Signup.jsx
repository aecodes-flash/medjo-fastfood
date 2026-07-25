import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import logo from "../assets/logo.png"
import { useAuthStore } from "../Store/useAuthStore"
import toast from "react-hot-toast"

export default function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { register: registerUser, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      await registerUser(data.username, data.email, data.password, data.phone, data.homeAddress)
      navigate('/') // ← only runs if register succeeded
    } catch (error) {
      toast.error("Failed to create account.") // toast already shown in store, this is a fallback
    }
  }

  const inputClass =
    "w-full bg-white/[0.04] text-white placeholder-[#666] px-5 py-3.5 rounded-xl " +
    "border border-white/10 focus:border-[#E87722] outline-none transition-colors duration-200"

  return (
    <div className="min-h-screen flex bg-[#161513]">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;800&display=swap');
        .font-display { font-family: 'Bebas Neue', 'Impact', sans-serif; letter-spacing: 0.03em; }
        .font-body { font-family: 'Inter', sans-serif; }
        @keyframes wave-drift { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-2%,3%) scale(1.05); } }
        .wave-a { animation: wave-drift 12s ease-in-out infinite; }
        .wave-b { animation: wave-drift 16s ease-in-out infinite reverse; }
      `}</style>

      {/* LEFT — brand panel */}
      <div className="hidden md:flex w-1/2 relative overflow-hidden items-center justify-center px-10 bg-[#0f0e0c]">
        <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice">
          <path className="wave-a" d="M -50,420 C 100,320 200,520 350,400 C 500,280 550,480 650,380 L 650,850 L -50,850 Z" fill="none" stroke="#5EEAD4" strokeWidth="1.5" opacity="0.5" />
          <path className="wave-a" d="M -50,460 C 100,360 200,560 350,440 C 500,320 550,520 650,420" fill="none" stroke="#5EEAD4" strokeWidth="1" opacity="0.3" />
          <path className="wave-b" d="M -50,340 C 120,440 220,240 380,340 C 500,410 560,300 650,360" fill="none" stroke="#E87722" strokeWidth="1.5" opacity="0.35" />
        </svg>
        <div className="absolute inset-0 bg-linear-to-b from-[#0f0e0c] via-transparent to-[#0f0e0c]"></div>

        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="bg-white rounded-3xl p-8 flex flex-col items-center shadow-2xl shadow-black/50 w-72">
            <img
              src={logo}
              alt="RAESYN"
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="text-center">
            <span className="text-[#E87722] font-bold tracking-[0.3em] text-xs">(Your Business Name)</span>
            <h1 className="font-display text-4xl text-white tracking-wide mt-2">
              ORDER YOUR FAVORITE FOOD
            </h1>
          </div>
        </div>
      </div>

      {/* RIGHT — Signup form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8 py-12 font-body">
        <div className="w-full max-w-md flex flex-col gap-5">

          {/* Mobile only logo */}
          <div className="flex justify-center md:hidden mb-2">
            <div className="bg-white rounded-2xl p-3 w-40">
              <img src={logo} alt="RAESYN" className="w-full h-auto object-contain" />
            </div>
          </div>

          <div className="text-center">
            <h2 className="font-display text-4xl text-white tracking-widest">SIGN UP</h2>
            <p className="text-[#666] text-sm mt-1">Create your account to start ordering.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

            {/* First + Last name */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-[#888] text-xs font-bold uppercase tracking-widest block mb-1.5">
                  First Name
                </label>
                <input
                  placeholder="First name"
                  className={inputClass}
                  {...register('firstName', { required: 'Required' })}
                />
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div className="flex-1">
                <label className="text-[#888] text-xs font-bold uppercase tracking-widest block mb-1.5">
                  Last Name
                </label>
                <input
                  placeholder="Last name"
                  className={inputClass}
                  {...register('lastName', { required: 'Required' })}
                />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="text-[#888] text-xs font-bold uppercase tracking-widest block mb-1.5">
                Username
              </label>
              <input
                placeholder="Username"
                className={inputClass}
                {...register('username', { required: 'Username is required' })}
              />
              {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-[#888] text-xs font-bold uppercase tracking-widest block mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={inputClass}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Minimum 8 characters' }
                })}
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="text-[#888] text-xs font-bold uppercase tracking-widest block mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Phone number"
                className={inputClass}
                {...register('phone', { required: 'Phone number is required' })}
              />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            {/* Home Address */}
            <div>
              <label className="text-[#888] text-xs font-bold uppercase tracking-widest block mb-1.5">
                Home Address
              </label>
              <input
                placeholder="Home address"
                className={inputClass}
                {...register('homeAddress', { required: 'Home address is required' })}
              />
              {errors.homeAddress && <p className="text-red-400 text-xs mt-1">{errors.homeAddress.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-[#888] text-xs font-bold uppercase tracking-widest block mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="you@email.com"
                className={inputClass}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' }
                })}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E87722] hover:bg-white hover:text-[#161513] text-white font-black py-3.5
                rounded-xl uppercase tracking-widest text-sm transition-all hover:scale-[1.01]
                disabled:opacity-60 disabled:cursor-not-allowed mt-2 cursor-pointer">
              {isLoading ? "Creating account..." : "Create Your Account"}
            </button>

          </form>

          <p className="text-center text-sm text-[#666]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#E87722] font-black hover:underline">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}