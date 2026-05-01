"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4 selection:bg-indigo-500/30">
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg bg-black/40 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-center"
      >
        <div className="w-20 h-20 bg-red-500/10 rounded-3xl mx-auto flex items-center justify-center mb-6 border border-red-500/20 shadow-inner">
          <AlertTriangle size={36} className="text-red-400" />
        </div>
        
        <h1 className="text-3xl font-black text-white mb-3 tracking-tight">System Error</h1>
        <p className="text-slate-400 mb-8 text-sm leading-relaxed">
          Our servers encountered an unexpected exception while processing your request. Don't worry, your data is safe.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all active:scale-95"
          >
            <RefreshCcw size={18} />
            Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 bg-white/5 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all border border-white/10 active:scale-95"
          >
            <Home size={18} />
            Return Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
