import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../../Store/useAuthStore";
import StatCard    from "../../Components/admin/Statcard";
import OrdersTable from "../../Components/admin/OrdersTable";


const API = import.meta.env.VITE_API_URL + "/api"

export default function AdminDashboard() {
  const token = useAuthStore(s => s.token);
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

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

  const totalRevenue    = orders.filter(o => o.status === "Delivered").reduce((sum, o) => sum + o.totalPrice, 0);
  const totalOrders     = orders.length;
  const pendingOrders   = orders.filter(o => o.status === "Pending").length;
  const uniqueCustomers = new Set(orders.map(o => o.userId?._id)).size;

  if (loading) return <div className="p-8 text-[#888]">Loading dashboard...</div>;
  if (error)   return <div className="p-8 text-red-400">{error}</div>;

  return (
    <main className="p-8 flex flex-col gap-6">
      {/* Stat Cards */}
      <div className="stats shadow w-full bg-[#1e1e1e] border border-white/5">
        <StatCard title="Total Revenue"   value={`₱${totalRevenue.toLocaleString()}`} desc="Delivered orders only" />
        <StatCard title="Total Orders"    value={totalOrders}                          desc="All statuses" />
        <StatCard title="Pending Orders"  value={pendingOrders}                        desc="Awaiting action" />
        <StatCard title="Total Customers" value={uniqueCustomers}                      desc="Unique customers" />
      </div>

      {/* Orders Table (recent 5 only) */}
      <OrdersTable
        orders={orders.slice(0, 5)}
        setOrders={setOrders}
        showViewAll
      />
    </main>
  );
}