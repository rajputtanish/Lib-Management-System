import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { envData } from "../data";
import bgImage from "../assets/login-bg.png"; // Assuming same background as staff login

function StudentRegistration() {
  const [step, setStep] = useState(1);
  const [rollNo, setRollNo] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      const res = await fetch(`${envData.apiUrl}/student-auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNo: rollNo.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      setSuccessMsg("OTP sent successfully to your registered email.");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${envData.apiUrl}/student-auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNo: rollNo.trim(), otp: otp.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      alert("Registration complete! You can now log in.");
      navigate("/student-login");
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
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
            Student Registration
          </h2>
          <p className="text-sm text-slate-300">
            {step === 1 ? "Enter your Roll Number to receive an OTP" : "Set your password to complete registration"}
          </p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-rose-500/20 border border-rose-500/50 text-rose-200 text-sm rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {successMsg && step === 2 && (
          <div className="mb-6 px-4 py-3 bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 text-sm rounded-xl text-center font-medium">
            {successMsg}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-200 uppercase tracking-wider pl-1">
                Registered Roll Number
              </label>
              <input
                type="text"
                placeholder="e.g. STU-2026-001"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all disabled:opacity-50"
            >
              {isLoading ? "Sending OTP..." : "Get OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-200 uppercase tracking-wider pl-1">
                Enter 6-Digit OTP
              </label>
              <input
                type="text"
                placeholder="••••••"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all text-center tracking-widest text-lg"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-200 uppercase tracking-wider pl-1">
                Create Password
              </label>
              <input
                type="password"
                placeholder="Set a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-sm transition-all disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Complete Registration"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-slate-400">
          Already registered?{" "}
          <Link to="/student-login" className="text-cyan-400 hover:text-cyan-300 font-medium">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StudentRegistration;