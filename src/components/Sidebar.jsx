import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      {/* Mobile Hamburger Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-[60] p-2 bg-slate-800 text-white rounded-lg shadow-lg focus:outline-none"
      >
        {isOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Mobile Dark Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 h-screen bg-slate-800 text-white flex flex-col p-5 shadow-2xl border-r border-slate-700 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 px-2 pt-16 md:pt-0">
          <h3 className="text-sm font-bold text-sky-400 flex items-center gap-3 tracking-wide">
            <span className="drop-shadow-md flex items-center">
              <img
                src={process.env.PUBLIC_URL + "/logo192.jpeg"}
                alt="Logo"
                className="w-12 h-12 rounded-full object-cover shrink-0"
              />
            </span>
            Disha Institute of Science and Technology
          </h3>
        </div>

        <nav className="flex flex-col gap-2">
          <Link
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className="px-4 py-3 text-slate-300 rounded-xl font-medium text-sm transition-all duration-200 hover:bg-slate-700 hover:text-white flex items-center gap-3 group"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">
              📊
            </span>
            Dashboard
          </Link>

          <Link
            to="/books"
            onClick={() => setIsOpen(false)}
            className="px-4 py-3 text-slate-300 rounded-xl font-medium text-sm transition-all duration-200 hover:bg-slate-700 hover:text-white flex items-center gap-3 group"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">
              📖
            </span>
            Books Collection
          </Link>

          <Link
            to="/books"
            onClick={() => setIsOpen(false)}
            className="px-4 py-3 text-slate-300 rounded-xl font-medium text-sm transition-all duration-200 hover:bg-slate-700 hover:text-white flex items-center gap-3 group"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">
              📖
            </span>
            Books Transactions
          </Link>

          <Link
            to="/students"
            onClick={() => setIsOpen(false)}
            className="px-4 py-3 text-slate-300 rounded-xl font-medium text-sm transition-all duration-200 hover:bg-slate-700 hover:text-white flex items-center gap-3 group"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">
              🎓
            </span>
            Students Directory
          </Link>
        </nav>

        {/* Logout Button Pushed to Bottom */}
        <div className="mt-auto pt-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white transition-all duration-200 bg-red-600/90 rounded-xl shadow-sm hover:bg-red-600 active:scale-95"
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
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
