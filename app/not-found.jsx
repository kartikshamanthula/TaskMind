"use client";

import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4 selection:bg-indigo-500/30">
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg bg-black/40 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-center"
      >
        <div className="w-24 h-24 bg-indigo-500/10 rounded-3xl mx-auto flex items-center justify-center mb-6 border border-indigo-500/20 shadow-inner">
          <FileQuestion size={48} className="text-indigo-400" />
        </div>
        
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-slate-300 mb-4">Page Not Found</h2>
        <p className="text-slate-400 mb-10 text-sm leading-relaxed">
          The quadrant you are looking for does not exist or has been moved. Check the URL or return to safety.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all active:scale-95"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 bg-white/5 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all border border-white/10 active:scale-95"
          >
            <Home size={18} />
            Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
