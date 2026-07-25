import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { useCart } from "./CartPage";
import { useRequireAuth } from "../Hooks/useRequireAuth";
import AuthModal from "../Components/AuthModal";
import toast from "react-hot-toast";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const CATEGORIES = ["All", "Burgers", "Chicken", "Drinks", "Pizza", "Cake", "Sides"];

function MenuPage() {
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search).get("search") || "";

  const [active, setActive] = useState("All");
  const [search, setSearch] = useState(urlSearch);

  useEffect(() => {
    setSearch(urlSearch);
  }, [location.search]);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (active !== "All") params.category = active;
    if (search) params.search = search;

    axios
      .get(`${API}/api/menu`, { params })
      .then((res) => setItems(res.data))
      .catch(() => toast.error("Failed to load menu"))
      .finally(() => setLoading(false));
  }, [active, search]);

  const filtered = (items || [])
    .filter((i) => active === "All" || i.category === active)
    .filter((i) => i.name?.toLowerCase().includes(search.toLowerCase()));

  const { addToCart } = useCart();
  const { requireAuth, showModal, setShowModal, onAuthSuccess } = useRequireAuth();

  const handleAddToCart = (item) => {
    requireAuth(() => {
      addToCart({
        ...item,
        menuItemId: item._id,
      });
      toast.success(`${item.name} added to cart! 🛒`, {
        id: `cart-${item._id}`,
        style: { background: "#161513", color: "#fff", border: "1px solid #e87722" },
        iconTheme: { primary: "#e87722", secondary: "#fff" },
      });
    });
  };

  return (
    <div className="min-h-screen bg-[#161513]">
      <Navbar />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;800&display=swap');
        .font-display { font-family: 'Bebas Neue', 'Impact', sans-serif; letter-spacing: 0.03em; }
        .font-body { font-family: 'Inter', sans-serif; }
        @keyframes card-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .card-in { animation: card-in 0.35s ease-out both; }
      `}</style>

      {showModal && (
        <AuthModal
          onClose={() => setShowModal(false)}
          onSuccess={onAuthSuccess}
        />
      )}

      <div className="max-w-6xl mx-auto px-6 py-12 font-body">
        {/* ---------- HEADER ---------- */}
        <div className="mb-10">
          <span className="text-[#E87722] font-bold tracking-[0.3em] text-xs">EXPLORE</span>
          <h1 className="font-display text-5xl md:text-6xl font-black text-white tracking-wide leading-none mt-1">
            MAIN MENU
          </h1>
          {urlSearch && (
            <p className="text-[#777] text-sm mt-2">
              Showing results for <span className="text-[#E87722] font-semibold">"{urlSearch}"</span>
            </p>
          )}
        </div>

        {/* ---------- STICKY FILTER BAR ---------- */}
        <div className="sticky top- -m-7 z-20 -mx-6 px-6 py-4 mb-8 bg-[#161513]/85 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wide
                    transition-all duration-200 cursor-pointer border
                    ${
                      active === cat
                        ? "bg-[#E87722] text-white border-[#E87722] shadow-md shadow-[#E87722]/25"
                        : "bg-white/30 text-[#999] border-white/10 hover:border-[#E87722]/50 hover:text-[#E87722]"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <p className="text-[#666] text-xs uppercase tracking-widest font-bold whitespace-nowrap">
              {loading ? "Loading…" : `${filtered.length} item${filtered.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {/* ---------- LOADING SKELETON ---------- */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white/30 border border-white/5 rounded-2xl p-4 flex items-center gap-4 animate-pulse"
              >
                <div className="w-28 h-28 bg-white/5 rounded-xl shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-6 bg-white/5 rounded w-1/2" />
                  <div className="h-8 bg-white/5 rounded-full w-24 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          /* ---------- FOOD GRID ---------- */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item, idx) => (
              <div
                key={item._id || item.id}
                style={{ animationDelay: `${Math.min(idx, 8) * 40}ms` }}
                className="card-in bg-white/300 border border-white/5 hover:border-[#E87722]/40
                  rounded-2xl p-4 flex items-center gap-4 transition-all duration-300
                  hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40 group"
              >
                <div className="w-28 h-28 rounded-xl overflow-hidden shrink-0 ring-1 ring-white/5">
                  <img
                    src={item.image || item.img}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  {(item.bestSeller === true || item.bestSeller === "true") && (
                    <span className="bg-[#E87722] text-[#161513] text-[10px] font-black
                      px-2.5 py-0.5 rounded-full w-fit uppercase tracking-wide">
                      ⭐ Best Seller
                    </span>
                  )}
                  <h3 className="text-white font-black text-base leading-tight truncate">
                    {item.name}
                  </h3>
                  <p className="text-[#E87722] font-display text-2xl tracking-wide">
                    ₱{item.price}
                  </p>

                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-[#E87722] hover:bg-white hover:text-[#161513] text-white font-black
                      px-4 py-2 rounded-full text-xs uppercase tracking-wide
                      transition-all hover:scale-105 active:scale-95 w-fit mt-1 cursor-pointer"
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ---------- NO RESULTS ---------- */
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <span className="text-6xl opacity-80">🔍</span>
            <p className="text-[#999] text-lg font-body">
              No results for{" "}
              <span className="text-[#E87722] font-bold">"{search}"</span>
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActive("All");
              }}
              className="text-sm text-[#666] hover:text-[#E87722] font-bold underline cursor-pointer transition"
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