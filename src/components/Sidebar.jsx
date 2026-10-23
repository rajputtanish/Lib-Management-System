import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    navigate("/");
  };

  // Helper to check if the link matches the current route
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Hamburger Toggle (Glassmorphism) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-[60] p-2.5 bg-slate-900/50 backdrop-blur-md border border-white/10 text-white rounded-xl shadow-lg focus:outline-none transition-all"
      >
        {isOpen ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Dark Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container - Transparent/Glassmorphism Theme */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 h-screen bg-black backdrop-blur-xl text-slate-100 flex flex-col p-6 shadow-[4px_0_24px_rgba(0,0,0,0.15)] border-r border-white/10 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="mb-10 px-2 pt-16 md:pt-2 flex items-center gap-4">
          <div className="p-1 bg-white/10 rounded-2xl border border-white/10 shadow-inner backdrop-blur-sm shrink-0">
            <img
              src={process.env.PUBLIC_URL + "/logo192.jpeg"}
              alt="Logo"
              className="w-12 h-12 rounded-xl object-cover"
            />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide leading-tight">
              Disha Institute
            </h3>
            <p className="text-[10px] text-sky-400 font-semibold uppercase tracking-widest mt-0.5">
              Library Portal
            </p>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex flex-col gap-2.5">
          <Link
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className={`px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-3 group ${
              isActive("/dashboard")
                ? "bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-inner"
                : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
            }`}
          >
            <span className={`text-lg transition-transform duration-300 ${isActive("/dashboard") ? "scale-110" : "group-hover:scale-110"}`}>📊</span>
            Dashboard
          </Link>

          <Link
            to="/books"
            onClick={() => setIsOpen(false)}
            className={`px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-3 group ${
              isActive("/books")
                ? "bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-inner"
                : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
            }`}
          >
            <span className={`text-lg transition-transform duration-300 ${isActive("/books") ? "scale-110" : "group-hover:scale-110"}`}>📖</span>
            Books Collection
          </Link>

          <Link
            to="/students"
            onClick={() => setIsOpen(false)}
            className={`px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-3 group ${
              isActive("/students")
                ? "bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-inner"
                : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
            }`}
          >
            <span className={`text-lg transition-transform duration-300 ${isActive("/students") ? "scale-110" : "group-hover:scale-110"}`}>🎓</span>
            Students Directory
          </Link>
        </nav>

        {/* Professional Logout Button */}
        <div className="mt-auto pt-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 text-sm font-medium text-rose-400 transition-all duration-300 bg-rose-500/10 border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white hover:shadow-[0_0_15px_rgba(244,63,94,0.4)] active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;