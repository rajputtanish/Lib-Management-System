import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { envData } from "../data";
import bgImage from "../assets/login-bg.png";

function Login() {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${envData.apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });

      const data = await res.json();
      if (!res.ok || !data.token)
        throw new Error(data.message || "Login failed");

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 bg-center bg-no-repeat bg-cover relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Background Dimmer Overlay */}
      <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px] z-0" />

      {/* Main Glassmorphic Card */}
      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-3xl bg-slate-900/10 backdrop-blur-lg border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2 drop-shadow-md">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-300">
            Sign in to access the library dashboard
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 px-4 py-3 bg-rose-500/15 border border-rose-500/30 text-rose-200 text-sm rounded-xl text-center font-medium backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-200 uppercase tracking-wider pl-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="admin@library.com"
              value={inputs.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm shadow-inner outline-none transition-all duration-200 focus:bg-white/15 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-200 uppercase tracking-wider pl-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={inputs.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm shadow-inner outline-none transition-all duration-200 focus:bg-white/15 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-sm tracking-wide shadow-lg shadow-blue-500/30 border border-white/20 active:scale-[0.98] transition-all duration-200 outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
