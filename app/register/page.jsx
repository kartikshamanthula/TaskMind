"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [otp, setOtp] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: `${name} ${lastName}`.trim(), email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      toast.success(data.message || "OTP sent!");
      setStep(2);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");
      toast.success(data.message || "Email verified! Pending admin approval.");
      router.push("/login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#020204] overflow-x-hidden">

      {/* ── Left Panel ── */}
      <div className="relative w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between min-h-[40vh] lg:min-h-screen overflow-hidden">
        {/* Background image & overlay */}
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to bottom, rgba(10,8,40,0.4), rgba(10,8,40,0.6)), url('/register-bg.png')" }} />

        {/* Logo */}
        <div className="relative z-10">
          <span className="text-white font-black text-2xl lg:text-3xl italic tracking-tighter">Task Board</span>
        </div>

        {/* Bottom text */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="relative z-10">
          <h2 className="text-white font-black text-3xl lg:text-5xl lg:leading-tight mb-4 lg:mb-8">
            Capturing Moments,<br />Creating Memories.
          </h2>
        </motion.div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 bg-[#1c1c24] flex items-center justify-center p-6 lg:p-12 relative overflow-y-auto">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="mb-8 lg:mb-10">
            <h1 className="text-white font-black text-2xl lg:text-3xl mb-2">{step === 1 ? "Create an account" : "Verify Email"}</h1>
            <p className="text-slate-500 text-sm">
              {step === 1 ? (
                <>Already have an account?{" "}
                  <Link href="/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Log in</Link>
                </>
              ) : (
                <>Enter the 6-digit OTP sent to <span className="text-white font-semibold">{email}</span></>
              )}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="First name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#2a2a35] border border-white/5 focus:border-indigo-500/50 rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-all focus:ring-4 focus:ring-indigo-500/10"
                />
                <input
                  type="text"
                  required
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-[#2a2a35] border border-white/5 focus:border-indigo-500/50 rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-all focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#2a2a35] border border-white/5 focus:border-indigo-500/50 rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-all focus:ring-4 focus:ring-indigo-500/10"
              />

              <div className="relative group">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#2a2a35] border border-white/5 focus:border-indigo-500/50 rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-all focus:ring-4 focus:ring-indigo-500/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Create account"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <input
                type="text"
                required
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-[#2a2a35] border border-white/5 focus:border-indigo-500/50 rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-all focus:ring-4 focus:ring-indigo-500/10 text-center tracking-widest text-2xl font-bold"
                maxLength={6}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Verify OTP"}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-slate-400 text-sm mt-4 hover:text-white transition-colors flex justify-center w-full"
              >
                Back to registration
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
