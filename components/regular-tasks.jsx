"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  CheckCircle2, Circle, Star, Calendar, Clock,
  Plus, Trash2, Search, Filter, LayoutGrid,
  List, MoreVertical, Sun, ChevronRight,
  Tag, AlertCircle, CheckSquare, ArrowLeft,
  Briefcase, ShoppingCart, User, Heart, Settings,
  Hash, ChevronDown, MoveHorizontal, Mic, MicOff,
  Trophy, Zap, Award, Brain, Sparkles, Shield,
  Activity, AlertTriangle, Lightbulb, DollarSign,
  CreditCard, RefreshCw, Repeat, Share2, Target, Upload,
  Menu, X, PieChart as DashboardIcon, Loader2, Camera, Paperclip, Eye, FileText, Download, ExternalLink
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, Legend
} from 'recharts';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ReflectionModal } from "./reflection-modal";

const CATEGORIES = [
  { id: "all", name: "All Tasks", icon: <List size={18} />, color: "text-slate-400" },
  { id: "myday", name: "My Day", icon: <Sun size={18} />, color: "text-amber-400" },
  { id: "starred", name: "Starred", icon: <Star size={18} />, color: "text-yellow-400" },
  { id: "Personal", name: "Personal", icon: <User size={18} />, color: "text-blue-400" },
  { id: "Work", name: "Work", icon: <Briefcase size={18} />, color: "text-indigo-400" },
  { id: "Shopping", name: "Shopping", icon: <ShoppingCart size={18} />, color: "text-emerald-400" },
  { id: "Health", name: "Health", icon: <Heart size={18} />, color: "text-rose-400" },
  { id: "Finance", name: "Finance", icon: <DollarSign size={18} />, color: "text-amber-500" },
];

