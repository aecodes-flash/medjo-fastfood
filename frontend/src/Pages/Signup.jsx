import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import logo from "../assets/logo.jpeg"
import { useAuthStore } from "../store/useAuthStore"

export default function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { register: registerUser, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
  try {
    await registerUser(data.username, data.email, data.password)
    navigate('/') // ← only runs if register succeeded
  } catch (error) {
    error.toast("Failed to create account.") // toast already shown in store, just don't navigate
  }
}
  const inputClass =
    "w-full bg-[#1e1e1e] text-white placeholder-[#555] px-5 py-3.5 rounded-xl " +
    "border border-[#2a2a2a] focus:border-[#e87722] outline-none transition-colors duration-200"

  return (
    <div className="min-h-screen flex">

      {/* LEFT — Logo background panel */}
      <div className="hidden md:flex w-1/2 bg-[#E87722] flex-col items-center justify-center gap-8 px-10 relative overflow-hidden">

        {/* Big faded logo as background */}
        <img
          src={logo}
          alt="bg"
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />

        {/* Content on top */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="bg-black/70 rounded-2xl p-8 flex flex-col items-center gap-4 w-64">
            <img
              src={logo}
              alt="Medjo Fast Food"
              className="w-24 h-24 rounded-full object-cover ring-4 ring-[#E87722]"
            />
            <p className="text-white font-black text-center tracking-widest text-sm uppercase">
              —Medjo Fast Food—
            </p>
          </div>
          <h1 className="text-white font-black text-3xl uppercase text-center tracking-wider">
            Order Your Favorite Food
          </h1>
        </div>
      </div>

      {/* RIGHT — Signup form */}
      <div className="w-full md:w-1/2 bg-[#111] flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md flex flex-col gap-5">

          {/* Mobile only logo */}
          <div className="flex justify-center md:hidden mb-2">
            <img src={logo} alt="logo"
              className="w-16 h-16 rounded-full object-cover border-2 border-[#e87722]" />
          </div>

          <div className="text-center">
            <h2 className="text-white text-4xl font-black uppercase tracking-widest">
              Sign Up
            </h2>
            <p className="text-[#555] text-sm mt-1">Create your account to start ordering.</p>
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
              className="w-full bg-[#e87722] hover:bg-[#c96510] text-white font-black py-3.5
                rounded-xl uppercase tracking-widest text-sm transition-all hover:scale-[1.01]
                disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {isLoading ? "Creating account..." : "Create Your Account"}
            </button>

          </form>

          <p className="text-center text-sm text-[#555]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#e87722] font-black hover:underline">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}