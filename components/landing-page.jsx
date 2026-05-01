"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight, Layout, Zap, Shield, Sparkles, Brain, CheckCircle2,
  PieChart, Clock, Target, Users, Check, Star, Play,
  Activity, Lock, Layers
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import logoImg from "../public/landing.png";

export function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setMounted(true);
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : { user: null })
      .then(data => {
        if (data && data.user) setUser(data.user);
      })
      .catch(err => console.error(err));
  }, []);

  const { scrollY } = useScroll();
  const yHeroBg = useTransform(scrollY, [0, 800], [0, 400]);
  const yHeroContent = useTransform(scrollY, [0, 800], [0, 200]);
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);

  if (!mounted) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-slate-200 font-sans overflow-x-hidden selection:bg-indigo-500/30">
      {/* Background Effects */}
      <motion.div style={{ y: yHeroBg }} className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[150px]"
        />
      </motion.div>

      {/* Navbar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ rotate: 10, scale: 1.05 }}>
            <Image
              src={logoImg}
              alt="TaskMind Logo"
              width={100}
              height={40}
              className="w-auto h-10 object-contain drop-shadow-lg filter invert hue-rotate-180"
              priority
              unoptimized
            />
          </motion.div>
          <span className="text-xl font-black tracking-tight text-white">TaskMind<span className="text-indigo-500">.</span></span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
          </div>
          <div className="flex items-center gap-4 border-l border-white/10 pl-6 ml-2">
            {user ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/board" className="px-5 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-bold hover:bg-indigo-500 transition-colors shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)]">
                  Dashboard
                </Link>
              </motion.div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold hover:text-white transition-colors">
                  Sign In
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/register" className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:bg-slate-200 transition-colors shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
                    Get Started
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.main
        style={{ y: yHeroContent, opacity: opacityHero }}
        className="relative z-10 flex flex-col items-center justify-center pt-16 pb-20 px-6 text-center max-w-5xl mx-auto min-h-[80vh]"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium mb-8 backdrop-blur-md"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles size={16} className="text-indigo-400" />
            </motion.div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              TaskMind is now live
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[1.1] mb-6"
          >
            Execute workflows with
            <motion.span
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-[length:200%_auto] inline-block"
            >
              Agentic automation.
            </motion.span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mb-8 leading-relaxed"
          >
            Elevate your productivity with our intelligent board, daily routine tracking, financial dashboards, and advanced AI-driven insights. Built for high performers.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/board')}
              className="group relative flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-blue-600 text-white font-bold w-full sm:w-auto overflow-hidden shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">Launch Platform</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <ArrowRight size={18} />
              </motion.div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('#features')}
              className="group px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all w-full sm:w-auto flex items-center justify-center gap-3"
            >
              <Zap size={18} className="text-cyan-400 group-hover:scale-110 transition-transform" />
              Explore Features
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.main>

      {/* Feature Grid */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 pb-32 pt-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Everything you need to <span className="text-indigo-400">scale</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">We&apos;ve combined the best parts of project management with cutting-edge AI.</p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: Layout, colorClass: "text-indigo-400", bgClass: "bg-indigo-500/20", glowClass: "bg-indigo-500/10 group-hover:bg-indigo-500/20",
              title: "Smart Board", desc: "Drag-and-drop task boards with infinite scrolling, multiple checklists, and gorgeous themes."
            },
            {
              icon: Brain, colorClass: "text-purple-400", bgClass: "bg-purple-500/20", glowClass: "bg-purple-500/10 group-hover:bg-purple-500/20",
              title: "AI Coach & Insights", desc: "Let AI analyze your tasks, predict risks, suggest priorities, and generate reflection reports automatically."
            },
            {
              icon: Shield, colorClass: "text-emerald-400", bgClass: "bg-emerald-500/20", glowClass: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
              title: "Enterprise Security", desc: "Granular admin controls, role-based access, and deep permission tracking down to the component level."
            },
            {
              icon: PieChart, colorClass: "text-pink-400", bgClass: "bg-pink-500/20", glowClass: "bg-pink-500/10 group-hover:bg-pink-500/20",
              title: "Financial Dashboard", desc: "Track project budgets, analyze spending, and forecast revenue with real-time dynamic charts."
            },
            {
              icon: Activity, colorClass: "text-amber-400", bgClass: "bg-amber-500/20", glowClass: "bg-amber-500/10 group-hover:bg-amber-500/20",
              title: "Daily Routine Zen", desc: "A dedicated distraction-free mode for knocking out your daily recurring tasks."
            },
            {
              icon: Layers, colorClass: "text-cyan-400", bgClass: "bg-cyan-500/20", glowClass: "bg-cyan-500/10 group-hover:bg-cyan-500/20",
              title: "Nested Workspaces", desc: "Organize tasks by client, project, or team. Easily share boards with external collaborators."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{
                y: -15,
                scale: 1.03,
                boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.25)",
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:border-indigo-500/30 transition-all relative overflow-hidden group"
            >
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
                className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[40px] transition-colors ${feature.glowClass}`}
              />
              <motion.div
                whileHover={{ rotate: 15, scale: 1.2 }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 relative z-10 ${feature.bgClass} shadow-[0_0_15px_rgba(0,0,0,0.2)]`}
              >
                <feature.icon className={feature.colorClass} size={28} />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-3 relative z-10">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed relative z-10">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Deep Dive Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-sm font-medium mb-6">
              <Brain size={16} className="text-purple-400" />
              <span className="text-purple-300">Your Personal Assistant</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Let AI do the heavy lifting for you.
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Stop manually organizing your backlog. TaskMind uses advanced LLMs to automatically categorize, prioritize, and summarize your tasks. Ask your AI coach for a weekly reflection or let it identify bottlenecks in your workflow before they happen.
            </p>
            <ul className="space-y-4">
              {['Automated task prioritization', 'Weekly reflection summaries', 'Contextual financial advice'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <Check size={14} className="text-indigo-400" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-3xl blur-[80px] -z-10" />
            <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6">
              <div className="flex items-center gap-2 mb-6 pb-6 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
              </div>
              <div className="space-y-4">
                <div className="h-24 bg-white/5 rounded-xl animate-pulse" />
                <div className="flex gap-4">
                  <div className="h-32 w-1/3 bg-white/5 rounded-xl animate-pulse" />
                  <div className="h-32 w-2/3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 relative overflow-hidden">
                    <div className="absolute top-4 left-4 right-4 h-4 bg-indigo-500/20 rounded" />
                    <div className="absolute top-12 left-4 w-1/2 h-4 bg-indigo-500/20 rounded" />
                    <div className="absolute bottom-4 right-4 p-2 bg-indigo-500/30 rounded-lg">
                      <Sparkles size={16} className="text-indigo-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Workflow Steps */}
      <section id="workflow" className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 md:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

          <div className="text-center mb-16 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">How it works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">From chaotic backlogs to serene productivity in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {[
              { num: "01", title: "Capture Everything", desc: "Dump tasks, notes, and ideas into your board instantly. No friction, no complex forms." },
              { num: "02", title: "AI Organization", desc: "TaskMind automatically tags, estimates, and prioritizes your items based on context." },
              { num: "03", title: "Enter Zen Mode", desc: "Switch to Daily Tasks view and knock out your list one by one with pure focus." }
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className="text-8xl font-black text-white/5 absolute -top-10 -left-6 select-none">{step.num}</div>
                <h3 className="text-2xl font-bold text-white mb-4 relative z-10 pt-4">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed relative z-10">{step.desc}</p>
                {idx < 2 && <div className="hidden md:block absolute top-12 right-[-20%] w-[40%] h-[2px] bg-gradient-to-r from-indigo-500/50 to-transparent" />}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 relative z-10">Ready to transform your workflow?</h2>
          <p className="text-indigo-100 mb-10 text-lg max-w-2xl mx-auto relative z-10">Join thousands of high performers who have already switched to TaskMind.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            {user ? (
              <button onClick={() => router.push('/board')} className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-full hover:scale-105 transition-transform shadow-xl">
                Go to Dashboard
              </button>
            ) : (
              <button onClick={() => router.push('/register')} className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-full hover:scale-105 transition-transform shadow-xl">
                Create Free Account
              </button>
            )}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Image src={logoImg} alt="TaskMind Logo" width={80} height={32} className="w-auto h-8 object-contain filter invert hue-rotate-180" unoptimized />
              <span className="text-lg font-black text-white">TaskMind.</span>
            </div>
            <p className="text-slate-500 max-w-sm">
              The intelligent task management platform designed for modern teams and individual high-performers.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-slate-400">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-slate-500 text-sm">
          <p>© 2026 TaskMind Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
