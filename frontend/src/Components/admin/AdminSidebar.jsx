import { useNavigate, useLocation } from "react-router-dom";
import Logo from '../../assets/Logo.jpeg';
import { MdOutlineDashboard }  from "react-icons/md";
import { FaClipboardList }     from "react-icons/fa6";
import { MdOutlineAddCircle }  from "react-icons/md";
import { BsCreditCard2Back }   from "react-icons/bs";
import { RiLogoutBoxRFill }    from "react-icons/ri";
import { IoSettingsSharp }     from "react-icons/io5";
import {useAuthStore }           from "../../Store/useAuthStore";
import { MdRateReview } from "react-icons/md";

const NAV = [
  { id: "dashboard", label: "Dashboard",      path: "/admin",          icon: <MdOutlineDashboard size={20}/> },
  { id: "orders",    label: "Orders",          path: "/admin/orders",   icon: <FaClipboardList size={20}/> },
  { id: "payments",  label: "Payments",        path: "/admin/payments", icon: <BsCreditCard2Back size={20}/> },
  { id: "menu",      label: "Menu Management", path: "/admin/menu",     icon: <MdOutlineAddCircle size={20}/> },
  { id: "settings", label: "Settings", path: "/admin/settings", icon: <IoSettingsSharp size={20}/> },
  { id: "reviews", label: "Reviews", path: "/admin/reviews", icon: <MdRateReview size={20}/> },
];

export default function AdminSidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const logout    = useAuthStore(s => s.logout);

  const handleLogout = () => {
    logout();                  // clears token + user from store & localStorage
    navigate("/login");
  };

  return (
    <aside className="w-60 bg-[#1a0a02] flex flex-col fixed top-0 left-0 bottom-0 z-50 border-r border-white/5">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
        <img src={Logo} alt="Logo" className="w-9 h-9 rounded-full object-cover" />
        <span className="font-black text-[#e87722] tracking-widest text-sm uppercase">Medjo Fast Food</span>
      </div>

      {/* Nav */}
      <div className="px-3 pt-4 flex-1">
        <p className="text-[#e87722]/60 text-[10px] font-black uppercase tracking-[3px] px-3 mb-2">Main Menu</p>
        <nav className="flex flex-col gap-1">
          {NAV.map(({ id, label, path, icon }) => (
            <button
              key={id}
              onClick={() => navigate(path)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold w-full text-left transition-all
                ${location.pathname === path
                  ? "bg-[#e87722] text-white"
                  : "text-[#aaa] hover:bg-[#e87722]/10 hover:text-[#e87722]"
                }`}
            >
              {icon}
              <span className="flex-1">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-white/5 pt-3">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1">
          <div className="w-8 h-8 rounded-full bg-[#e87722] flex items-center justify-center font-black text-sm">A</div>
          <div className="flex-1">
            <p className="text-sm font-black">Admin</p>
            <p className="text-[11px] text-[#888]">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold w-full text-[#aaa] hover:bg-[#e87722]/10 hover:text-[#e87722] transition-all"
        >
          <RiLogoutBoxRFill size={20}/>
          Logout
        </button>
      </div>
    </aside>
  );
}