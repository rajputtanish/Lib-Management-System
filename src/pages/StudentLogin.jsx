import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { envData } from "../data";
import bgImage from "../assets/login-bg.png";

function StudentLogin() {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${envData.apiUrl}/student-auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid credentials");

      localStorage.setItem("studentData", JSON.stringify(data.student));
      navigate("/student-dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 bg-center bg-no-repeat bg-cover relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[4px] z-0" />

      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 mb-2">
            Student Portal
          </h2>
          <p className="text-sm text-slate-300">Log in to view your library account</p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-rose-500/20 border border-rose-500/50 text-rose-200 text-sm rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-200 uppercase tracking-wider pl-1">
              Registered Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="student@library.edu"
              value={inputs.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30 transition-all"
            />
          </div>

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
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold text-sm transition-all disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Log In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          First time here?{" "}
          <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;