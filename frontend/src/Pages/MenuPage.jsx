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

  // 1. ADD LOADING STATE HERE
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); //  Initial state is true

  useEffect(() => {
    setLoading(true); //  Set loading to true when fetching starts
    const params = {};
    if (active !== "All") params.category = active;
    if (search) params.search = search;

    axios
      .get(`${API}/api/menu`, { params })
      .then((res) => setItems(res.data))
      .catch(() => toast.error("Failed to load menu"))
      .finally(() => setLoading(false)); //  Set loading to false when done
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
        {/* Header and Category Buttons */}
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
                  ${
                    active === cat
                      ? "bg-[#e87722] text-white shadow-lg shadow-[#e87722]/30"
                      : "bg-[#1e1e1e] text-[#aaa] hover:bg-[#e87722]/20 hover:text-[#e87722] border border-[#2a2a2a]"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <p className="text-[#444] text-xs uppercase tracking-widest mb-6 font-bold">
          {loading ? "Loading..." : `${filtered.length} item${filtered.length !== 1 ? "s" : ""} found`}
        </p>

        {/* 2. RENDER SKELETON LOADERS WHILE LOADING */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl p-4 flex items-center gap-4 animate-pulse"
              >
                <div className="w-28 h-28 bg-[#2a2a2a] rounded-xl shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-4 bg-[#2a2a2a] rounded w-3/4" />
                  <div className="h-6 bg-[#2a2a2a] rounded w-1/2" />
                  <div className="h-8 bg-[#2a2a2a] rounded-full w-24 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          /* Render Food Grid */
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
                      transition-all hover:scale-105 active:scale-95 w-fit mt-1 cursor-pointer"
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Render No Results Found */
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <span className="text-6xl">🔍</span>
            <p className="text-[#aaa] text-lg">
              No results for{" "}
              <span className="text-[#e87722] font-bold">"{search}"</span>
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActive("All");
              }}
              className="text-sm text-[#555] hover:text-[#e87722] font-bold underline cursor-pointer"
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