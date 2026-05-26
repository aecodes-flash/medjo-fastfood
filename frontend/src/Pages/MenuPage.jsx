// ─── MenuPage.jsx ─────────────────────────────────────────────
// Displays the full menu with category filtering and search.
// Uses AuthModal via useRequireAuth to gate the "Add to Cart" action.
//
// Backend connection:
//   GET /api/menu?category=Burgers&search=smash
//   Response shape: { _id, name, price, category, bestSeller, image }
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { useLocation }         from "react-router-dom";
import Navbar                  from "../components/Navbar";
import { useCart }             from "./CartPage";
import { useRequireAuth }      from "../hooks/useRequireAuth";
import AuthModal               from "../components/AuthModal";
import toast                   from "react-hot-toast";
import axios                   from "axios";

const CATEGORIES = ["All", "Burgers", "Chicken", "Drinks", "Pizza", "Cake"];

function MenuPage() {
  const location = useLocation();

  const urlSearch = new URLSearchParams(location.search).get("search") || "";

  const [active, setActive] = useState("All");
  const [search, setSearch] = useState(urlSearch);

  useEffect(() => { setSearch(urlSearch); }, [location.search]);

  const [items, setItems] = useState([]);
  useEffect(() => {
    const params = {};
    if (active !== "All") params.category = active;
    if (search) params.search = search;
    axios.get("http://localhost:5001/api/menu", { params })
      .then(res => setItems(res.data))
      .catch(() => toast.error("Failed to load menu"));
  }, [active, search]);

  const filtered = items
    .filter((i) => active === "All" || i.category === active)
    .filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

  const { addToCart } = useCart();
  const { requireAuth, showModal, setShowModal, onAuthSuccess } = useRequireAuth();

  const handleAddToCart = (item) => {
    requireAuth(() => {
      addToCart({
        ...item,
        menuItemId: item._id,
      });
      // FIX: item.name instead of item.id
      toast.success(`${item.name} added to cart! 🛒`, {
        id: `cart-${item._id}`,   // ← dedup key: same item = same toast, no stacking
        style: { background: "#1a1a1a", color: "#fff", border: "1px solid #e87722" },
        iconTheme: { primary: "#e87722", secondary: "#fff" },
      });
    });
  };

  return (
    <div className="min-h-screen bg-[#111]">
      <Navbar />

      {showModal && (
        <AuthModal
          onClose={() => setShowModal(false)}
          onSuccess={onAuthSuccess}
        />
      )}

      <div className="max-w-6xl mx-auto px-6 py-10 fade-up">

        <div className="flex flex-col md:flex-row md:items-center gap-5 mb-8">
          <h1
            className="text-5xl font-black text-white uppercase shrink-0"
            style={{ fontFamily: 'Impact, "Arial Narrow", sans-serif' }}
          >
            MAIN MENU
          </h1>

          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2 rounded-full text-sm font-black uppercase tracking-wide
                  transition-all duration-200 cursor-pointer
                  ${active === cat
                    ? "bg-[#e87722] text-white shadow-lg shadow-[#e87722]/30"
                    : "bg-[#1e1e1e] text-[#aaa] hover:bg-[#e87722]/20 hover:text-[#e87722] border border-[#2a2a2a]"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mb-8 max-w-md">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555] select-none">🔍</span>
          <input
            type="text"
            placeholder="Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1e1e1e] border border-[#2a2a2a] focus:border-[#e87722]
              text-white placeholder-[#555] pl-10 pr-4 py-3 rounded-xl outline-none
              transition-colors duration-200 text-sm"
          />
        </div>

        <p className="text-[#444] text-xs uppercase tracking-widest mb-6 font-bold">
          {filtered.length} item{filtered.length !== 1 ? "s" : ""} found
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item) => (
              <div
                key={item._id || item.id}
                className="bg-[#1e1e1e] border border-[#2a2a2a] hover:border-[#e87722]/40
                  rounded-2xl p-4 flex items-center gap-4 transition-all duration-200
                  hover:shadow-lg hover:shadow-[#e87722]/10 group"
              >
                <div className="w-28 h-28 rounded-xl overflow-hidden shrink-0">
                  <img
                    src={item.image || item.img}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  {(item.bestSeller === true || item.bestSeller === "true") && (
                    <span className="bg-[#e87722] text-white text-[10px] font-black
                      px-2.5 py-0.5 rounded-full w-fit uppercase tracking-wide">
                      ⭐ Best Seller
                    </span>
                  )}
                  <h3 className="text-white font-black text-base leading-tight truncate">
                    {item.name}
                  </h3>
                  <p className="text-[#e87722] font-black text-xl">₱{item.price}</p>

                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-[#e87722] hover:bg-[#c96510] text-white font-black
                      px-4 py-2 rounded-full text-xs uppercase tracking-wide
                      transition-all hover:scale-105 active:scale-95 w-fit mt-1"
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-24 text-center col-span-3">
            <span className="text-6xl">🔍</span>
            <p className="text-[#aaa] text-lg">
              No results for{" "}
              <span className="text-[#e87722] font-bold">"{search}"</span>
            </p>
            <button
              onClick={() => { setSearch(""); setActive("All"); }}
              className="text-sm text-[#555] hover:text-[#e87722] font-bold underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MenuPage;