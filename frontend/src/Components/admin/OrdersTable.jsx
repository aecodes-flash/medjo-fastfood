import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../../Store/useAuthStore";
import toast from "react-hot-toast";

const API = "http://localhost:5001/api";

const STATUS_STYLE = {
  Delivered: "bg-green-500/15 text-green-400",
  Preparing: "bg-[#e87722]/15 text-[#e87722]",
  Ready:     "bg-blue-500/15 text-blue-400",
  Pending:   "bg-white/10 text-gray-400",
  Cancelled: "bg-red-500/15 text-red-400",
};

const STATUSES = ["Pending", "Preparing", "Ready", "Delivered", "Cancelled"];

export default function OrdersTable({ orders, setOrders, showViewAll = false }) {
  const navigate = useNavigate();
  const token    = useAuthStore(s => s.token);

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

  return (
    <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <h2 className="font-black uppercase tracking-widest text-lg">Recent Orders</h2>
        {showViewAll && (
          <button
            onClick={() => navigate("/admin/orders")}
            className="text-[#e87722] text-xs font-black border border-white/10 px-3 py-1.5 rounded-lg hover:bg-[#e87722] hover:text-white transition">
            View All
          </button>
        )}
      </div>
      <table className="w-full">
        <thead>
          <tr>
            {["Order ID", "Customer", "Items", "Total", "Status"].map(h => (
              <th key={h} className="text-left text-[10px] font-black uppercase tracking-widest text-[#555] px-4 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">No orders yet.</td>
            </tr>
          ) : orders.map(o => (
            <tr key={o._id} className="border-t border-white/5 hover:bg-white/10 transition">
              <td className="px-4 py-3 text-sm text-[#aaa] font-mono">{o._id.slice(-8).toUpperCase()}</td>
              <td className="px-4 py-3 text-sm font-bold">{o.userId?.username || "Unknown"}</td>
              <td className="px-4 py-3 text-sm text-[#ccc]">{o.items?.length} item(s)</td>
              <td className="px-4 py-3 text-sm font-black text-[#e87722]">₱{o.totalPrice}</td>
              <td className="px-4 py-3">
                <select
                  value={o.status}
                  onChange={e => updateStatus(o._id, e.target.value)}
                  className={`text-[11px] font-black px-3 py-1 rounded-full border-0 cursor-pointer bg-transparent ${STATUS_STYLE[o.status]}`}
                >
                  {STATUSES.map(s => (
                    <option key={s} value={s} className="bg-zinc-900 text-white">{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}