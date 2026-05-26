// ─── App.jsx ──────────────────────────────────────────────────
// Root component. Defines all client-side routes.
// CartProvider wraps everything so every page can access the cart.
// ────────────────────────────────────────────────────────────

import { Routes, Route } from "react-router-dom";
import { Toaster }       from "react-hot-toast";

// ── Page imports ─────────────────────────────────────────────
import Home        from "./pages/Home";
import LoginPage   from "./pages/LoginPage";
import Signup      from "./pages/Signup";
import MenuPage    from "./pages/MenuPage";
import CartPage    from "./pages/CartPage";
import Checkout    from "./pages/Checkout";
import ProfilePage from "./pages/ProfilePage";
import ReviewPage  from "./pages/ReviewPage";
import Orders      from "./components/Orders";

// ── Admin imports ─────────────────────────────────────────────
import AdminLayout    from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders    from "./pages/admin/AdminOrders";
import AdminPayments  from "./pages/admin/AdminPayments";
import AdminMenu      from "./pages/admin/AdminMenu";
import AdminSettings  from "./pages/admin/AdminSettings";
import AdminReviews   from "./pages/admin/AdminReviews";

function App() {
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