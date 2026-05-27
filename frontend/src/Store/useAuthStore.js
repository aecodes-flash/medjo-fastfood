import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL + "/api"

export const useAuthStore = create((set) => ({

  // ── Rehydrate from localStorage on page refresh ──────────
  // Reads saved user + token so login persists after refresh
  user:      JSON.parse(localStorage.getItem("user")) || null,
  token:     localStorage.getItem("token")            || null,
  isLoading: false,

  // ─── REGISTER ─────────────────────────────────────────────
  register: async (username, email, password) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(`${API}/auth/register`, {
        username,
        email,
        password,
      });

      // Save token AND user object so both survive a refresh
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user",  JSON.stringify(res.data.user));

      set({
        user:      res.data.user,
        token:     res.data.token,
        isLoading: false,
      });

      toast.success("Account created successfully! 🍔");

    } catch (error) {
      // 429 = authLimiter triggered (10 attempts per 15 min)
      if (error.response?.status === 429) {
        toast.error("Too many attempts. Please wait 15 minutes.", {
          duration: 6000,
          style: { background: "#1a1a1a", color: "#fff", border: "1px solid #E87722" },
        });
      } else {
        toast.error(error.response?.data?.message || "Register failed");
      }
      set({ isLoading: false });
    }
  },

  // ─── LOGIN ────────────────────────────────────────────────
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(`${API}/auth/login`, {
        email,
        password,
      });

      // Save token AND user object so both survive a refresh
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user",  JSON.stringify(res.data.user));

      set({
        user:      res.data.user,
        token:     res.data.token,
        isLoading: false,
      });

      toast.success(`Welcome back, ${res.data.user.username}! 🍔`);

    } catch (error) {
      // 429 = authLimiter triggered (10 attempts per 15 min)
      if (error.response?.status === 429) {
        toast.error("Too many login attempts. Please wait 15 minutes.", {
          duration: 6000,
          style: { background: "#1a1a1a", color: "#fff", border: "1px solid #E87722" },
        });
      } else {
        toast.error(error.response?.data?.message || "Login failed");
      }
      set({ isLoading: false });
    }
  },

  // ─── LOGOUT ───────────────────────────────────────────────
  // Clears user, token, and cart from both state and localStorage
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");

    set({ user: null, token: null });
    toast.success("Logged out successfully 👋");
  },

}));