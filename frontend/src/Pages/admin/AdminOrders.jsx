import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../../Store/useAuthStore";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";


const API = import.meta.env.VITE_API_URL + "/api"

const TABS = ["All Orders", "Pending", "Preparing", "Ready", "Delivered", "Cancelled"];

const STATUS_STYLE = {
  Delivered: "bg-emerald-500/10 text-emerald-400",
  Preparing: "bg-orange-500/10 text-orange-400",
  Ready:     "bg-blue-500/10 text-blue-400",
  Pending:   "bg-white/10 text-zinc-400",
  Cancelled: "bg-red-500/10 text-red-400",
};

const STATUSES = ["Pending", "Preparing", "Ready", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const token = useAuthStore(s => s.token);
  const { search } = useOutletContext();
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [tab,      setTab]      = useState("All Orders");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API}/orders/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${API}/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(prev =>
        prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o)
      );
      toast.success(`Order updated to ${newStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status.");
    }
  };

  const filtered = orders
    .filter(o => tab === "All Orders" || o.status === tab)
    .filter(o =>
      o.userId?.username?.toLowerCase().includes(search.toLowerCase()) ||
      o.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
      o._id.toLowerCase().includes(search.toLowerCase())
    );

  if (loading) return <div className="p-8 text-[#888]">Loading orders...</div>;
  if (error)   return <div className="p-8 text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-[#1e1e1e] p-6 text-white">

      {/* Order Detail Modal */}
      {selected && (
        <div onClick={() => setSelected(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">Order Details</h2>
              <button onClick={() => setSelected(null)} className="text-2xl text-zinc-500 hover:text-white">✕</button>
            </div>
            <div className="space-y-3 text-sm">
              {[
                ["Order ID",  selected._id],
                ["Customer",  selected.userId?.username || "Unknown"],
                ["Email",     selected.userId?.email    || "—"],
                ["Total",     `₱${selected.totalPrice}`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-zinc-500">{label}</span>
                  <span className={label === "Total" ? "font-bold text-orange-400" : ""}>{value}</span>
                </div>
              ))}
              <div className="pt-2">
                <p className="text-zinc-500 mb-2">Items</p>
                <div className="space-y-1">
                  {selected.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs bg-white/5 px-3 py-2 rounded-lg">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="text-orange-400">₱{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-zinc-500">Status</span>
                <span className={`rounded-md px-3 py-1 text-xs font-semibold ${STATUS_STYLE[selected.status]}`}>
                  {selected.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-3">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === t ? "bg-orange-400 text-white" : "border border-zinc-700 bg-zinc-900 text-zinc-400"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900 text-left text-xs uppercase text-white">
            <tr>
              {["Order ID", "Customer", "Email", "Items", "Total", "Status", "Actions"].map(h => (
                <th key={h} className="px-4 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">No orders found.</td>
              </tr>
            ) : filtered.map(o => (
              <tr key={o._id} className="border-t border-white/10 bg-[#1a1a1a]/40 hover:bg-zinc-800/70">
                <td className="px-4 py-4 text-white font-mono text-xs">{o._id.slice(-8).toUpperCase()}</td>
                <td className="px-4 py-4">{o.userId?.username || "Unknown"}</td>
                <td className="px-4 py-4 text-zinc-400 text-xs">{o.userId?.email || "—"}</td>
                <td className="px-4 py-4 text-zinc-300">{o.items?.length} item(s)</td>
                <td className="px-4 py-4 font-bold text-orange-400">₱{o.totalPrice}</td>
                <td className="px-4 py-4">
                  <select
                    value={o.status}
                    onChange={e => updateStatus(o._id, e.target.value)}
                    className={`text-xs font-semibold px-3 py-1 rounded-full border-0 cursor-pointer bg-transparent ${STATUS_STYLE[o.status]}`}
                  >
                    {STATUSES.map(s => (
                      <option key={s} value={s} className="bg-zinc-900 text-white">{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-4">
                  <button onClick={() => setSelected(o)}
                    className="rounded-md border border-emerald-800 bg-emerald-950 px-4 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-900 transition">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}