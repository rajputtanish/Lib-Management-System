// src/pages/HomeLogin.jsx
import React from "react";
import { Link } from "react-router-dom";
import bgImage from "../assets/login-bg.png";

function HomeLogin() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 bg-center bg-no-repeat bg-cover relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[4px] z-0" />

      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/20 shadow-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
          Library Portal
        </h2>
        <p className="text-sm text-slate-300 mb-8">
          Select your login type to continue
        </p>

        <div className="space-y-4">
          <Link
            to="/student-login"
            className="block w-full py-4 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold transition-all shadow-lg"
          >
            👨‍🎓 Login as Student
          </Link>
          <Link
            to="/login"
            className="block w-full py-4 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold transition-all shadow-lg"
          >
            👩‍🏫 Login as Staff
          </Link>
        </div>

      </div>
    </div>
  );
}

export default HomeLogin;