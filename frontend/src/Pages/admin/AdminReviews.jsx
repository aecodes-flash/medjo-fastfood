import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../../Store/useAuthStore";
import { useOutletContext } from "react-router-dom";

const API = "http://localhost:5001/api";

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= rating ? "text-orange-400" : "text-zinc-600"}>★</span>
      ))}
    </div>
  );
}

export default function AdminReviews() {
  const token = useAuthStore(s => s.token);
  const { search } = useOutletContext();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [filter,  setFilter]  = useState("All");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${API}/reviews/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch reviews.");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [token]);

  const filtered = reviews
    .filter(r => filter === "All" || r.rating === Number(filter))
    .filter(r =>
      r.userId?.username?.toLowerCase().includes(search.toLowerCase()) ||
      r.comment?.toLowerCase().includes(search.toLowerCase())
    );

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  if (loading) return <div className="p-8 text-[#888]">Loading reviews...</div>;
  if (error)   return <div className="p-8 text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-6 text-white">

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1e1e1e] border border-white/5 rounded-2xl p-5">
          <p className="text-xs text-[#888] uppercase tracking-widest mb-1">Total Reviews</p>
          <p className="text-2xl font-black">{reviews.length}</p>
        </div>
        <div className="bg-[#1e1e1e] border border-white/5 rounded-2xl p-5">
          <p className="text-xs text-[#888] uppercase tracking-widest mb-1">Average Rating</p>
          <p className="text-2xl font-black text-orange-400">{avgRating} <span className="text-base">★</span></p>
        </div>
        <div className="bg-[#1e1e1e] border border-white/5 rounded-2xl p-5">
          <p className="text-xs text-[#888] uppercase tracking-widest mb-1">5 Star Reviews</p>
          <p className="text-2xl font-black">{reviews.filter(r => r.rating === 5).length}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["All", "5", "4", "3", "2", "1"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition
              ${filter === f
                ? "bg-orange-500 text-white"
                : "border border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-white"}`}>
            {f === "All" ? "All" : `${f} ★`}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {filtered.length === 0 ? (
        <div className="text-center text-zinc-500 py-12">No reviews found.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(r => (
            <div key={r._id} className="bg-[#1e1e1e] border border-white/5 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold">{r.userId?.username || "Unknown"}</p>
                  <p className="text-xs text-zinc-500">{r.userId?.email || "—"}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Stars rating={r.rating} />
                  <p className="text-xs text-zinc-600">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-sm text-zinc-300 mt-2">
                {r.comment || <span className="text-zinc-600 italic">No comment</span>}
              </p>
              <div className="mt-3 pt-3 border-t border-white/5 flex gap-4 text-xs text-zinc-500">
                <span>Order: <span className="text-zinc-400 font-mono">{r.orderId?._id?.toString().slice(-8).toUpperCase() || "—"}</span></span>
                <span>Total: <span className="text-orange-400 font-bold">₱{r.orderId?.totalPrice || "—"}</span></span>
                <span>Status: <span className="text-zinc-400">{r.orderId?.status || "—"}</span></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}