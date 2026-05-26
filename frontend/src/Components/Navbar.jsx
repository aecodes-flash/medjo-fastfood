// ─── Navbar.jsx ───────────────────────────────────────────────
// Sticky top navigation bar.
// Features: logo, search (Enter → /menu?search=…), cart badge,
//           profile icon, hamburger dropdown with auth-aware links.
//
// Dependencies consumed from context/store:
//   useAuthStore → user (to show/hide profile & logout)
//   useCart      → cartCount (drives the cart badge number)
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.jpeg";
import { useAuthStore } from "../Store/useAuthStore";
// useCart from CartPage — single localStorage-based cart used across the whole app
import { useCart } from "../Pages/CartPage";
import { TfiAlignJustify } from "react-icons/tfi";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { RiLogoutBoxFill } from "react-icons/ri";
import toast from "react-hot-toast";

function Navbar() {
  const [query, setQuery]     = useState("");      // controlled search input value
  const [menuOpen, setMenuOpen] = useState(false); // hamburger dropdown open/closed

  const navigate          = useNavigate();
  const { user, logout }  = useAuthStore(); // user is null when logged out
  // getCart reads localStorage — derive count from it
  const { getCart } = useCart()
  const cartCount = getCart().reduce((sum, i) => sum + i.quantity, 0)
    
  // Navigate to menu with search query on Enter key press
  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/menu?search=${encodeURIComponent(query.trim())}`);
      setMenuOpen(false);
    }
  };
 
  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };
 
  // Nav links shown inside the hamburger dropdown
  const navLinks = [
    { to: "/",       label: "🏠 Home"   },
    { to: "/menu",   label: "🍔 Menu"   },
    { to: "/cart",   label: `🛒 Cart${cartCount > 0 ? ` (${cartCount})` : ""}` },
    { to: "/orders", label: "📦 Orders" },
    ...(user ? [{ to: "/profile", label: "👤 Profile" }] : []),
  ];

  return (
    <nav className="bg-black border-b-2 border-[#e07b20] px-6 h-16 flex items-center sticky top-0 z-50">
      <div className="w-full flex items-center justify-between gap-4">

        {/* ── LEFT: Logo + Brand name ──────────────────────── */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/">
            <img
              src={Logo}
              alt="Medjo Fast Food"
              className="w-10 h-10 object-cover rounded-full ring-2 ring-[#e07b20]"
            />
          </Link>

          <Link
            to="/"
            className="text-[#e07b20] text-lg font-black uppercase tracking-wider hidden sm:block hover:opacity-80 transition">
            Medjo FastFood
          </Link>
        </div>

       {/* ── CENTER: Search bar ───────────────────────────── */}
        <div className="flex items-center bg-[#1a1a1a] border border-[#333] hover:border-[#e07b20]/50
          rounded-full px-4 py-2 gap-2 flex-1 max-w-sm transition-colors duration-200">
          <span className="text-[#888] text-sm select-none">🔍</span>
          <input
            type="text"
            placeholder="Search food..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-[#555]"
          />
        </div>
 
        {/* ── RIGHT: Cart, Profile, Hamburger ─────────────── */}
        <div className="flex items-center gap-3 shrink-0">
 
          {/* Cart icon with item-count badge */}
          <Link
            to="/cart"
            className="relative text-white hover:text-[#e07b20] transition duration-200"
            title="Cart"
          >
            <FaShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#e07b20] text-white text-[10px]
                font-black w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
 
          {/* Profile icon — only shown when a user is logged in */}
          {user && (
            <Link
              to="/profile"
              className="text-white hover:text-[#e07b20] transition duration-200"
              title="Profile"
            >
              <FaUserCircle size={24} />
            </Link>
          )}
 
          {/* Hamburger dropdown ─────────────────────────── */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="bg-[#1a1a1a] border border-[#333] hover:border-[#e07b20]
                text-white p-2 rounded-lg transition duration-200"
              aria-label="Menu"
            >
              <TfiAlignJustify size={18} />
            </button>
 
            {menuOpen && (
              <>
                {/* Invisible backdrop — clicking it closes the menu */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />
 
                {/* Dropdown panel */}
                <div className="absolute right-0 top-12 z-50 bg-[#111] border border-[#2a2a2a]
                  rounded-2xl w-48 py-2 shadow-2xl shadow-black/60 overflow-hidden">
 
                  {/* Logged-in user greeting */}
                  {user && (
                    <div className="px-4 py-2.5 border-b border-[#2a2a2a] mb-1">
                      <p > {user.username}
                      </p>
                      <p className="text-[#444] text-xs truncate">{user.email}</p>
                    </div>
                  )}
 
                  {/* Navigation links */}
                  {navLinks.map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-white text-sm font-semibold
                        hover:bg-[#e07b20]/20 hover:text-[#e07b20] transition duration-150"
                    >
                      {label}
                    </Link>
                  ))}
 
                  {/* Auth actions at the bottom */}
                  <div className="border-t border-[#2a2a2a] mt-1 pt-1">
                    {user ? (
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-red-400 text-sm font-semibold
                          hover:bg-red-500/10 transition duration-150 flex items-center gap-2"
                      >
                        <RiLogoutBoxFill size={15} />
                        Logout
                      </button>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2.5 text-white text-sm font-semibold
                            hover:bg-[#e07b20]/20 hover:text-[#e07b20] transition duration-150"
                        >
                          🔑 Login
                        </Link>
                        <Link
                          to="/signup"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2.5 text-white text-sm font-semibold
                            hover:bg-[#e07b20]/20 hover:text-[#e07b20] transition duration-150"
                        >
                          📝 Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;