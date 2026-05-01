"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  X, Loader2, Clock, Sparkles, 
  AlertTriangle, Lightbulb 
} from "lucide-react";

export function ReflectionModal({ isOpen, onClose, report, isLoading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-[#0a0a0f] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
      >
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">What Did I Actually Do?</h2>
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mt-1">Productivity Reflection</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              <p className="text-slate-400 font-medium animate-pulse">AI is auditing your productivity...</p>
            </div>
          ) : report ? (
            <div className="space-y-8">
              {/* SCORE GAUGE */}
              <div className="flex items-center gap-6 p-6 bg-white/5 rounded-3xl border border-white/10">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                    <motion.circle 
                      cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                      strokeDasharray={251.2}
                      initial={{ strokeDashoffset: 251.2 }}
                      animate={{ strokeDashoffset: 251.2 - (251.2 * report.score) / 100 }}
                      className="text-emerald-500"
                    />
                  </svg>
                  <span className="absolute text-2xl font-black text-white">{report.score}%</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Efficiency Score</h3>
                  <p className="text-sm text-slate-400">{report.summary}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                  <div className="flex items-center gap-2 text-emerald-400 mb-3">
                    <Clock size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">Productive Hours</span>
                  </div>
                  <h4 className="text-3xl font-black text-white mb-2">{report.productiveHours}h</h4>
                  <p className="text-xs text-slate-500 font-medium">Estimated focused time today</p>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                  <div className="flex items-center gap-2 text-indigo-400 mb-3">
                    <Sparkles size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">Hidden Work</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{report.hiddenWork}</p>
                </div>
              </div>

              <div className="p-6 bg-rose-500/5 rounded-3xl border border-rose-500/10">
                <div className="flex items-center gap-2 text-rose-400 mb-3">
                  <AlertTriangle size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">Time Leaks</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{report.timeLeaks}</p>
              </div>

              <div className="p-6 bg-amber-500/5 rounded-3xl border border-amber-500/10">
                <div className="flex items-center gap-2 text-amber-500 mb-4">
                  <Lightbulb size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">Improvement Opportunities</span>
                </div>
                <div className="space-y-3">
                  {report.opportunities.map((opt, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 text-[10px] font-bold mt-0.5">{i+1}</div>
                      <p className="text-sm text-slate-300">{opt}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="p-8 border-t border-white/5 bg-black/20 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all text-sm"
          >
            Got it
          </button>
        </div>
      </motion.div>
    </div>
  );
}
