import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-slate-800 text-white flex flex-col p-5 shrink-0 sticky top-0 shadow-xl border-r border-slate-700">
      {/* Brand Header */}
      <div className="mb-8 px-2 pt-2">
        <h3 className="text-l font-bold text-sky-400 flex items-center gap-3 tracking-wide">
          <span className="text-2xl drop-shadow-md flex items-center">
            <img
              src={process.env.PUBLIC_URL + "/logo192.jpeg"}
              alt="Disha Institute Of Science and Technology Logo"
              className="size-20 rounded-full object-cover shrink-0"
            />
          </span>
          Disha Institute Of Science and Technology
        </h3>
      </div>
      {/* Navigation Menu */}
      <nav className="flex flex-col gap-2">
        <Link
          to="/dashboard"
          className="px-4 py-3 text-slate-300 rounded-xl font-medium text-sm transition-all duration-200 hover:bg-slate-700 hover:text-white flex items-center gap-3 group"
        >
          <span className="text-lg group-hover:scale-110 transition-transform">
            📊
          </span>
          Dashboard
        </Link>

        <Link
          to="/books"
          className="px-4 py-3 text-slate-300 rounded-xl font-medium text-sm transition-all duration-200 hover:bg-slate-700 hover:text-white flex items-center gap-3 group"
        >
          <span className="text-lg group-hover:scale-110 transition-transform">
            📖
          </span>
          Books Collection
        </Link>

        <Link
          to="/students"
          className="px-4 py-3 text-slate-300 rounded-xl font-medium text-sm transition-all duration-200 hover:bg-slate-700 hover:text-white flex items-center gap-3 group"
        >
          <span className="text-lg group-hover:scale-110 transition-transform">
            🎓
          </span>
          Students Directory
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
