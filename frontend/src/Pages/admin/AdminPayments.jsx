import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../../Store/useAuthStore";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import API from '../config/api'

const API = import.meta.env.VITE_API_URL + "/api"

const STATUS_STYLE = {
  Pending:  "bg-white/10 text-zinc-400",
  Verified: "bg-emerald-500/10 text-emerald-400",
  Rejected: "bg-red-500/10 text-red-400",
};

const TABS = ["All", "Pending", "Verified", "Rejected"];

export default function AdminPayments() {
  const token = useAuthStore(s => s.token);
  const { search } = useOutletContext();
  const [payments, setPayments] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [tab,      setTab]      = useState("All");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get(`${API}/checkout/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch payments.");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [token]);

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

  const filtered = payments
    .filter(p => tab === "All" || p.status === tab)
    .filter(p =>
      p.userId?.username?.toLowerCase().includes(search.toLowerCase()) ||
      p.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.method?.toLowerCase().includes(search.toLowerCase()) ||
      p.reference?.toLowerCase().includes(search.toLowerCase())
    );

  if (loading) return <div className="p-8 text-[#888]">Loading payments...</div>;
  if (error)   return <div className="p-8 text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-[#1e1e1e] p-6 text-white">

      {/* Tabs */}
      <div className="mb-6 flex gap-3">
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
              {["Payment ID", "Customer", "Order ID", "Method", "Reference", "Amount", "Status", "Actions"].map(h => (
                <th key={h} className="px-4 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-zinc-500">No payments found.</td>
              </tr>
            ) : filtered.map(p => (
              <tr key={p._id} className="border-t border-white/10 bg-[#1a1a1a]/40 hover:bg-zinc-800/70">
                <td className="px-4 py-4 font-mono text-xs text-white">{p._id.slice(-8).toUpperCase()}</td>
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
                      <button onClick={() => updateStatus(p._id, "Verified")}
                        className="rounded-md border border-emerald-800 bg-emerald-950 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-900 transition">
                        Verify
                      </button>
                      <button onClick={() => updateStatus(p._id, "Rejected")}
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