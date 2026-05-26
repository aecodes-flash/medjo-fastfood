import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "../../Components/admin/AdminSidebar";
import AdminNavbar  from "../../Components/admin/AdminNavbar";

const TITLES = {
  "/admin":          "Dashboard",
  "/admin/orders":   "Orders",
  "/admin/payments": "Payments",
  "/admin/menu":     "Menu Management",
  "/admin/reviews":  "Reviews",
  "/admin/settings": "Settings",
};

export default function AdminLayout() {
  const location = useLocation();
  const title    = TITLES[location.pathname] || "Admin";
  const [search, setSearch] = useState("");

  return (
    <div className="flex min-h-screen bg-[#111] text-white">
      <AdminSidebar />
      <div className="ml-60 flex-1 flex flex-col">
        <AdminNavbar title={title} search={search} setSearch={setSearch} />
        <Outlet context={{ search, setSearch }} />
      </div>
    </div>
  );
}