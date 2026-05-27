// ─── LoginPage.jsx ────────────────────────────────────────────
// Full-page login form. for user and admin (toggle at top). Calls useAuthStore.login on submit.
//
// When backend is ready:
//   The actual API call lives in useAuthStore.login
//   → POST /api/auth/login  { email, password }
//   Just uncomment the backend block inside useAuthStore.js.
//   No changes needed here — this page only calls store.login().
// ─────────────────────────────────────────────────────────────


// ─── LoginPage.jsx ────────────────────────────────────────────
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../Store/useAuthStore";
import logo from "../assets/Logo.jpeg";
import toast from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [role, setRole] = useState("user"); // ← added

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields!");
      return;
    }
    await login(formData.email, formData.password);

    // ← updated: check role after login
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
    "w-full bg-[#1e1e1e] text-white placeholder-[#555] px-5 py-3.5 rounded-xl " +
    "border border-[#2a2a2a] focus:border-[#e87722] outline-none transition-colors duration-200";

  return (
    <div className="min-h-screen flex">

      {/* LEFT — Logo background panel */}
      <div className="hidden md:flex w-1/2 bg-[#E87722] flex-col items-center justify-center gap-8 px-10 relative overflow-hidden">
        <img
          src={logo}
          alt="bg"
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="bg-black/70 rounded-2xl p-8 flex flex-col items-center gap-4 w-64">
            <img
              src={logo}
              alt="Medjo Fast Food"
              className="w-24 h-24 rounded-full object-cover ring-4 ring-[#E87722]"
            />
            <p className="text-white font-black text-center tracking-widest text-sm uppercase">
              — Medjo Fast Food—
            </p>
          </div>
          <h1 className="text-white font-black text-3xl uppercase text-center tracking-wider">
            Order Your Favorite Food
          </h1>
        </div>
      </div>

      {/* RIGHT — Login form */}
      <div className="w-full md:w-1/2 bg-[#111] flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md flex flex-col gap-5">

          {/* Mobile only logo */}
          <div className="flex justify-center md:hidden mb-2">
            <img src={logo} alt="logo"
              className="w-16 h-16 rounded-full object-cover border-2 border-[#e87722]" />
          </div>

          <div className="text-center">
            <h2 className="text-white text-4xl font-black uppercase tracking-widest">
              LOGIN
            </h2>
            <p className="text-[#555] text-sm mt-1">Welcome back! Enter your credentials.</p>
          </div>

          {/* ── Role toggle (only addition to your original structure) ── */}
          <div className="flex bg-[#1e1e1e] rounded-xl p-1 border border-[#2a2a2a] gap-1">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-black uppercase tracking-widest transition-all
                ${role === "user" ? "bg-[#e87722] text-white" : "text-[#555] hover:text-[#888]"}`}>
              User
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-black uppercase tracking-widest transition-all
                ${role === "admin" ? "bg-[#e87722] text-white" : "text-[#555] hover:text-[#888]"}`}>
              Admin
            </button>
          </div>

          {role === "admin" && (
            <p className="text-xs text-[#555] text-center border border-[#2a2a2a] rounded-xl px-4 py-2">
              ⚠️ Only authorized accounts can access the admin panel.
            </p>
          )}
          {/* ──────────────────────────────────────────────────────────── */}

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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#555] hover:text-[#e87722] transition">
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Remember me + forgot */}
            {/* <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#777] cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 accent-[#e87722]"
                  checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Remember me
              </label>
              <a href="#" className="text-[#e87722] hover:underline text-sm font-bold">
                Forgot password?
              </a>
            </div> */}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#e87722] hover:bg-[#c96510] text-white font-black py-3.5
                rounded-xl uppercase tracking-widest text-sm transition-all hover:scale-[1.01]
                disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {isLoading ? "Logging in..." : `Login as ${role === "admin" ? "Admin" : "User"}`}
            </button>

          </form>

          <p className="text-center text-sm text-[#555]">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#e87722] font-black hover:underline">
              Sign Up
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}