const PRIORITIES = [
  { id: "low", name: "Low", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  { id: "medium", name: "Medium", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  { id: "high", name: "High", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  { id: "urgent", name: "Urgent", color: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
];

export function RegularTasks() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Gamification & Voice
  const [isListening, setIsListening] = useState(false);
  const [userXp, setUserXp] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // AI Features
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [showAiCoach, setShowAiCoach] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [viewMode, setViewMode] = useState("tasks"); // 'tasks' or 'dashboard'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [aiCoachTab, setAiCoachTab] = useState("analysis"); // 'analysis' or 'decision'
  const [decisionQuery, setDecisionQuery] = useState("");
  const [isDecisionLoading, setIsDecisionLoading] = useState(false);
  const [decisionResult, setDecisionResult] = useState(null);

  // Reflection Report
  const [reflectionReport, setReflectionReport] = useState(null);
  const [isReflecting, setIsReflecting] = useState(false);
  const [showReflectionModal, setShowReflectionModal] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchTasks();
    const interval = setInterval(() => {
      fetchUser();
      fetchTasks();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchUser, fetchTasks]);

  const handleDecisionSubmit = async (e) => {
    e.preventDefault();
    if (!decisionQuery.trim()) return;
    setIsDecisionLoading(true);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks,
          type: 'decision',
          query: decisionQuery
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setDecisionResult(data);
    } catch (err) {
      toast.error("Decision Assistant failed: " + err.message);
    } finally {
      setIsDecisionLoading(false);
    }
  };

  const fetchAiAnalysis = async () => {
    if (tasks.length === 0) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: filteredTasks, contextType: 'finance' })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAiAnalysis(data);
      setShowAiCoach(true);
      setAiCoachTab("analysis");
    } catch (err) {
      toast.error("AI Analysis failed: " + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fetchReflectionReport = async () => {
    setIsReflecting(true);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks,
          type: 'reflection'
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setReflectionReport(data);
      setShowReflectionModal(true);
    } catch (err) {
      toast.error("Reflection failed: " + err.message);
    } finally {
      setIsReflecting(false);
    }
  };

  const fetchUser = React.useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setUserXp(data.user.xp || 0);
        setUserLevel(data.user.level || 1);
      }
      else router.push('/login');
    } catch (err) { console.error(err); }
  }, [router]);

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast("Listening...", { icon: <Mic className="text-indigo-500 animate-pulse" /> });
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setNewTaskTitle(transcript);
      setIsListening(false);
      toast.success("Voice captured!");

      // Basic NLP: if "urgent" or "high priority" is mentioned
      if (transcript.toLowerCase().includes("urgent")) {
        // we could set state for priority here if we had a combined 'adding' state
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Speech recognition failed.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const fetchTasks = React.useCallback(async () => {
    try {
      const res = await fetch('/api/regular-tasks');
      const data = await res.json();
      if (data.tasks) setTasks(data.tasks);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch tasks");
      setLoading(false);
    }
  }, []);

  const startCamera = async () => {
    setShowCameraModal(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast.error("Could not access camera");
      setShowCameraModal(false);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    const tracks = stream?.getTracks();
    tracks?.forEach(track => track.stop());
    setShowCameraModal(false);
  };

  const captureCameraImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    processOcrImage(dataUrl);
    stopCamera();
  };

  const processOcrImage = async (dataUrl) => {
    setIsOcrLoading(true);
    const toastId = toast.loading("Analyzing bill image...");
    try {
      const res = await fetch('/api/ai/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process image");
      const createRes = await fetch('/api/regular-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          category: data.category || "Finance",
          financeDetails: { isFinanceTask: true, amount: data.amount, paymentStatus: 'pending' },
          dueDate: data.dueDate,
          attachments: [{
            name: `Bill_${new Date().getTime()}.png`,
            url: dataUrl,
            type: 'image/png',
            size: dataUrl.length
          }],
          note: `Captured from camera. Merchant: ${data.merchant || 'unknown'}.`
        })
      });
      const taskData = await createRes.json();
      if (taskData.task) {
        setTasks([taskData.task, ...tasks]);
        toast.success("Bill added successfully!", { id: toastId });
      }
    } catch (err) {
      toast.error("Failed to process bill: " + err.message, { id: toastId });
    } finally {
      setIsOcrLoading(false);
    }
  };

  const handleOcrUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => processOcrImage(reader.result);
  };

  const handleCalendarSync = (task) => {
    const title = encodeURIComponent(task.title);
    const details = encodeURIComponent(task.note || "");
    const date = task.dueDate ? new Date(task.dueDate).toISOString().replace(/-|:|\.\d\d\d/g, "") : new Date().toISOString().replace(/-|:|\.\d\d\d/g, "");
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${date}/${date}`;
    window.open(url, '_blank');
    toast.success("Opening Google Calendar...");
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const res = await fetch('/api/regular-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle.trim(),
          category: activeCategory === "all" || activeCategory === "myday" || activeCategory === "starred" ? "Personal" : activeCategory,
          isMyDay: activeCategory === "myday",
          starred: activeCategory === "starred",
          financeDetails: {
            isFinanceTask: activeCategory === "Finance"
          }
        })
      });
      const data = await res.json();
      if (data.task) {
        setTasks([data.task, ...tasks]);
        setNewTaskTitle("");
        setIsAdding(false);
        toast.success("Task added");
      }
    } catch (err) {
      toast.error("Failed to add task");
    }
  };

  const toggleTaskComplete = async (task) => {
    try {
      const res = await fetch('/api/regular-tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: task._id,
          completed: !task.completed,
          completedAt: !task.completed ? new Date() : null
        })
      });
      const data = await res.json();
      if (data.task) {
        setTasks(tasks.map(t => t._id === task._id ? data.task : t));
        if (!task.completed) {
          toast.success("Task completed!");
          if (task.recurring?.enabled) {
            setTimeout(fetchTasks, 500); // Wait for API to finish creating the new task
          }
          if (data.xpGained) {
            toast.success(`+${data.xpGained} XP Gained!`, {
              icon: <Zap size={16} className="text-yellow-400 fill-current" />,
              style: { background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)' }
            });
            setUserXp(data.user.xp);
            if (data.user.level > userLevel) {
              setUserLevel(data.user.level);
              toast.success(`LEVEL UP! You are now Level ${data.user.level}`, {
                icon: <Trophy className="text-yellow-500" />,
                duration: 5000,
                style: { border: '2px solid #eab308' }
              });
            }
          }
        }
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const toggleTaskStarred = async (task) => {
    try {
      const res = await fetch('/api/regular-tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task._id, starred: !task.starred })
      });
      const data = await res.json();
      if (data.task) {
        setTasks(tasks.map(t => t._id === task._id ? data.task : t));
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`/api/regular-tasks?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTasks(tasks.filter(t => t._id !== id));
        if (selectedTask?._id === id) setSelectedTask(null);
        toast.success("Task deleted");
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "all" ? true :
          activeCategory === "myday" ? t.isMyDay :
            activeCategory === "starred" ? t.starred :
              t.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [tasks, activeCategory, searchQuery]);

  const normalTasks = useMemo(() => filteredTasks.filter(t => !t.financeDetails?.isFinanceTask && t.category !== "Finance"), [filteredTasks]);
  const financeTasks = useMemo(() => filteredTasks.filter(t => t.financeDetails?.isFinanceTask || t.category === "Finance"), [filteredTasks]);


  const stats = useMemo(() => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(t => t.completed).length;
    return { total, completed, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [filteredTasks]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-t-2 border-indigo-500 rounded-full"
        />
      </div>
    );
  }

  if (user && user.permissions && user.permissions.canAccessRegularTasks === false) {
    return (
      <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center p-6 text-center font-sans text-slate-200">
        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
          <Shield size={40} />
        </div>
        <h1 className="text-3xl font-black mb-3">Access Restricted</h1>
        <p className="text-slate-400 max-w-md mb-8">
          You do not have permission to access Regular Tasks. Please contact your administrator if you believe this is a mistake.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all font-semibold text-slate-300 w-full sm:w-auto"
          >
            Go Back
          </button>
          <button 
            onClick={async () => {
              try {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/login';
              } catch (e) {
                console.error(e);
              }
            }} 
            className="px-6 py-2.5 rounded-xl bg-indigo-500 text-white hover:bg-indigo-400 transition-all font-semibold shadow-lg shadow-indigo-500/20 w-full sm:w-auto"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden flex">
      <>
        {/* SIDEBAR OVERLAY */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* SIDEBAR */}
        <aside className={cn(
          "fixed lg:relative w-72 border-r border-white/5 bg-black/40 backdrop-blur-3xl z-[90] flex flex-col p-6 h-screen transition-transform duration-300",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <CheckSquare className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-white tracking-tight">Daily Tasks</h1>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Focus Mode</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-8">
            <nav className="space-y-1">
              {CATEGORIES.filter(cat => 
                (cat.id !== "Finance" || user?.permissions?.canAccessFinancialFeature !== false)
              ).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group relative",
                    activeCategory === cat.id
                      ? "bg-white/10 text-white shadow-lg"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <div className={cn("transition-transform", activeCategory === cat.id && "scale-110")}>
                    {cat.icon}
                  </div>
                  <span className="flex-1 text-left">{cat.name}</span>
                  {activeCategory === cat.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full"
                    />
                  )}
                  <span className="text-[10px] font-mono opacity-40 group-hover:opacity-100">
                    {tasks.filter(t => cat.id === 'all' ? true : cat.id === 'myday' ? t.isMyDay : cat.id === 'starred' ? t.starred : t.category === cat.name).length}
                  </span>
                </button>
              ))}
            </nav>

            <div className="pt-4 border-t border-white/5">
              {user?.permissions?.canAccessFinancialFeature !== false && (
                <button
                  onClick={() => {
                    setViewMode(viewMode === 'tasks' ? 'dashboard' : 'tasks');
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-bold transition-all relative overflow-hidden group",
                    viewMode === 'dashboard'
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                      : "bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                  )}
                >
                  <DashboardIcon size={18} className={cn("transition-transform", viewMode === 'dashboard' && "scale-110")} />
                  <div className="text-left relative z-10">
                    <p className="leading-none">{viewMode === 'dashboard' ? 'Show Tasks' : 'Finance Dashboard'}</p>
                    <p className={cn("text-[9px] font-medium mt-1 uppercase tracking-widest", viewMode === 'dashboard' ? "text-indigo-100" : "text-slate-500")}>
                      {viewMode === 'dashboard' ? 'Back to List' : 'View Analytics'}
                    </p>
                  </div>
                  <ChevronRight size={16} className={cn("ml-auto opacity-40 transition-all", viewMode === 'dashboard' && "rotate-90 opacity-100")} />
                </button>
              )}
            </div>

            {/* AI COACH BUTTON */}
            {user?.permissions?.canUseAI !== false && (
              <div className="mt-8 mb-4">
                <button
                  onClick={fetchAiAnalysis}
                  disabled={isAnalyzing || tasks.length === 0}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-bold transition-all relative overflow-hidden group",
                    "bg-gradient-to-r from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 text-indigo-400 hover:text-white"
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {isAnalyzing ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                      <Activity size={18} />
                    </motion.div>
                  ) : (
                    <Sparkles size={18} className="group-hover:scale-120 transition-transform" />
                  )}
                  <div className="text-left relative z-10">
                    <p className="leading-none">AI Coach</p>
                    <p className="text-[9px] text-indigo-300/60 font-medium mt-1 uppercase tracking-widest">Get Insights</p>
                  </div>
                  <ChevronRight size={16} className="ml-auto opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>

                <button
                  onClick={fetchReflectionReport}
                  disabled={isReflecting}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-bold transition-all relative overflow-hidden group mt-3",
                    "bg-gradient-to-r from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 text-emerald-400 hover:text-white"
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {isReflecting ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                      <RefreshCw size={18} />
                    </motion.div>
                  ) : (
                    <Trophy size={18} className="group-hover:scale-120 transition-transform" />
                  )}
                  <div className="text-left relative z-10">
                    <p className="leading-none text-white">Reflection</p>
                    <p className="text-[9px] text-emerald-300/60 font-medium mt-1 uppercase tracking-widest">What did I do?</p>
                  </div>
                  <ChevronRight size={16} className="ml-auto opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="p-5 border-b border-white/5 bg-black/20 backdrop-blur-md z-40">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl border border-white/10 transition-all"
                >
                  <Menu size={20} />
                </button>

                <button
                  onClick={() => router.push('/board')}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl border border-white/10 transition-all text-sm font-bold group"
                >
                  <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="hidden md:block">Back to Board</span>
                </button>

                <div className="h-8 w-[1px] bg-white/10 mx-1 hidden lg:block" />

                <div className="hidden sm:flex items-center gap-3 bg-white/5 border border-white/10 p-2 pr-4 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                    <span className="text-sm font-black">{userLevel}</span>
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Level {userLevel}</p>
                    <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${(userXp % 100)}%` }} />
                    </div>
                  </div>
                </div>

                <div className="relative group hidden lg:block w-64 xl:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-2.5 text-sm outline-none focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 transition-all text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {user?.permissions?.canUseAI !== false && (
                  <>
                    <button
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          cameraInputRef.current?.click();
                        } else {
                          startCamera();
                        }
                      }}
                      disabled={isOcrLoading}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-2xl border border-amber-500/20 transition-all text-sm font-bold"
                      title="Take Photo"
                    >
                      {isOcrLoading ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
                      <span className="hidden xl:block">Camera</span>
                    </button>
                    <button
                      onClick={() => galleryInputRef.current?.click()}
                      disabled={isOcrLoading}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-2xl border border-amber-500/20 transition-all text-sm font-bold"
                      title="Upload Image"
                    >
                      {isOcrLoading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                      <span className="hidden xl:block">Upload</span>
                    </button>

                    <div className="h-8 w-[1px] bg-white/10 mx-1 hidden sm:block" />
                  </>
                )}

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block lg:block">
                    <p className="text-xs font-bold text-white leading-none truncate max-w-[100px]">{user?.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-1 truncate max-w-[100px]">{user?.email}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold shadow-lg shadow-indigo-500/10 shrink-0">
                    {user?.name?.charAt(0)}
                  </div>
                </div>
              </div>
            </div>

            {/* HIDDEN INPUTS FOR OCR */}
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleOcrUpload} />
            <input ref={galleryInputRef} type="file" accept="image/*" className="hidden" onChange={handleOcrUpload} />
          </header>

          <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">

            {viewMode === 'dashboard' ? (
              <FinanceDashboard tasks={tasks} onAnalyze={() => fetchAiAnalysis('finance')} isAnalyzing={isAnalyzing} aiAnalysis={aiAnalysis} />
            ) : (
              <div className="max-w-4xl mx-auto space-y-8">
                {/* PROGRESS SECTION */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden">
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                        {CATEGORIES.find(c => c.id === activeCategory)?.name}
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">You have {filteredTasks.filter(t => !t.completed).length} pending tasks</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-indigo-400 leading-none">{stats.percent}%</div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mt-1">Completion</p>
                    </div>
                  </div>
                  <div className="mt-6 h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.percent}%` }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                    />
                  </div>
                </div>

                {/* ADD TASK BAR */}
                <form onSubmit={handleAddTask} className="relative group">
                  <input
                    type="text"
                    placeholder="What's on your mind? Press Enter to add..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-indigo-500/40 focus:ring-8 focus:ring-indigo-500/5 transition-all text-white placeholder:text-slate-600"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleVoiceInput}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                        isListening ? "bg-rose-500 text-white animate-pulse" : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                      )}
                      title="Voice to Task"
                    >
                      {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>
                    <button
                      type="submit"
                      className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </form>

                {/* TASKS LIST */}
                <div className="space-y-3 pb-20">
                  <AnimatePresence mode="popLayout">
                    {filteredTasks.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="py-20 text-center"
                      >
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-700">
                          <CheckSquare size={40} />
                        </div>
                        <p className="text-slate-500 font-medium text-lg">No tasks found here.</p>
                        <p className="text-slate-600 text-sm mt-1">Start by adding your first task above.</p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="task-lists"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full"
                      >
                        {normalTasks.length > 0 && (
                          <div className="mb-8">
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 pl-2">Tasks & Habits</h3>
                            <div className="space-y-3">
                              {normalTasks.map((task, index) => (
                                <motion.div
                                  key={task._id}
                                  layout
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  transition={{ delay: index * 0.03 }}
                                  className={cn(
                                    "group bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 transition-all hover:bg-white/[0.08] hover:border-white/20",
                                    task.completed && "opacity-60"
                                  )}
                                >
                                  <button
                                    onClick={() => toggleTaskComplete(task)}
                                    className={cn(
                                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                      task.completed
                                        ? "bg-indigo-500 border-indigo-500 text-white"
                                        : "border-slate-700 hover:border-indigo-400 group-hover:scale-110"
                                    )}
                                  >
                                    {task.completed && <CheckCircle2 size={14} />}
                                  </button>

                                  <div
                                    className="flex-1 cursor-pointer"
                                    onClick={() => setSelectedTask(task)}
                                  >
                                    <h3 className={cn(
                                      "text-sm font-medium transition-all",
                                      task.completed ? "text-slate-500 line-through" : "text-white"
                                    )}>
                                      {task.title}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1.5">
                                      <span className={cn(
                                        "text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider",
                                        PRIORITIES.find(p => p.id === task.priority)?.color
                                      )}>
                                        {task.priority}
                                      </span>
                                      <span className="text-[10px] text-slate-600 font-mono flex items-center gap-1">
                                        <Tag size={10} /> {task.category}
                                      </span>
                                      <span className="text-[10px] text-slate-600 font-mono flex items-center gap-1 border-l border-white/5 pl-3">
                                        <Clock size={10} /> {new Date(task.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                      </span>
                                      {task.dueDate && (
                                        <span className={cn(
                                          "text-[10px] font-mono flex items-center gap-1",
                                          new Date(task.dueDate) < new Date() ? "text-rose-500" : "text-slate-500"
                                        )}>
                                          <Calendar size={10} /> {new Date(task.dueDate).toLocaleDateString()}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleCalendarSync(task)}
                                      className="p-2 rounded-xl text-slate-600 hover:text-white hover:bg-white/5 transition-all"
                                      title="Sync to Google Calendar"
                                    >
                                      <Share2 size={18} />
                                    </button>
                                    <button
                                      onClick={() => toggleTaskStarred(task)}
                                      className={cn(
                                        "p-2 rounded-xl transition-all",
                                        task.starred ? "text-yellow-400 bg-yellow-400/10" : "text-slate-600 hover:text-white hover:bg-white/5"
                                      )}
                                    >
                                      <Star size={18} fill={task.starred ? "currentColor" : "none"} />
                                    </button>
                                    <button
                                      onClick={() => deleteTask(task._id)}
                                      className="p-2 rounded-xl text-slate-600 hover:text-rose-400 hover:bg-rose-400/10 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                        {financeTasks.length > 0 && (
                          <div className="mb-8">
                            <h3 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-4 pl-2 flex items-center gap-2">
                              <DollarSign size={14} /> Financial Operations
                            </h3>
                            <div className="space-y-3">
                              {financeTasks.map((task, index) => (
                                <motion.div
                                  key={task._id}
                                  layout
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  transition={{ delay: index * 0.03 }}
                                  className={cn(
                                    "group bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex items-center gap-4 transition-all hover:bg-amber-500/10",
                                    task.completed && "opacity-60 grayscale"
                                  )}
                                >
                                  <button
                                    onClick={() => toggleTaskComplete(task)}
                                    className={cn(
                                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                      task.completed
                                        ? "bg-amber-500 border-amber-500 text-white"
                                        : "border-amber-500/40 hover:border-amber-400 group-hover:scale-110 text-amber-500"
                                    )}
                                  >
                                    {task.completed && <CheckCircle2 size={14} />}
                                  </button>

                                  <div
                                    className="flex-1 cursor-pointer"
                                    onClick={() => setSelectedTask(task)}
                                  >
                                    <h3 className={cn(
                                      "text-sm font-medium transition-all",
                                      task.completed ? "text-slate-500 line-through" : "text-amber-50"
                                    )}>
                                      {task.title}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1.5">
                                      <span className={cn(
                                        "text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider",
                                        PRIORITIES.find(p => p.id === task.priority)?.color
                                      )}>
                                        {task.priority}
                                      </span>
                                      <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 border-l border-white/5 pl-3">
                                        <Clock size={10} /> {new Date(task.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                      </span>
                                      {task.dueDate && (
                                        <span className={cn(
                                          "text-[10px] font-mono flex items-center gap-1",
                                          new Date(task.dueDate) < new Date() ? "text-rose-500" : "text-slate-500"
                                        )}>
                                          <Calendar size={10} /> {new Date(task.dueDate).toLocaleDateString()}
                                        </span>
                                      )}
                                      {task.financeDetails?.isFinanceTask && (
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] font-black text-amber-400 flex items-center gap-1 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                                            <DollarSign size={10} /> {task.financeDetails.amount}
                                          </span>
                                          <span className={cn(
                                            "text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest",
                                            task.financeDetails.paymentStatus === "paid" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                          )}>
                                            {task.financeDetails.paymentStatus}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleCalendarSync(task)}
                                      className="p-2 rounded-xl text-amber-500/50 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                                      title="Sync to Google Calendar"
                                    >
                                      <Share2 size={18} />
                                    </button>
                                    <button
                                      onClick={() => toggleTaskStarred(task)}
                                      className={cn(
                                        "p-2 rounded-xl transition-all",
                                        task.starred ? "text-amber-400 bg-amber-400/20" : "text-amber-500/50 hover:text-amber-400 hover:bg-amber-500/10"
                                      )}
                                    >
                                      <Star size={18} fill={task.starred ? "currentColor" : "none"} />
                                    </button>
                                    <button
                                      onClick={() => deleteTask(task._id)}
                                      className="p-2 rounded-xl text-amber-500/50 hover:text-rose-400 hover:bg-rose-400/10 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </main>

          {/* DETAIL PANEL (DRAWER) */}
          <AnimatePresence>
            {selectedTask && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedTask(null)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                />
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[#0a0a0f] border-l border-white/10 z-[70] p-10 flex flex-col shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Task Details</span>
                    <button
                      onClick={() => setSelectedTask(null)}
                      className="p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>

                  <div className="flex-1 space-y-8 overflow-y-auto custom-scrollbar pr-4 -mr-4">
                    <div>
                      <input
                        value={selectedTask.title}
                        onChange={(e) => {
                          const newTitle = e.target.value;
                          setSelectedTask({ ...selectedTask, title: newTitle });
                          // Debounced update would be better, but direct for now
                        }}
                        onBlur={async () => {
                          await fetch('/api/regular-tasks', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: selectedTask._id, title: selectedTask.title })
                          });
                          fetchTasks();
                        }}
                        className="text-3xl font-black text-white bg-transparent border-none outline-none w-full"
                      />
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                        <Clock size={12} className="text-indigo-400" />
                        Created on {new Date(selectedTask.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Priority</p>
                        <select
                          value={selectedTask.priority}
                          onChange={async (e) => {
                            const val = e.target.value;
                            await fetch('/api/regular-tasks', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ id: selectedTask._id, priority: val })
                            });
                            fetchTasks();
                            setSelectedTask({ ...selectedTask, priority: val });
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none text-white appearance-none cursor-pointer"
                        >
                          {PRIORITIES.map(p => (
                            <option key={p.id} value={p.id} className="bg-[#0a0a0f] text-white">
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</p>
                        <select
                          value={selectedTask.category}
                          onChange={async (e) => {
                            const val = e.target.value;
                            await fetch('/api/regular-tasks', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ id: selectedTask._id, category: val })
                            });
                            fetchTasks();
                            setSelectedTask({ ...selectedTask, category: val });
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none text-white appearance-none cursor-pointer"
                        >
                          {CATEGORIES.filter(c => c.id !== "all" && c.id !== "myday" && c.id !== "starred").map(c => (
                            <option key={c.id} value={c.id} className="bg-[#0a0a0f] text-white">
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Notes</p>
                      <textarea
                        placeholder="Add some details..."
                        value={selectedTask.note || ""}
                        onChange={(e) => setSelectedTask({ ...selectedTask, note: e.target.value })}
                        onBlur={async () => {
                          await fetch('/api/regular-tasks', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: selectedTask._id, note: selectedTask.note })
                          });
                          fetchTasks();
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm outline-none text-slate-300 min-h-[120px] resize-none focus:border-indigo-500/30"
                      />
                    </div>

                    {/* FINANCE CONTROLS */}
                    <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard size={16} className="text-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">Finance Integration</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Amount Due</p>
                          <div className="relative">
                            <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                              type="number"
                              value={selectedTask.financeDetails?.amount || 0}
                              onChange={(e) => setSelectedTask({ ...selectedTask, financeDetails: { ...selectedTask.financeDetails, amount: e.target.value } })}
                              onBlur={async () => {
                                await fetch('/api/regular-tasks', {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ id: selectedTask._id, financeDetails: { ...selectedTask.financeDetails, isFinanceTask: true } })
                                });
                                fetchTasks();
                              }}
                              className="w-full bg-black/20 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none text-white focus:border-amber-500/30"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Status</p>
                          <button
                            onClick={async () => {
                              const newStatus = selectedTask.financeDetails?.paymentStatus === 'paid' ? 'pending' : 'paid';
                              const newTask = { ...selectedTask, financeDetails: { ...selectedTask.financeDetails, paymentStatus: newStatus } };
                              setSelectedTask(newTask);
                              await fetch('/api/regular-tasks', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: selectedTask._id, financeDetails: newTask.financeDetails })
                              });
                              fetchTasks();
                            }}
                            className={cn(
                              "w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all",
                              selectedTask.financeDetails?.paymentStatus === 'paid'
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                            )}
                          >
                            {selectedTask.financeDetails?.paymentStatus || 'pending'}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={selectedTask.financeDetails?.isSubscription || false}
                            onChange={async (e) => {
                              const val = e.target.checked;
                              const newTask = { ...selectedTask, financeDetails: { ...selectedTask.financeDetails, isSubscription: val } };
                              setSelectedTask(newTask);
                              await fetch('/api/regular-tasks', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: selectedTask._id, financeDetails: newTask.financeDetails })
                              });
                              fetchTasks();
                            }}
                          />
                          <div className={cn("w-4 h-4 rounded border flex items-center justify-center transition-all", selectedTask.financeDetails?.isSubscription ? "bg-blue-500 border-blue-500" : "border-white/20")}>
                            {selectedTask.financeDetails?.isSubscription && <CheckSquare size={10} className="text-white" />}
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors">Is Subscription</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={selectedTask.savingsDetails?.isGoal || false}
                            onChange={async (e) => {
                              const val = e.target.checked;
                              const newTask = { ...selectedTask, savingsDetails: { ...selectedTask.savingsDetails, isGoal: val } };
                              setSelectedTask(newTask);
                              await fetch('/api/regular-tasks', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: selectedTask._id, savingsDetails: newTask.savingsDetails })
                              });
                              fetchTasks();
                            }}
                          />
                          <div className={cn("w-4 h-4 rounded border flex items-center justify-center transition-all", selectedTask.savingsDetails?.isGoal ? "bg-emerald-500 border-emerald-500" : "border-white/20")}>
                            {selectedTask.savingsDetails?.isGoal && <CheckSquare size={10} className="text-white" />}
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors">Is Savings Goal</span>
                        </label>
                      </div>

                      {selectedTask.savingsDetails?.isGoal && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5"
                        >
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Target Amount</p>
                            <input
                              type="number"
                              value={selectedTask.savingsDetails?.targetAmount || 0}
                              onChange={(e) => setSelectedTask({ ...selectedTask, savingsDetails: { ...selectedTask.savingsDetails, targetAmount: e.target.value } })}
                              onBlur={async () => {
                                await fetch('/api/regular-tasks', {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ id: selectedTask._id, savingsDetails: selectedTask.savingsDetails })
                                });
                                fetchTasks();
                              }}
                              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none text-white focus:border-emerald-500/30"
                            />
                          </div>
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Current Savings</p>
                            <input
                              type="number"
                              value={selectedTask.savingsDetails?.currentAmount || 0}
                              onChange={(e) => setSelectedTask({ ...selectedTask, savingsDetails: { ...selectedTask.savingsDetails, currentAmount: e.target.value } })}
                              onBlur={async () => {
                                await fetch('/api/regular-tasks', {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ id: selectedTask._id, savingsDetails: selectedTask.savingsDetails })
                                });
                                fetchTasks();
                              }}
                              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none text-white focus:border-emerald-500/30"
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* RECURRENCE CONTROLS */}
                    <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Repeat size={16} className="text-indigo-500" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Recurrence</span>
                        </div>
                        <button
                          onClick={async () => {
                            const newVal = !selectedTask.recurring?.enabled;
                            await fetch('/api/regular-tasks', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ id: selectedTask._id, recurring: { ...selectedTask.recurring, enabled: newVal } })
                            });
                            fetchTasks();
                            setSelectedTask({ ...selectedTask, recurring: { ...selectedTask.recurring, enabled: newVal } });
                          }}
                          className={cn(
                            "text-[10px] font-black px-3 py-1 rounded-full transition-all border",
                            selectedTask.recurring?.enabled ? "bg-indigo-500 text-white border-indigo-500" : "bg-white/5 text-slate-500 border-white/10"
                          )}
                        >
                          {selectedTask.recurring?.enabled ? "ENABLED" : "DISABLED"}
                        </button>
                      </div>
                      {selectedTask.recurring?.enabled && (
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Frequency</p>
                          <select
                            value={selectedTask.recurring?.frequency || "daily"}
                            onChange={async (e) => {
                              const val = e.target.value;
                              await fetch('/api/regular-tasks', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: selectedTask._id, recurring: { ...selectedTask.recurring, frequency: val } })
                              });
                              fetchTasks();
                              setSelectedTask({ ...selectedTask, recurring: { ...selectedTask.recurring, frequency: val } });
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none text-white appearance-none cursor-pointer"
                          >
                            <option value="daily" className="bg-[#0a0a0f] text-white">Daily</option>
                            <option value="weekly" className="bg-[#0a0a0f] text-white">Weekly</option>
                            <option value="monthly" className="bg-[#0a0a0f] text-white">Monthly</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => toggleTaskStarred(selectedTask)}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all border",
                          selectedTask.starred
                            ? "bg-yellow-400/10 border-yellow-400/20 text-yellow-400"
                            : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                        )}
                      >
                        <Star size={18} fill={selectedTask.starred ? "currentColor" : "none"} />
                        {selectedTask.starred ? "Starred" : "Star Task"}
                      </button>
                      <button
                        onClick={async () => {
                          await fetch('/api/regular-tasks', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: selectedTask._id, isMyDay: !selectedTask.isMyDay })
                          });
                          fetchTasks();
                          setSelectedTask({ ...selectedTask, isMyDay: !selectedTask.isMyDay });
                        }}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all border",
                          selectedTask.isMyDay
                            ? "bg-amber-400/10 border-amber-400/20 text-amber-400"
                            : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                        )}
                      >
                        <Sun size={18} />
                        {selectedTask.isMyDay ? "In My Day" : "Add to My Day"}
                      </button>
                    </div>

                    {/* ATTACHMENTS SECTION */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Paperclip size={16} className="text-indigo-400" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Attachments</span>
                        </div>
                        <label className="p-2 hover:bg-white/5 rounded-xl text-indigo-400 cursor-pointer transition-all">
                          <Plus size={18} />
                          <input
                            type="file"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.readAsDataURL(file);
                              reader.onload = async () => {
                                const newAttachment = {
                                  name: file.name,
                                  url: reader.result,
                                  type: file.type,
                                  size: file.size
                                };
                                const updatedAttachments = [...(selectedTask.attachments || []), newAttachment];
                                const newTask = { ...selectedTask, attachments: updatedAttachments };
                                setSelectedTask(newTask);
                                await fetch('/api/regular-tasks', {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ id: selectedTask._id, attachments: updatedAttachments })
                                });
                                fetchTasks();
                                toast.success("File attached");
                              };
                            }}
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {selectedTask.attachments?.map((file, idx) => (
                          <div key={idx} className="group relative aspect-square bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all">
                            {file.type.startsWith('image/') ? (
                              <img src={file.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center p-4">
                                <FileText size={32} className="text-slate-500" />
                                <span className="text-[8px] font-bold text-slate-400 mt-2 truncate w-full text-center">{file.name}</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                onClick={() => window.open(file.url, '_blank')}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
                                title="Open"
                              >
                                <ExternalLink size={14} />
                              </button>
                              <button
                                onClick={async () => {
                                  const updatedAttachments = selectedTask.attachments.filter((_, i) => i !== idx);
                                  const newTask = { ...selectedTask, attachments: updatedAttachments };
                                  setSelectedTask(newTask);
                                  await fetch('/api/regular-tasks', {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ id: selectedTask._id, attachments: updatedAttachments })
                                  });
                                  fetchTasks();
                                  toast.success("Attachment removed");
                                }}
                                className="p-2 bg-rose-500/20 hover:bg-rose-500/40 rounded-lg text-rose-500 transition-all"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                        {(!selectedTask.attachments || selectedTask.attachments.length === 0) && (
                          <div className="col-span-2 py-8 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-slate-600">
                            <Paperclip size={24} className="mb-2 opacity-20" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">No attachments</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/5 flex gap-4">
                    <button
                      onClick={async () => {
                        const res = await fetch('/api/regular-tasks/promote', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ id: selectedTask._id })
                        });
                        const data = await res.json();
                        if (data.success) {
                          toast.success(data.message);
                          setTasks(tasks.filter(t => t._id !== selectedTask._id));
                          setSelectedTask(null);
                        } else {
                          toast.error(data.error || "Promotion failed");
                        }
                      }}
                      className="flex-1 bg-white/5 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500 hover:text-white py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <MoveHorizontal size={18} /> Promote to Board
                    </button>
                    <button
                      onClick={() => toggleTaskComplete(selectedTask)}
                      className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                    >
                      {selectedTask.completed ? "Mark Incomplete" : "Complete Task"}
                    </button>
                    <button
                      onClick={() => deleteTask(selectedTask._id)}
                      className="px-6 bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white py-4 rounded-2xl transition-all active:scale-95"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* AI COACH MODAL */}
          <AnimatePresence>
            {showAiCoach && aiAnalysis && (
              <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 sm:p-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowAiCoach(false)}
                  className="absolute inset-0 bg-black/80 backdrop-blur-md"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-4xl bg-[#0a0a0f] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
                >
                  <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Brain className="text-white" size={24} />
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 w-fit">
                          <button
                            onClick={() => setAiCoachTab("analysis")}
                            className={cn(
                              "relative px-6 py-2 text-sm font-black transition-all rounded-xl",
                              aiCoachTab === "analysis" ? "text-white" : "text-slate-500 hover:text-slate-300"
                            )}
                          >
                            {aiCoachTab === "analysis" && (
                              <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                              />
                            )}
                            <span className="relative z-10">AI Advisor</span>
                          </button>
                          <button
                            onClick={() => setAiCoachTab("decision")}
                            className={cn(
                              "relative px-6 py-2 text-sm font-black transition-all rounded-xl",
                              aiCoachTab === "decision" ? "text-white" : "text-slate-500 hover:text-slate-300"
                            )}
                          >
                            {aiCoachTab === "decision" && (
                              <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                              />
                            )}
                            <span className="relative z-10">Decision Assistant</span>
                          </button>
                        </div>
                        <p className="text-[10px] text-indigo-400/80 font-black uppercase tracking-[0.3em] px-2">
                          {aiCoachTab === "analysis" ? "Predictive Budget Analysis" : "Pro / Con Logic Engine"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAiCoach(false)}
                      className="p-3 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all"
                    >
                      <Plus className="rotate-45" size={24} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {aiCoachTab === "analysis" ? (
                      <div className="space-y-10">
                        <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                              <Zap className="text-amber-400" size={20} />
                              <h3 className="text-lg font-bold text-white">Priority Suggestions</h3>
                            </div>
                            <div className="space-y-3">
                              {Object.entries(aiAnalysis.priorities).map(([id, data]) => {
                                const task = tasks.find(t => t._id === id || t.id === id);
                                if (!task) return null;
                                return (
                                  <div key={id} className="bg-white/5 border border-white/5 rounded-xl p-4 group hover:bg-white/[0.08] transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-xs font-black text-white truncate max-w-[150px]">{task.title}</span>
                                      <span className={cn(
                                        "text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest",
                                        data.category === "Do First" ? "bg-emerald-500/20 text-emerald-400" :
                                          data.category === "Can Wait" ? "bg-blue-500/20 text-blue-400" :
                                            data.category === "Delegate" ? "bg-amber-500/20 text-amber-400" : "bg-slate-500/20 text-slate-400"
                                      )}>
                                        {data.category}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-normal">{data.reasoning}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* RISKS */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                              <Shield className="text-rose-400" size={20} />
                              <h3 className="text-lg font-bold text-white">Risk Predictions</h3>
                            </div>
                            <div className="space-y-3">
                              {Object.entries(aiAnalysis.risks).map(([id, data]) => {
                                const task = tasks.find(t => t._id === id || t.id === id);
                                if (!task) return null;
                                return (
                                  <div key={id} className="bg-white/5 border border-white/5 rounded-xl p-4 border-l-4 border-l-rose-500/50">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-xs font-black text-white truncate max-w-[150px]">{task.title}</span>
                                      <span className={cn(
                                        "flex items-center gap-1 text-[9px] font-black uppercase tracking-widest",
                                        data.riskLevel === "high" ? "text-rose-500" : "text-amber-500"
                                      )}>
                                        <AlertTriangle size={10} /> {data.riskLevel} Risk
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 mb-2 font-medium">{data.prediction}</p>
                                    <div className="bg-black/40 rounded-lg p-2 text-[10px] text-indigo-300 font-mono italic">
                                      💡 {data.suggestedAction}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <form onSubmit={handleDecisionSubmit} className="space-y-4">
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 focus-within:border-indigo-500/50 transition-all">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Ask a Decision Question</p>
                            <div className="flex gap-4">
                              <input
                                value={decisionQuery}
                                onChange={(e) => setDecisionQuery(e.target.value)}
                                placeholder="Should I buy this laptop now?"
                                className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder:text-slate-700"
                              />
                              <button
                                disabled={isDecisionLoading}
                                className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                              >
                                {isDecisionLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                                Ask AI
                              </button>
                            </div>
                          </div>
                        </form>

                        {decisionResult && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                          >
                            <div className="space-y-6">
                              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 border-t-4 border-t-indigo-500">
                                <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-4">Verdict</h3>
                                <p className="text-3xl font-black text-white">{decisionResult.verdict}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6">
                                  <p className="text-[10px] font-bold text-emerald-500 uppercase mb-4">Pros</p>
                                  <ul className="space-y-2">
                                    {decisionResult.pros.map((pro, i) => <li key={i} className="text-xs text-slate-300 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" /> {pro}</li>)}
                                  </ul>
                                </div>
                                <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-6">
                                  <p className="text-[10px] font-bold text-rose-500 uppercase mb-4">Cons</p>
                                  <ul className="space-y-2">
                                    {decisionResult.cons.map((con, i) => <li key={i} className="text-xs text-slate-300 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 shrink-0" /> {con}</li>)}
                                  </ul>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <DecisionImpactCard icon={<Zap size={16} />} title="Productivity Impact" content={decisionResult.productivityImpact} color="amber" />
                              <DecisionImpactCard icon={<DollarSign size={16} />} title="Financial Impact" content={decisionResult.financialImpact} color="indigo" />
                              <DecisionImpactCard icon={<Target size={16} />} title="Goal Alignment" content={decisionResult.goalAlignment} color="emerald" />
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-8 border-t border-white/5 bg-white/[0.01]">
                    <button
                      onClick={() => setShowAiCoach(false)}
                      className="w-full bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-bold text-sm transition-all"
                    >
                      Dismiss Coach
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showCameraModal && (
              <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full max-w-2xl bg-[#0a0a0f] border border-white/10 rounded-[32px] overflow-hidden relative"
                >
                  <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Live Camera Capture</span>
                    <button onClick={stopCamera} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 transition-all">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="relative aspect-video bg-black">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  <div className="p-8 flex items-center justify-center gap-4">
                    <button
                      onClick={stopCamera}
                      className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold text-sm transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={captureCameraImage}
                      className="px-10 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-2"
                    >
                      <Camera size={18} /> Capture Bill
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </>
    </div>
  );
}

function DecisionImpactCard({ icon, title, content, color }) {
  const colors = {
    amber: "from-amber-500/20 to-orange-500/10 border-amber-500/20 text-amber-500",
    indigo: "from-indigo-500/20 to-purple-500/10 border-indigo-500/20 text-indigo-500",
    emerald: "from-emerald-500/20 to-teal-500/10 border-emerald-500/20 text-emerald-500",
  };
  return (
    <div className={cn("p-6 rounded-2xl border bg-gradient-to-br space-y-3", colors[color])}>
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>
      </div>
      <p className="text-xs text-slate-300 leading-relaxed font-medium">{content}</p>
    </div>
  );
}

function FinanceDashboard({ tasks, onAnalyze, isAnalyzing, aiAnalysis }) {
  const financeTasks = tasks.filter(t => t.category === "Finance" || t.financeDetails?.isFinanceTask);
  const totalDues = financeTasks.filter(t => !t.completed && t.financeDetails?.paymentStatus === 'pending').reduce((acc, curr) => acc + (Number(curr.financeDetails?.amount) || 0), 0);
  const subscriptions = financeTasks.filter(t => t.financeDetails?.isSubscription);
  const savingsGoals = tasks.filter(t => t.savingsDetails?.isGoal);

  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const result = [];

    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = months[d.getMonth()];

      const monthlyTotal = tasks.reduce((acc, task) => {
        if (!task.financeDetails?.amount) return acc;
        const taskDate = task.dueDate ? new Date(task.dueDate) : new Date(task.createdAt);
        if (taskDate.getMonth() === d.getMonth() && taskDate.getFullYear() === d.getFullYear()) {
          return acc + Number(task.financeDetails.amount);
        }
        return acc;
      }, 0);

      result.push({ name: monthName, amount: monthlyTotal });
    }
    return result;
  }, [tasks]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Finance Dashboard</h2>
          <p className="text-slate-500 mt-1">360-degree view of your financial ecosystem.</p>
        </div>
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all"
        >
          {isAnalyzing ? <Activity className="animate-spin" size={18} /> : <Brain size={18} />}
          Analyze Budget
        </button>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Monthly Burn" value={`$${totalDues}`} icon={<CreditCard className="text-rose-500" />} color="rose" />
        <DashboardCard
          title="Total Savings"
          value={`$${savingsGoals.reduce((acc, curr) => acc + (Number(curr.savingsDetails?.currentAmount) || 0), 0)}`}
          icon={<Zap className="text-emerald-500" />}
          color="emerald"
        />
        <DashboardCard title="Subscriptions" value={subscriptions.length} icon={<RefreshCw className="text-blue-500" />} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SPENDING CHART */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md">
          <h3 className="text-lg font-bold text-white mb-8">Spending Over Time</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10, fontWeight: "bold" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10, fontWeight: "bold" }} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px" }}
                  cursor={{ fill: "rgba(99, 102, 241, 0.05)" }}
                />
                <Bar dataKey="amount" fill="url(#colorGradient)" radius={[6, 6, 0, 0]} barSize={40} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SAVINGS GOALS */}
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md">
          <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
            <Target size={20} className="text-indigo-400" /> Savings Goals
          </h3>
          <div className="space-y-6">
            {savingsGoals.length > 0 ? savingsGoals.map(goal => {
              const progress = Math.min(100, (goal.savingsDetails.currentAmount / goal.savingsDetails.targetAmount) * 100);
              return (
                <div key={goal._id} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-300">{goal.title}</span>
                    <span className="text-xs font-mono text-emerald-400">${goal.savingsDetails.currentAmount} / ${goal.savingsDetails.targetAmount}</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                    />
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-10 opacity-30 text-xs italic">No active goals found</div>
            )}
          </div>
        </div>
      </div>

      {/* SUBSCRIPTION DETECTOR */}
      <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <RefreshCw size={20} className="text-blue-400" /> Subscription Ghost Detector
          </h3>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Annual Waste Detection Active</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {subscriptions.map(sub => (
            <div key={sub._id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                  <CreditCard size={14} />
                </div>
                <span className="text-[10px] font-black text-rose-500">-${((sub.financeDetails.amount || 0) * 12).toFixed(0)}/yr</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{sub.title}</h4>
              <p className="text-[10px] text-slate-500 font-medium">Billed {sub.recurring?.frequency || 'Monthly'}</p>
            </div>
          ))}
          {subscriptions.length === 0 && <div className="col-span-full py-10 text-center opacity-30 text-xs">No active subscriptions detected.</div>}
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, icon, color }) {
  const colors = {
    rose: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20"
  };

  return (
    <div className={cn("p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group hover:scale-[1.02] transition-all")}>
      <div className={cn("absolute top-[-20%] right-[-10%] w-32 h-32 blur-[80px] rounded-full opacity-20", color === 'rose' ? 'bg-rose-600' : color === 'emerald' ? 'bg-emerald-600' : 'bg-blue-600')} />
      <div className="relative z-10">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", colors[color])}>
          {icon}
        </div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">{title}</p>
        <h4 className="text-4xl font-black text-white tracking-tighter">{value}</h4>
      </div>
    </div>
  );
}


