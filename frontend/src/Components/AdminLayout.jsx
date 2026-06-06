import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import pic from "../assets/logo pic.png";
import {
  FaTachometerAlt, FaUsers, FaChartBar,
  FaBookOpen, FaHeart, FaSignOutAlt,
} from "react-icons/fa";
import { HiMenuAlt2 } from "react-icons/hi";

export function useAdminGuard() {
  const navigate = useNavigate();
  useEffect(() => {
    if (sessionStorage.getItem("adminLoggedIn") !== "true") navigate("/admin");
  }, []);
}

export function getAdminHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${sessionStorage.getItem("adminToken")}`,
  };
}

const NAV_LINKS = [
  { label: "Overview",    path: "/admin/dashboard",  icon: FaTachometerAlt },
  { label: "Users",       path: "/admin/users",       icon: FaUsers },
  { label: "Analytics",   path: "/admin/analytics",   icon: FaChartBar },
  { label: "Library",     path: "/admin/library",     icon: FaBookOpen },
  { label: "Calm Corner", path: "/admin/safespace",   icon: FaHeart },
];

export function AdminLayout({ children, collapsed, setCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const overlayRef = useRef(null);

  // Auto-collapse on mobile on mount
  useEffect(() => {
    if (window.innerWidth < 768) setCollapsed(true);
  }, []);

  const logout = () => {
    sessionStorage.removeItem("adminLoggedIn");
    sessionStorage.removeItem("adminToken");
    navigate("/admin");
  };

  // On mobile: sidebar is overlay when expanded
  const isMobileOpen = !collapsed;

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white flex">

      {/* Mobile overlay backdrop */}
      {isMobileOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed top-0 left-0 h-screen z-50 flex flex-col transition-all duration-300 ${
        collapsed ? "-translate-x-full md:translate-x-0 md:w-[68px]" : "translate-x-0 w-60"
      } bg-[#0d1424] border-r border-white/[0.06]`}>

        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/[0.06] ${collapsed ? "justify-center" : ""}`}>
          <img src={pic} className="w-8 h-8 rounded-xl flex-shrink-0" alt="logo" />
          {!collapsed && (
            <div>
              <p className="text-white font-bold text-sm leading-none">Mannlytics</p>
              <p className="text-slate-500 text-[10px] mt-0.5">Admin Console</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
          {NAV_LINKS.map(({ label, path, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                title={collapsed ? label : ""}
                onClick={() => { if (window.innerWidth < 768) setCollapsed(true); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  active
                    ? "bg-indigo-600/90 text-white shadow-[0_4px_14px_rgba(99,102,241,0.35)]"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <Icon className={`text-base flex-shrink-0 ${active ? "text-white" : "text-slate-500 group-hover:text-white"}`} />
                {!collapsed && <span>{label}</span>}
                {!collapsed && active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-2 pb-4 border-t border-white/[0.06] pt-3">
          <button
            onClick={logout}
            title={collapsed ? "Logout" : ""}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full transition"
          >
            <FaSignOutAlt className="flex-shrink-0 text-base" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN — on mobile no margin, on desktop margin based on collapse */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 md:${collapsed ? "ml-[68px]" : "ml-60"}`}>

        {/* Top bar */}
        <header className="sticky top-0 z-40 flex items-center gap-4 px-4 sm:px-6 py-3.5 bg-[#0a0f1e]/90 backdrop-blur border-b border-white/[0.06]">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-white/[0.06]"
          >
            <HiMenuAlt2 className="text-xl" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-3 py-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-400 font-medium">Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-6 sm:mb-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function StatCard({ emoji, label, value, color, bg }) {
  return (
    <div className={`${bg} border border-white/[0.07] rounded-2xl p-5 flex flex-col gap-3`}>
      <div className="flex items-center justify-between">
        <span className="text-2xl">{emoji}</span>
        <div className={`w-2 h-2 rounded-full ${color.replace("text-", "bg-")}`} />
      </div>
      <div>
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{label}</p>
        <p className={`text-2xl font-extrabold mt-1 capitalize ${color}`}>{value}</p>
      </div>
    </div>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white/[0.03] border border-white/[0.07] rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

export function emotionColor(em) {
  const e = (em || "").toLowerCase();
  if (["joy", "happiness"].includes(e)) return "bg-yellow-500/20 text-yellow-300";
  if (["sad", "sadness"].includes(e)) return "bg-blue-500/20 text-blue-300";
  if (e === "anxiety") return "bg-purple-500/20 text-purple-300";
  if (e === "stress") return "bg-orange-500/20 text-orange-300";
  if (["anger", "angry"].includes(e)) return "bg-red-500/20 text-red-300";
  if (["normal", "neutral"].includes(e)) return "bg-green-500/20 text-green-300";
  return "bg-slate-500/20 text-slate-300";
}
