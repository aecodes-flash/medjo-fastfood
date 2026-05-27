// ─── AuthModal.jsx ────────────────────────────────────────────
import { useState } from "react";
import { useAuthStore } from "../Store/useAuthStore";
import { useNavigate } from "react-router-dom";  // ← add this
import toast from "react-hot-toast";
import logo from "../assets/Logo.jpeg";

const AuthModal = ({ onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, isLoading } = useAuthStore();  // ← removed register, user
  const navigate = useNavigate();               // ← add this

  const [formData, setFormData] = useState({
    email:    "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ── LOGIN ─────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields!");
      return;
    }
    await login(formData.email, formData.password);

    const loggedIn = useAuthStore.getState().user;
    if (!loggedIn) return;

    onSuccess();
    onClose();
  };

  // ── REDIRECT TO SIGNUP PAGE ────────────────────────────────
  const handleGoToSignup = () => {
    onClose();
    navigate("/signup");
  };

  const inputClass =
    "w-full bg-[#1a1a1a] border border-[#333] focus:border-[#e87722] text-white " +
    "placeholder-[#555] px-4 py-3 rounded-xl outline-none transition-colors duration-200 text-sm";

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#111] border border-[#2a2a2a] rounded-2xl w-full max-w-md p-8 relative
          shadow-2xl shadow-black/80 animate-[fadeUp_0.3s_ease_both]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a]
            text-[#aaa] hover:text-white transition flex items-center justify-center text-sm"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <div className="flex justify-center mb-5">
          <img
            src={logo}
            alt="Medjo Fast Food"
            className="w-16 h-16 rounded-full object-cover border-2 border-[#e87722]"
          />
        </div>

        <h2 className="text-2xl font-black text-white text-center uppercase tracking-wide mb-1">
          Welcome Back!
        </h2>
        <p className="text-center text-[#555] text-sm mb-6">
          Log in to continue ordering
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="email"
            name="email"
            placeholder="you@email.com"
            className={inputClass}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            className={inputClass}
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#e87722] hover:bg-[#c96510] text-white font-black py-3
              rounded-xl uppercase tracking-widest transition-all hover:scale-[1.01] disabled:opacity-60 mt-1"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-sm text-[#555] mt-5">
          Don't have an account?{" "}
          <button
            className="text-[#e87722] font-black hover:underline"
            onClick={handleGoToSignup} 
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;