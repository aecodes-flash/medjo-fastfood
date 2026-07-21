import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL;

function Toggle({ on, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-12 h-6 rounded-full transition-colors duration-200 relative shrink-0 cursor-pointer ${
        on ? "bg-orange-500" : "bg-gray-600"
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${
          on ? "left-6" : "left-0.5"
        }`}
      />
    </button>
  );
}

export default function Setting() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    storeName: "Medjo Fast Food",
    deliveryFee: 49,
    minOrder: 100,
    onlineOrdering: true,
    gcashPayments: true,
    emailNotifications: true,
    customerReviews: true,
    maintenanceMode: false,
  });

  // Fetch settings from MongoDB on component load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get(`${API}/api/settings`);
        setForm(data);
      } catch (error) {
        toast.error("Failed to load store settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = (key) => {
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem("token");
    try {
      await axios.put(`${API}/api/settings`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Settings saved successfully! ⚙️");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-[#141414] min-h-screen text-white flex items-center justify-center">
        <p className="text-gray-400 font-bold uppercase tracking-widest">Loading Settings...</p>
      </div>
    );
  }

  const toggles = [
    { key: "onlineOrdering", label: "Online Ordering", desc: "Accept orders from the website" },
    { key: "gcashPayments", label: "GCash Payments", desc: "Enable GCash as payment method" },
    { key: "emailNotifications", label: "Email Notifications", desc: "Get notified on new orders" },
    { key: "customerReviews", label: "Customer Reviews", desc: "Allow customers to leave feedback" },
    { key: "maintenanceMode", label: "Maintenance Mode", desc: "Temporarily close the store" },
  ];

  return (
    <div className="p-6 bg-[#141414] min-h-screen text-white">
      <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-black uppercase tracking-wider">Admin Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">
        {/* Store Settings */}
        <div className="flex-1 bg-[#1e1e1e] rounded-2xl p-6 border border-white/10 h-fit">
          <h2 className="text-lg font-bold tracking-widest uppercase mb-4">Store Settings</h2>
          <div className="border-t border-white/10 pt-4">
            <p className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-4">
              🏪 General
            </p>

            <div className="mb-4">
              <p className="text-xs tracking-widest uppercase text-gray-400 mb-2">Store Name</p>
              <input
                type="text"
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-orange-500 transition"
              />
            </div>

            <div className="mb-4">
              <p className="text-xs tracking-widest uppercase text-gray-400 mb-2">Delivery Fee (₱)</p>
              <input
                type="number"
                value={form.deliveryFee}
                onChange={(e) => setForm({ ...form, deliveryFee: Number(e.target.value) })}
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-orange-500 transition"
              />
            </div>

            <div className="mb-4">
              <p className="text-xs tracking-widest uppercase text-gray-400 mb-2">Minimum Order (₱)</p>
              <input
                type="number"
                value={form.minOrder}
                onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })}
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-orange-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Notifications & Features */}
        <div className="flex-1 bg-[#1e1e1e] rounded-2xl p-6 border border-white/10 h-fit">
          <h2 className="text-lg font-bold tracking-widest uppercase mb-4">
            Notifications & Features
          </h2>
          <div className="border-t border-white/10 pt-4">
            <p className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-4">
              🔔 Toggles
            </p>
            {toggles.map((t) => (
              <div
                key={t.key}
                className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
              >
                <div>
                  <p className="font-semibold text-sm">{t.label}</p>
                  <p className="text-xs text-gray-500">{t.desc}</p>
                </div>
                <Toggle on={form[t.key]} onToggle={() => handleToggle(t.key)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}