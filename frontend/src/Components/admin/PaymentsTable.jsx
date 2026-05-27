import axios from "axios";
import { useAuthStore } from "../../Store/useAuthStore";
import toast from "react-hot-toast";


const API = import.meta.env.VITE_API_URL + "/api"

const STATUS_STYLE = {
  Pending:  "bg-white/10 text-zinc-400",
  Verified: "bg-emerald-500/10 text-emerald-400",
  Rejected: "bg-red-500/10 text-red-400",
};

export default function PaymentsTable({ payments, setPayments }) {
  const token = useAuthStore(s => s.token);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `${API}/checkout/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPayments(prev =>
        prev.map(p => p._id === id ? { ...p, status: newStatus } : p)
      );
      toast.success(`Payment ${newStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update payment.");
    }
  };

  return (
    <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5">
        <h2 className="font-black uppercase tracking-widest text-lg">Payments</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900 text-left text-xs uppercase text-white">
            <tr>
              {["Payment ID", "Customer", "Order ID", "Method", "Reference", "Amount", "Status", "Actions"].map(h => (
                <th key={h} className="px-4 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-zinc-500">No payments found.</td>
              </tr>
            ) : payments.map(p => (
              <tr key={p._id} className="border-t border-white/10 bg-[#1a1a1a]/40 hover:bg-zinc-800/70">
                <td className="px-4 py-4 font-mono text-xs text-white">
                  {p._id.slice(-8).toUpperCase()}
                </td>
                <td className="px-4 py-4">
                  <p className="font-bold text-sm">{p.userId?.username || "Unknown"}</p>
                  <p className="text-xs text-zinc-500">{p.userId?.email || "—"}</p>
                </td>
                <td className="px-4 py-4 font-mono text-xs text-zinc-400">
                  {p.orderId?._id?.toString().slice(-8).toUpperCase() || "—"}
                </td>
                <td className="px-4 py-4 capitalize text-zinc-300">{p.method || "—"}</td>
                <td className="px-4 py-4 text-zinc-400 text-xs">{p.reference || "—"}</td>
                <td className="px-4 py-4 font-bold text-orange-400">₱{p.amount}</td>
                <td className="px-4 py-4">
                  <span className={`rounded-md px-3 py-1 text-xs font-semibold ${STATUS_STYLE[p.status] || "bg-white/10 text-zinc-400"}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {p.status === "Pending" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(p._id, "Verified")}
                        className="rounded-md border border-emerald-800 bg-emerald-950 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-900 transition">
                        Verify
                      </button>
                      <button
                        onClick={() => updateStatus(p._id, "Rejected")}
                        className="rounded-md border border-red-800 bg-red-950 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-900 transition">
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-600 px-1">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}