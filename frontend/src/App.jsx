// ─── App.jsx ──────────────────────────────────────────────────
// Root component. Defines all client-side routes.
// CartProvider wraps everything so every page can access the cart.
// ────────────────────────────────────────────────────────────

import { Routes, Route } from "react-router-dom";
import { Toaster }       from "react-hot-toast";

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