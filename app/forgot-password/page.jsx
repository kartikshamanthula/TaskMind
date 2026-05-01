"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const router = useRouter();

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send reset link");
      
      setIsSent(true);
      toast.success("Reset link sent!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#020204", overflow: "hidden" }}>

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex" style={{ width: "50%", position: "relative", padding: "48px", flexDirection: "column", justifyContent: "space-between", minHeight: "100vh", overflow: "hidden" }}>
        {/* Background image & overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(to bottom, rgba(10,8,40,0.4), rgba(10,8,40,0.6)), url('/register-bg.png')", backgroundSize: "cover", backgroundPosition: "center", zIndex: 0 }} />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 10 }}>
          <span style={{ color: "white", fontWeight: 900, fontSize: "28px", fontStyle: "italic", letterSpacing: "-1px" }}>Task Board</span>
        </div>

        {/* Bottom text */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} style={{ position: "relative", zIndex: 10 }}>
          <h2 style={{ color: "white", fontWeight: 900, fontSize: "36px", lineHeight: 1.2, marginBottom: "20px" }}>
            Secure your<br />Workspace.
          </h2>
        </motion.div>
      </div>

      {/* ── Right Panel ── */}
      <div style={{ flex: 1, background: "#1c1c24", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 32px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/grid.svg')", opacity: 0.02, pointerEvents: "none" }} />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ width: "100%", maxWidth: "400px", position: "relative", zIndex: 10 }}
        >
          <div style={{ marginBottom: "40px" }}>
            <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#64748b", textDecoration: "none", fontSize: "14px", marginBottom: "24px", fontWeight: 600 }}>
              <ArrowLeft size={16} /> Back to login
            </Link>
            <h1 style={{ color: "white", fontWeight: 900, fontSize: "30px", marginBottom: "8px" }}>Reset password</h1>
            <p style={{ color: "#64748b", fontSize: "14px", lineHeight: 1.6 }}>
              {isSent 
                ? "If an account exists with that email, we've sent instructions to reset your password."
                : "Enter the email associated with your account and we'll send you a link to reset your password."}
            </p>
          </div>

          {!isSent ? (
            <form onSubmit={handleResetRequest} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ position: "relative" }}>
                <Mail style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} size={18} />
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%", background: "#2a2a35", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "14px 16px 14px 48px", color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{ width: "100%", background: "#4f46e5", color: "white", fontWeight: 800, padding: "14px", borderRadius: "12px", border: "none", cursor: isLoading ? "not-allowed" : "pointer", fontSize: "14px", opacity: isLoading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(79,70,229,0.25)", marginTop: "8px" }}
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Send reset link"}
              </button>
            </form>
          ) : (
            <button
              onClick={() => router.push("/login")}
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontWeight: 800, padding: "14px", borderRadius: "12px", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              Return to login
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
