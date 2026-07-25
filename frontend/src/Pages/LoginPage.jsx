// ─── LoginPage.jsx ────────────────────────────────────────────
// Full-page login form. for user and admin (toggle at top). Calls useAuthStore.login on submit.
//
// When backend is ready:
//   The actual API call lives in useAuthStore.login
//   → POST /api/auth/login  { email, password }
//   Just uncomment the backend block inside useAuthStore.js.
//   No changes needed here — this page only calls store.login().
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../Store/useAuthStore";
import logo from "../assets/logo.png";
import toast from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [role, setRole] = useState("user");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields!");
      return;
    }
    await login(formData.email, formData.password);

    const user = useAuthStore.getState().user;
    if (!user) return;

    if (role === "admin") {
      if (user.role !== "admin") {
        toast.error("You don't have admin access.");
        return;
      }
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  const inputClass =
    "w-full bg-white/[0.04] text-white placeholder-[#666] px-5 py-3.5 rounded-xl " +
    "border border-white/10 focus:border-[#E87722] outline-none transition-colors duration-200";

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
        {/* signature: recreated wave mesh from the logo, in cyan + orange */}
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

      {/* RIGHT — Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8 py-12 font-body">
        <div className="w-full max-w-md flex flex-col gap-5">

          {/* Mobile only logo */}
          <div className="flex justify-center md:hidden mb-2">
            <div className="bg-white rounded-2xl p-3 w-40">
              <img src={logo} alt="RAESYN" className="w-full h-auto object-contain" />
            </div>
          </div>

          <div className="text-center">
            <h2 className="font-display text-4xl text-white tracking-widest">LOGIN</h2>
            <p className="text-[#666] text-sm mt-1">Welcome back! Enter your credentials.</p>
          </div>

          {/* Role toggle */}
          <div className="flex bg-white/30 rounded-xl p-1 border border-white/10 gap-1">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-black uppercase tracking-widest transition-all cursor-pointer
                ${role === "user" ? "bg-[#E87722] text-white" : "text-[#666] hover:text-[#999]"}`}>
              User
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-black uppercase tracking-widest transition-all cursor-pointer
                ${role === "admin" ? "bg-[#E87722] text-white" : "text-[#666] hover:text-[#999]"}`}>
              Admin
            </button>
          </div>

          {role === "admin" && (
            <p className="text-xs text-[#999] text-center border border-white/10 rounded-xl px-4 py-2 flex items-center justify-center gap-1.5">
              <span className="text-[#5EEAD4]">⚠</span> Only authorized accounts can access the admin panel.
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email */}
            <div>
              <label className="text-[#888] text-xs font-bold uppercase tracking-widest block mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@email.com"
                className={inputClass}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-[#888] text-xs font-bold uppercase tracking-widest block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className={inputClass + " pr-16"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#666] hover:text-[#E87722] transition cursor-pointer">
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E87722] hover:bg-white hover:text-[#161513] text-white font-black py-3.5
                rounded-xl uppercase tracking-widest text-sm transition-all hover:scale-[1.01]
                disabled:opacity-60 disabled:cursor-not-allowed mt-2 cursor-pointer">
              {isLoading ? "Logging in..." : `Login as ${role === "admin" ? "Admin" : "User"}`}
            </button>

          </form>

          <p className="text-center text-sm text-[#666]">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#E87722] font-black hover:underline">
              Sign Up
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}