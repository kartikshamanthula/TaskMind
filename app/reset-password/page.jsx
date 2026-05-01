"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleReset = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");
      
      toast.success("Password reset successfully! You can now log in.");
      router.push("/login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{ textAlign: "center" }}>
        <h1 style={{ color: "white", fontWeight: 900, fontSize: "24px", marginBottom: "16px" }}>Invalid Link</h1>
        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>The password reset link is invalid or has expired.</p>
        <Link href="/forgot-password" style={{ color: "#818cf8", fontWeight: 700, textDecoration: "none" }}>Request a new link</Link>
      </div>
    );
  }

  return (
    <>
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ color: "white", fontWeight: 900, fontSize: "30px", marginBottom: "8px" }}>Set new password</h1>
        <p style={{ color: "#64748b", fontSize: "14px" }}>
          Must be at least 8 characters.
        </p>
      </div>

      <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ position: "relative" }}>
          <input
            type={showPass ? "text" : "password"}
            required
            minLength={8}
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ width: "100%", background: "#2a2a35", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "14px 48px 14px 16px", color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div style={{ position: "relative" }}>
          <input
            type={showPass ? "text" : "password"}
            required
            minLength={8}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: "100%", background: "#2a2a35", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "14px 48px 14px 16px", color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{ width: "100%", background: "#4f46e5", color: "white", fontWeight: 800, padding: "14px", borderRadius: "12px", border: "none", cursor: isLoading ? "not-allowed" : "pointer", fontSize: "14px", opacity: isLoading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(79,70,229,0.25)", marginTop: "8px" }}
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Reset password"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
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
          <Suspense fallback={<div style={{ textAlign: "center", color: "#64748b" }}><Loader2 className="animate-spin mx-auto" /></div>}>
            <ResetPasswordForm />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
}
