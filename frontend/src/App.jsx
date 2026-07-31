// ─── App.jsx ──────────────────────────────────────────────────
// Root component. Defines all client-side routes.
// CartProvider wraps everything so every page can access the cart.
// ────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster }       from "react-hot-toast";
import axios              from "axios";

// ── Page imports ─────────────────────────────────────────────
import Home        from "./Pages/Home";
import LoginPage   from "./Pages/LoginPage";
import Signup      from "./Pages/Signup";
import MenuPage    from "./Pages/MenuPage";
import CartPage    from "./Pages/CartPage";
import Checkout    from "./Pages/Checkout";
import ProfilePage from "./Pages/ProfilePage";
import ReviewPage  from "./Pages/ReviewPage";
import Orders      from "./Components/Orders";

// ── Admin imports ─────────────────────────────────────────────
import AdminLayout    from "./Pages/admin/AdminLayout";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import AdminOrders    from "./Pages/admin/AdminOrders";
import AdminPayments  from "./Pages/admin/AdminPayments";
import AdminMenu      from "./Pages/admin/AdminMenu";
import AdminSettings  from "./Pages/admin/AdminSettings";
import AdminReviews   from "./Pages/admin/AdminReviews";

const API = import.meta.env.VITE_API_URL;

function App() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get(`${API}/api/settings`);
        setSettings(data);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Allow admin routes and login page even during maintenance mode
  const isAdminRoute = location.pathname.startsWith("/admin") || location.pathname === "/login";

  if (!loading && settings?.maintenanceMode && !isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-stretch-condensed text-orange-500 mb-3">🚧 UNDER MAINTENANCE 🚧</h1>
        <p className="text-gray-400 max-w-md">
          We are currently updating our store to serve you better. Please check back shortly!
        </p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" />

      <Routes>
        {/* Public pages */}
        <Route path="/"        element={<Home />}        />
        <Route path="/login"   element={<LoginPage />}   />
        <Route path="/signup"  element={<Signup />}      />
        <Route path="/menu"    element={<MenuPage />}    />

        {/* Cart & checkout */}
        <Route path="/cart"     element={<CartPage />}   />
        <Route path="/checkout" element={<Checkout />}   />

        {/* Protected pages */}
        <Route path="/orders"          element={<Orders />}      />
        <Route path="/profile"         element={<ProfilePage />} />
        <Route path="/review/:orderId" element={<ReviewPage />}  />

        {/* Legacy route */}
        <Route path="/search/:searchTerm" element={<Home />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index          element={<AdminDashboard />} />
          <Route path="orders"  element={<AdminOrders />}   />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="menu"    element={<AdminMenu />}     />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="reviews" element={<AdminReviews />}   />
        </Route>
      </Routes>
    </>
  );
}

export default App;