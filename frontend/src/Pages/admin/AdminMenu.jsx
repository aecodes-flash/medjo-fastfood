import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../../store/useAuthStore";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";

const API = "http://localhost:5001/api";

const TABS = ["All", "Burgers", "Chicken", "Drinks", "Sides"];

const EMPTY_FORM = { name: "", price: "", category: "Burgers", description: "", image: "" };

export default function AdminMenu() {
  const token = useAuthStore(s => s.token);
  const { search } = useOutletContext();
  const [items,     setItems]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [showForm,  setShowForm]  = useState(false);
  const [editItem,  setEditItem]  = useState(null);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(`${API}/menu`);
        setItems(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch menu.");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      name:        item.name        || "",
      price:       item.price       || "",
      category:    item.category    || "Burgers",
      description: item.description || "",
      image:       item.image       || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this menu item?")) return;
    try {
      await axios.delete(`${API}/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(prev => prev.filter(i => i._id !== id));
      toast.success("Item deleted.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete item.");
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) {
      toast.error("Name, price, and category are required.");
      return;
    }
    setSaving(true);
    try {
      if (editItem) {
        const res = await axios.put(
          `${API}/menu/${editItem._id}`,
          { ...form, price: Number(form.price) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setItems(prev => prev.map(i => i._id === editItem._id ? res.data : i));
        toast.success("Item updated.");
      } else {
        const res = await axios.post(
          `${API}/menu`,
          { ...form, price: Number(form.price) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setItems(prev => [...prev, res.data]);
        toast.success("Item added.");
      }
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save item.");
    } finally {
      setSaving(false);
    }
  };

  const filtered = items
    .filter(i => activeTab === "All" || i.category?.toLowerCase() === activeTab.toLowerCase())
    .filter(i => i.name?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="p-8 text-[#888]">Loading menu...</div>;
  if (error)   return <div className="p-8 text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-8">

      {/* Add/Edit Modal */}
      {showForm && (
        <div onClick={() => setShowForm(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{editItem ? "Edit Item" : "Add New Item"}</h2>
              <button onClick={() => setShowForm(false)} className="text-2xl text-zinc-500 hover:text-white">✕</button>
            </div>
            {[
              { label: "Name",        key: "name",        type: "text",   placeholder: "e.g. Classic Burger" },
              { label: "Price (₱)",   key: "price",       type: "number", placeholder: "e.g. 130" },
              { label: "Image URL",   key: "image",       type: "text",   placeholder: "http://localhost:5001/images/..." },
              { label: "Description", key: "description", type: "text",   placeholder: "Short description" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="text-xs text-zinc-500 uppercase tracking-widest mb-1 block">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-orange-400"
                />
              </div>
            ))}
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-widest mb-1 block">Category</label>
              <select
                value={form.category}
                onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-orange-400"
              >
                {["Burgers", "Chicken", "Drinks", "Sides"].map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <button onClick={handleSave} disabled={saving}
              className="w-full py-2.5 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-400 transition disabled:opacity-50">
              {saving ? "Saving..." : editItem ? "Save Changes" : "Add Item"}
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-wrap gap-2.5">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-2xl text-sm font-medium capitalize border-[1.5px] cursor-pointer transition-colors
                  hover:border-[#e8621a] hover:text-[#e8621a]
                  ${activeTab === tab
                    ? "bg-[#e8621a] border-[#e8621a] text-white hover:text-white"
                    : "bg-transparent border-[#333] text-[#f0ece4]"}`}>
                {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <button onClick={openAdd}
            className="px-5 py-2 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-400 transition">
            + Add Item
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(item => (
            <div key={item._id}
              className="bg-[#242424] border-[1.5px] border-[#333] rounded-[18px] overflow-hidden
                transition-[transform,border-color,box-shadow] duration-180ms
                hover:-translate-y-1 hover:border-[#e8621a] hover:shadow-[0_8px_32px_rgba(232,98,26,0.14)]">
              <div className="h-28 bg-[#2e2e2e] relative">
                {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
              </div>
              <div className="p-4">
                <p className="text-[#f0ece4] font-bold mb-1">{item.name}</p>
                <p className="text-[0.72rem] text-[#888] uppercase tracking-widest mb-2">{item.category}</p>
                <p className="text-[#e8621a] text-xl font-bold mb-3">₱{item.price}</p>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(item)}
                    className="flex-1 py-2 rounded-[9px] bg-[#2e2e2e] text-[#e8621a] border-[1.5px] border-[#3a3a3a]
                      text-sm font-semibold cursor-pointer transition-colors hover:bg-[#e8621a] hover:text-white hover:border-[#e8621a]">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item._id)}
                    className="flex-1 py-2 rounded-[9px] bg-[#5a1a0f] text-[#e07060]
                      text-sm font-semibold cursor-pointer transition-colors hover:bg-[#7a2a18] hover:text-[#ff9080]">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}