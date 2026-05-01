"use client";

import React, { useState, useEffect } from "react";
import {
  Plus, Trash2, Target, X, KanbanSquare,
  AlignLeft, CheckSquare, MessageSquare, Paperclip,
  Tag, Clock, Activity, User, MoreHorizontal, Eye, Share, LayoutList,
  Calendar, UserPlus, Sparkles, LineChart, Sun, Moon, ChevronDown, ChevronRight, FolderKanban, Keyboard, Menu, History, Shield, MessageCircleHeart, Star, Image,
  Brain, Zap, Lightbulb, AlertTriangle, Trophy, RefreshCw, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const BOARD_BACKGROUNDS = [
  { id: 'none', name: 'Default', url: '' },
  { id: 'custom', name: 'Abstract AI', url: '/board-bg.png' },
  { id: 'bg1', name: 'Night City', url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=1000' },
  { id: 'bg2', name: 'Mountain Lake', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000' },
  { id: 'bg3', name: 'Modern Architecture', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000' },
  { id: 'bg4', name: 'Deep Space', url: 'https://images.unsplash.com/photo-1464802686167-b939a67e0621?auto=format&fit=crop&q=80&w=1000' },
  { id: 'bg5', name: 'Zen Garden', url: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=1000' },
  { id: 'bg6', name: 'Cyberpunk', url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=1000' },
  { id: 'bg7', name: 'Tropical Beach', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000' },
  { id: 'bg8', name: 'Desert Sunset', url: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&q=80&w=1000' },
  { id: 'bg9', name: 'Snowy Forest', url: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&q=80&w=1000' },
  { id: 'bg10', name: 'Abstract Liquid', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1000' },
  { id: 'bg11', name: 'Minimalist Interior', url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1000' },
  { id: 'bg12', name: 'Mist Forest', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000' },
  { id: 'bg13', name: 'Neon Street', url: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=1000' },
  { id: 'bg14', name: 'Ocean Waves', url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=1000' },
  { id: 'bg15', name: 'Golden Hour Peak', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1000' },
  { id: 'bg16', name: 'Lavender Field', url: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?auto=format&fit=crop&q=80&w=1000' },
  { id: 'bg17', name: 'Rainy Night', url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=1000' },
  { id: 'bg18', name: 'Dark Marble', url: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=1000' },
  { id: 'bg19', name: 'Soft Gradient', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1000' },
  { id: 'bg20', name: 'Tech Grid', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000' },
];

import { cn } from "@/lib/utils";
import { RichTextEditor } from "./rich-text-editor";
import { ReflectionModal } from "./reflection-modal";
import { CommandPalette } from "./command-palette";
import { useRouter } from "next/navigation";
import { ListView } from "./list-view";
import { CalendarView } from "./calendar-view";
import { DashboardView } from "./dashboard-view";
import { GlobalChat } from "./global-chat";
import { TimeTravelSlider } from "./time-travel-slider";

function BoardSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <header className="border-b border-border/50 bg-background/80 sticky top-0 z-10 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-muted animate-pulse" />
          <div className="w-32 h-6 rounded bg-muted animate-pulse" />
        </div>
        <div className="hidden md:flex gap-2">
          <div className="w-20 h-8 rounded bg-muted animate-pulse" />
          <div className="w-20 h-8 rounded bg-muted animate-pulse" />
          <div className="w-20 h-8 rounded bg-muted animate-pulse" />
        </div>
        <div className="flex gap-4 items-center">
          <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
        </div>
      </header>
      <div className="flex-1 p-8 flex gap-6 overflow-hidden">
        {[1, 2, 3].map(col => (
          <div key={col} className="w-[340px] shrink-0 bg-muted/20 border border-border/50 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center mb-2">
              <div className="w-24 h-5 rounded bg-muted animate-pulse" />
              <div className="w-6 h-6 rounded bg-muted animate-pulse" />
            </div>
            {[1, 2].map(card => (
              <div key={card} className="w-full h-24 rounded-xl bg-card border border-border/50 shadow-sm p-4 flex flex-col gap-2 animate-pulse">
                <div className="w-3/4 h-4 rounded bg-muted" />
                <div className="w-1/2 h-3 rounded bg-muted/50 mt-2" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  useDroppable
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
// --- CONSTANTS ---
const DEFAULT_COLUMNS = ["To Do", "In Progress", "Done"];

const DEFAULT_TASKS = [
  { id: "1", title: "Review project architecture", column: "To Do" },
  { id: "2", title: "Refactor UI for a premium aesthetic", column: "In Progress" },
  { id: "3", title: "Finalize deployment configuration", column: "Done" },
];


const TaskPulse = ({ task }) => {
  const checklist = task.checklists?.flatMap(c => c.items) || task.checklist || [];
  if (checklist.length === 0) return null;
  const completed = checklist.filter(i => i.completed).length;
  const percentage = Math.round((completed / checklist.length) * 100);
  const strokeDasharray = 2 * Math.PI * 8;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  return (
    <div className="flex items-center gap-1.5 ml-auto text-[10px] font-bold text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded-full border border-border/50">
      <svg className="w-3.5 h-3.5 rotate-[-90deg]">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" fill="transparent" className="opacity-20" />
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" fill="transparent" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="text-primary transition-all duration-500" />
      </svg>
      {percentage}%
    </div>
  );
};

const OnlineIndicator = ({ lastActive }) => {
  const isOnline = lastActive && (new Date() - new Date(lastActive)) < 60000; // Online if active in last 1 min
  return (
    <div className={cn(
      "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background",
      isOnline ? "bg-emerald-500" : "bg-muted-foreground/30"
    )} />
  );
};

const getAvatarColor = (email) => {
  const colors = ["bg-red-500", "bg-orange-500", "bg-amber-500", "bg-green-500", "bg-emerald-500", "bg-teal-500", "bg-cyan-500", "bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-purple-500", "bg-pink-500", "bg-rose-500"];
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getDuration = (createdAt) => {
  if (!createdAt) return null;
  const start = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now - start);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 0) return `${diffDays}d ago`;
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  if (diffHours > 0) return `${diffHours}h ago`;
  const diffMins = Math.floor(diffTime / (1000 * 60));
  return `${diffMins}m ago`;
};

// --- ZEN FOCUS MODE COMPONENT ---
function ZenFocusMode({ task, onClose, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-background/98 backdrop-blur-3xl"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-8 right-8 p-3 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all z-10">
        <X size={24} />
      </button>

      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="text-center max-w-2xl px-6 relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-10 inline-flex items-center justify-center p-5 rounded-2xl bg-primary/10 text-primary shadow-[0_0_40px_rgba(var(--primary),0.2)]">
          <Target size={40} />
        </div>
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-8 text-foreground leading-tight">
          {task.title}
        </h2>

        <div className="text-8xl md:text-[14rem] font-medium tabular-nums tracking-tighter mb-16 text-foreground opacity-90 font-mono">
          {minutes}:{seconds}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setIsActive(!isActive)}
            className="px-10 py-4 text-sm font-medium uppercase tracking-widest rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25"
          >
            {isActive ? "Pause Focus" : "Start Focus"}
          </button>
          <button
            onClick={() => {
              onComplete(task.id);
              onClose();
              toast.success(`Completed "${task.title}"`);
            }}
            className="px-10 py-4 text-sm font-medium uppercase tracking-widest rounded-full border border-border bg-background hover:bg-foreground hover:text-background transition-all"
          >
            Mark Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- KEYBOARD SHORTCUTS MODAL COMPONENT ---
function KeyboardShortcutsModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md bg-card text-card-foreground border border-border shadow-2xl rounded-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Keyboard Shortcuts</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md transition-colors"><X size={18} /></button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Global Command Palette</span>
            <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono font-bold">Alt+K</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Add new board/column</span>
            <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono font-bold">C</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Close modals or inputs</span>
            <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono font-bold">Esc</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Show shortcuts</span>
            <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono font-bold">?</kbd>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- AI ASSISTANT COMPONENT ---
function AiAssistant({ task, onClose }) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [response, setResponse] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    let typeInterval;
    let isMounted = true;

    async function fetchAi() {
      try {
        const res = await fetch('/api/ai/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: task.title, description: task.description })
        });

        if (!res.ok) throw new Error('Failed to generate AI response');

        const data = await res.json();
        const fullResponse = data.text;

        if (!isMounted) return;
        setIsGenerating(false);

        let currentIndex = 0;
        typeInterval = setInterval(() => {
          if (currentIndex <= fullResponse.length) {
            setResponse(fullResponse.slice(0, currentIndex));
            currentIndex++;
          } else {
            clearInterval(typeInterval);
          }
        }, 15); // Faster typing for Groq
      } catch (err) {
        if (!isMounted) return;
        setIsGenerating(false);
        setError("AI is currently unavailable. Please try again later.");
      }
    }

    fetchAi();

    return () => {
      isMounted = false;
      if (typeInterval) clearInterval(typeInterval);
    };
  }, [task.title, task.description]);

  return (
    <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 rounded-xl p-5 mb-6 shadow-inner relative overflow-hidden animate-in slide-in-from-top-4 duration-500">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50"></div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
          <Sparkles size={16} className={cn(isGenerating && "animate-pulse text-purple-500")} />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">AI Assistant</span>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X size={16} /></button>
      </div>

      {isGenerating ? (
        <div className="flex items-center gap-3 text-sm text-muted-foreground py-2 font-medium">
          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          Generating solution...
        </div>
      ) : error ? (
        <div className="text-sm text-red-500 font-medium">
          {error}
        </div>
      ) : (
        <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90 font-medium">
          {response}
          <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-500 animate-pulse align-middle"></span>
        </div>
      )}
    </div>
  );
}

// --- CHECKLIST SECTION COMPONENT ---
function ChecklistSection({ checklist, task, onUpdateTask, activeChecklists }) {
  const [newItemText, setNewItemText] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(checklist.title);
  const [isGenerating, setIsGenerating] = useState(false);

  const completedCount = checklist.items.filter(i => i.completed).length;
  const progressPercent = checklist.items.length === 0 ? 0 : Math.round((completedCount / checklist.items.length) * 100);

  const updateThisChecklist = (updates) => {
    onUpdateTask(task.id, {
      checklists: activeChecklists.map(cl => cl.id === checklist.id ? { ...cl, ...updates } : cl)
    });
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItemText.trim()) {
      updateThisChecklist({ items: [...checklist.items, { id: Date.now().toString(), text: newItemText.trim(), completed: false }] });
      setNewItemText("");
      setIsAdding(false);
    }
  };

  const toggleItem = (itemId) => {
    updateThisChecklist({ items: checklist.items.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item) });
  };

  const deleteItem = (itemId, e) => {
    e.stopPropagation();
    updateThisChecklist({ items: checklist.items.filter(item => item.id !== itemId) });
  };

  const deleteChecklist = () => {
    onUpdateTask(task.id, { checklists: activeChecklists.filter(cl => cl.id !== checklist.id) });
  };

  const generateBreakdown = async () => {
    if (!task.title) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: task.title, description: task.description })
      });
      if (!res.ok) throw new Error("Failed to generate subtasks");
      const data = await res.json();
      if (data.items && Array.isArray(data.items) && data.items.length > 0) {
        const newItems = data.items.map((text, i) => ({ id: Date.now().toString() + i, text, completed: false }));
        updateThisChecklist({ items: [...checklist.items, ...newItems] });
        toast.success("AI Breakdown complete!");
      } else {
        toast.error("AI returned empty breakdown");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <CheckSquare className="text-muted-foreground" size={20} />
          {isEditingTitle ? (
            <input
              autoFocus
              value={titleText}
              onChange={e => setTitleText(e.target.value)}
              onBlur={() => { setIsEditingTitle(false); updateThisChecklist({ title: titleText || "Checklist" }); }}
              onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); }}
              className="text-lg font-semibold bg-transparent border-b border-primary outline-none flex-1 max-w-[200px]"
            />
          ) : (
            <h3 onClick={() => setIsEditingTitle(true)} className="text-lg font-semibold cursor-pointer hover:bg-muted/50 px-1 rounded -ml-1 transition-colors">{checklist.title}</h3>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          <button onClick={generateBreakdown} disabled={isGenerating} className="px-3 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-50 border border-indigo-500/20 shadow-sm">
            <Sparkles size={12} className={cn(isGenerating && "animate-pulse")} />
            {isGenerating ? "Generating..." : "Auto-Breakdown"}
          </button>
          <button onClick={deleteChecklist} className="px-3 py-1.5 bg-muted hover:bg-destructive/10 hover:text-destructive text-xs font-medium rounded-md transition-colors">Delete</button>
        </div>
      </div>
      <div className="ml-8 space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-8 text-right">{progressPercent}%</span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
        <div className="space-y-1">
          {checklist.items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-3 p-2 rounded-md hover:bg-muted/50 group transition-colors">
              <label className="flex-1 flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="hidden" checked={item.completed} onChange={() => toggleItem(item.id)} />
                <div className={cn("w-4 h-4 mt-0.5 rounded border flex items-center justify-center transition-colors shrink-0", item.completed ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/50 group-hover:border-primary")}>
                  {item.completed && <CheckSquare size={12} className="opacity-100" />}
                </div>
                <span className={cn("text-sm transition-all", item.completed && "line-through text-muted-foreground")}>{item.text}</span>
              </label>
              <button onClick={(e) => deleteItem(item.id, e)} className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        {isAdding ? (
          <form onSubmit={handleAddItem} className="mt-2 flex flex-col gap-2">
            <input autoFocus type="text" placeholder="Add an item..." value={newItemText} onChange={(e) => setNewItemText(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-1 focus:ring-primary outline-none" />
            <div className="flex gap-2">
              <button type="submit" disabled={!newItemText.trim()} className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg disabled:opacity-50">Add</button>
              <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-1.5 text-xs font-medium hover:bg-muted rounded-lg">Cancel</button>
            </div>
          </form>
        ) : (
          <button onClick={() => setIsAdding(true)} className="px-3 py-2 bg-muted/50 hover:bg-muted text-sm font-medium rounded-md transition-colors text-muted-foreground w-full text-left">
            + Add an item
          </button>
        )}
      </div>
    </div>
  );
}

// --- TASK DETAIL MODAL COMPONENT ---
function TaskDetailModal({ task, allTasks = [], user, onClose, onUpdateTask, onAIChecklist, onAddChecklist, initialShowAi = false, boardLabels, setBoardLabels }) {
  const [desc, setDesc] = useState(task.description || "");
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("bg-indigo-500");

  const [newComment, setNewComment] = useState("");
  const [isPolishingComment, setIsPolishingComment] = useState(false);

  const [showLabels, setShowLabels] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showDependencies, setShowDependencies] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [showAi, setShowAi] = useState(initialShowAi);
  const [showAttachments, setShowAttachments] = useState(false);
  const [attachmentLink, setAttachmentLink] = useState("");
  const [attachmentName, setAttachmentName] = useState("");

  if (!task) return null;

  const logHistory = (action, detail) => {
    return {
      action,
      detail,
      timestamp: new Date().toLocaleString()
    };
  };

  const handleSaveDesc = () => {
    onUpdateTask(task.id, {
      description: desc,
      history: [...(task.history || []), logHistory("Description Updated", "Modified the task description")]
    });
    setIsEditingDesc(false);
  };

  const activeChecklists = task.checklists || (task.checklist ? [{ id: "legacy", title: "Checklist", items: task.checklist }] : []);

  const handleAddChecklist = () => {
    onAddChecklist(task.id);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now().toString(),
      text: newComment,
      author: user?.name || "User",
      timestamp: new Date().toLocaleString()
    };
    onUpdateTask(task.id, {
      comments: [...(task.comments || []), comment],
      history: [...(task.history || []), logHistory("Comment Added", "Added a new comment")]
    });
    setNewComment("");
  };

  const handlePolishComment = async () => {
    if (!newComment.trim()) return;
    setIsPolishingComment(true);
    const loadingToast = toast.loading("Polishing comment with AI...");
    try {
      const res = await fetch('/api/ai/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newComment })
      });
      if (!res.ok) throw new Error("Failed to polish text");
      const data = await res.json();
      if (data.text) {
        setNewComment(data.text);
        toast.success("Comment polished!", { id: loadingToast });
      } else {
        toast.error("AI returned empty result", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Something went wrong", { id: loadingToast });
    } finally {
      setIsPolishingComment(false);
    }
  };

  const toggleLabel = (labelId) => {
    const currentLabels = task.labels || [];
    const newLabels = currentLabels.includes(labelId)
      ? currentLabels.filter(id => id !== labelId)
      : [...currentLabels, labelId];

    const labelData = boardLabels.find(l => l.id === labelId);
    const action = currentLabels.includes(labelId) ? "Removed Label" : "Added Label";

    onUpdateTask(task.id, {
      labels: newLabels,
      history: [...(task.history || []), logHistory(action, labelData ? labelData.label : labelId)]
    });
  };

  const handleDateChange = (e) => {
    onUpdateTask(task.id, { dueDate: e.target.value });
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (newMemberEmail.trim()) {
      const email = newMemberEmail.trim().toLowerCase();
      const members = task.members || [];
      if (!members.includes(email)) {
        onUpdateTask(task.id, {
          members: [...members, email],
          history: [...(task.history || []), logHistory("Member Added", email)]
        });
      }
      setNewMemberEmail("");
    }
  };

  const handleRemoveMember = (emailToRemove) => {
    const members = task.members || [];
    onUpdateTask(task.id, {
      members: members.filter(e => e !== emailToRemove),
      history: [...(task.history || []), logHistory("Member Removed", emailToRemove)]
    });
  };

  const toggleDependency = (blockerId) => {
    const currentBlockers = task.blockedBy || [];
    const newBlockers = currentBlockers.includes(blockerId)
      ? currentBlockers.filter(id => id !== blockerId)
      : [...currentBlockers, blockerId];

    const blockerTask = allTasks.find(t => t.id === blockerId);
    const action = currentBlockers.includes(blockerId) ? "Removed Blocker" : "Added Blocker";

    onUpdateTask(task.id, {
      blockedBy: newBlockers,
      history: [...(task.history || []), logHistory(action, blockerTask ? blockerTask.title : blockerId)]
    });
  };

  const handleAddLink = (e) => {
    e.preventDefault();
    if (!attachmentLink.trim()) return;
    const url = attachmentLink.trim();
    const name = attachmentName.trim() || url;
    const newAttachment = { id: Date.now().toString(), type: 'link', url, name, createdAt: new Date() };
    onUpdateTask(task.id, {
      attachments: [...(task.attachments || []), newAttachment],
      history: [...(task.history || []), logHistory("Added Attachment", name)]
    });
    setAttachmentLink("");
    setAttachmentName("");
    setShowAttachments(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      let type = 'file';
      if (file.type.startsWith('image/')) type = 'image';
      if (file.type.startsWith('video/')) type = 'video';
      const newAttachment = { id: Date.now().toString(), type, url: event.target.result, name: file.name, createdAt: new Date() };
      onUpdateTask(task.id, {
        attachments: [...(task.attachments || []), newAttachment],
        history: [...(task.history || []), logHistory("Uploaded Attachment", file.name)]
      });
    };
    reader.readAsDataURL(file);
    setShowAttachments(false);
  };

  const removeAttachment = (attachmentId) => {
    const att = task.attachments.find(a => a.id === attachmentId);
    onUpdateTask(task.id, {
      attachments: (task.attachments || []).filter(a => a.id !== attachmentId),
      history: [...(task.history || []), logHistory("Removed Attachment", att?.name || attachmentId)]
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.98, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.98, opacity: 0, y: 20 }}
        className="w-full max-w-[1100px] h-[100dvh] sm:h-auto sm:max-h-[90vh] overflow-y-auto bg-card/90 backdrop-blur-2xl text-card-foreground rounded-none sm:rounded-xl border-0 sm:border border-border/50 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="sticky top-0 bg-card/80 backdrop-blur-xl z-20 px-8 py-5 flex items-start justify-between border-b border-border/40 shadow-sm">
          <div className="flex gap-4 items-start w-full">
            <LayoutList className="text-primary mt-1 shrink-0" size={24} strokeWidth={1.5} />
            <div className="w-full">
              <input
                value={task.title}
                onChange={(e) => onUpdateTask(task.id, { title: e.target.value })}
                className="text-2xl font-bold tracking-tight leading-tight bg-transparent border-none outline-none w-full focus:ring-2 focus:ring-primary/20 rounded px-1 -ml-1 transition-all"
              />
              <p className="text-sm text-muted-foreground mt-1.5 font-medium">
                in list <span className="underline decoration-muted-foreground/30 underline-offset-4">{task.column}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-2 text-muted-foreground shrink-0 ml-4">
            <button onClick={onClose} className="p-2.5 hover:bg-muted hover:text-foreground rounded-lg transition-colors"><X size={20} strokeWidth={1.5} /></button>
          </div>
        </div>

        {/* Main Body */}
        <div className="flex flex-col md:flex-row gap-8 p-8 pt-6">
          {/* Left Column (Main Content) */}
          <div className="flex-1 flex flex-col gap-10">

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 relative">
              <button
                onClick={() => setShowAi(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-sm font-semibold rounded-md transition-all shadow-sm group"
              >
                <Sparkles size={14} className="group-hover:animate-pulse" /> AI Solve
              </button>

              <button onClick={() => setShowLabels(!showLabels)} className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 hover:bg-muted text-sm font-medium rounded-md transition-colors"><Tag size={14} /> Labels</button>

              <label className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 hover:bg-muted text-sm font-medium rounded-md transition-colors cursor-pointer relative overflow-hidden">
                <Clock size={14} /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Dates'}
                <input
                  type="date"
                  value={task.dueDate ? (task.dueDate.includes('T') ? task.dueDate.split('T')[0] : task.dueDate) : ''}
                  onChange={handleDateChange}
                  onClick={(e) => {
                    try {
                      e.currentTarget.showPicker();
                    } catch (err) { }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>

              <button onClick={handleAddChecklist} className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 hover:bg-muted text-sm font-medium rounded-md transition-colors"><CheckSquare size={14} /> Checklist</button>

              <button onClick={() => setShowMembers(!showMembers)} className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 hover:bg-muted text-sm font-medium rounded-md transition-colors"><UserPlus size={14} /> Members</button>

              <button onClick={() => setShowAttachments(!showAttachments)} className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 hover:bg-muted text-sm font-medium rounded-md transition-colors"><Paperclip size={14} /> Attachment</button>

              {/* Attachments Popover */}
              {showAttachments && (
                <div className="absolute top-10 left-0 w-80 bg-card border border-border shadow-xl rounded-lg p-4 z-20">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-4 text-center">Add Attachment</h4>

                  {/* File Upload Option */}
                  <div className="mb-4">
                    <label className="w-full flex flex-col items-center justify-center py-4 px-2 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-all group">
                      <Paperclip size={20} className="text-muted-foreground group-hover:text-primary mb-2" />
                      <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">Upload image, video or file</span>
                      <input type="file" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>

                  <div className="relative flex items-center mb-4">
                    <div className="flex-grow border-t border-border"></div>
                    <span className="flex-shrink mx-2 text-[10px] text-muted-foreground font-bold uppercase">OR</span>
                    <div className="flex-grow border-t border-border"></div>
                  </div>

                  {/* Link Option */}
                  <form onSubmit={handleAddLink} className="flex flex-col gap-2">
                    <input
                      type="url"
                      placeholder="Paste a link..."
                      required
                      value={attachmentLink}
                      onChange={(e) => setAttachmentLink(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-1 focus:ring-primary outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Link title (optional)..."
                      value={attachmentName}
                      onChange={(e) => setAttachmentName(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-1 focus:ring-primary outline-none"
                    />
                    <button type="submit" className="w-full py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg mt-1">Attach Link</button>
                  </form>
                </div>
              )}

              {/* Members Popover */}
              {showMembers && (
                <div className="absolute top-10 left-0 w-72 bg-card border border-border shadow-xl rounded-lg p-3 z-20">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-3 text-center">Assign Member</h4>
                  <form onSubmit={handleAddMember} className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Email address..."
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      className="w-full px-2 py-1.5 text-sm rounded border border-border bg-background focus:ring-1 focus:ring-primary outline-none"
                    />
                    <button type="submit" className="px-3 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded">Invite</button>
                  </form>

                  {task.members && task.members.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-xs text-muted-foreground mb-2 font-medium">Assigned Members</h5>
                      <div className="flex flex-col gap-2">
                        {task.members.map(email => (
                          <div key={email} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className={cn("w-6 h-6 rounded-full text-white flex items-center justify-center text-[10px] font-bold", getAvatarColor(email))}>{email.charAt(0).toUpperCase()}</div>
                              <span className="truncate max-w-[150px]">{email}</span>
                              <span className="text-[9px] text-muted-foreground uppercase font-bold bg-muted px-1 rounded">Member</span>
                            </div>
                            <button type="button" onClick={() => handleRemoveMember(email)} className="text-muted-foreground hover:text-destructive"><X size={14} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Blockers Popover */}
              {showDependencies && (
                <div className="absolute top-10 left-0 w-72 bg-card border border-border shadow-xl rounded-lg p-3 z-20">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-3 text-center">Blocked By</h4>
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {allTasks.filter(t => t.id !== task.id).length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center">No other tasks available</p>
                    ) : (
                      allTasks.filter(t => t.id !== task.id).map(otherTask => {
                        const isBlocked = task.blockedBy?.includes(otherTask.id);
                        return (
                          <button
                            key={otherTask.id}
                            onClick={() => toggleDependency(otherTask.id)}
                            className={cn(
                              "w-full text-left p-2 rounded text-sm transition-colors flex items-start gap-2 border",
                              isBlocked ? "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400" : "bg-muted/30 border-transparent hover:bg-muted"
                            )}
                          >
                            <div className="mt-0.5 shrink-0">
                              {isBlocked ? <X size={14} /> : <Tag size={14} className="text-muted-foreground" />}
                            </div>
                            <span className="truncate">{otherTask.title}</span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* Labels Popover */}
              {showLabels && (
                <div className="absolute top-10 left-0 w-64 bg-card border border-border shadow-xl rounded-lg p-3 z-20">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-3 text-center">Labels</h4>
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {boardLabels.map(lbl => {
                      const isActive = task.labels?.includes(lbl.id);
                      return (
                        <button
                          key={lbl.id}
                          onClick={() => toggleLabel(lbl.id)}
                          className={cn("w-full h-8 rounded px-3 text-left text-sm font-medium text-white flex items-center justify-between transition-opacity shrink-0", lbl.color, isActive ? "opacity-100 ring-2 ring-offset-2 ring-offset-card ring-primary" : "opacity-80 hover:opacity-100")}
                        >
                          {lbl.label}
                          {isActive && <CheckSquare size={14} />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3 pt-3 border-t border-border/50">
                    <h5 className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Create New</h5>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {["bg-red-500", "bg-orange-500", "bg-amber-500", "bg-green-500", "bg-emerald-500", "bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-purple-500", "bg-pink-500"].map(color => (
                        <button
                          key={color}
                          onClick={(e) => { e.stopPropagation(); setNewLabelColor(color); }}
                          className={cn("w-4 h-4 rounded-full", color, newLabelColor === color ? "ring-2 ring-offset-1 ring-offset-card ring-primary" : "")}
                        />
                      ))}
                    </div>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (newLabelName.trim()) {
                        const newLabel = { id: Date.now().toString(), color: newLabelColor, label: newLabelName.trim() };
                        setBoardLabels([...boardLabels, newLabel]);
                        toggleLabel(newLabel.id);
                        setNewLabelName("");
                        setShowLabels(false);
                      }
                    }} className="flex gap-2">
                      <input type="text" required placeholder="Label name..." value={newLabelName} onChange={e => setNewLabelName(e.target.value)} className="w-full px-2 py-1 text-xs rounded border border-border bg-background focus:ring-1 focus:ring-primary outline-none" />
                      <button type="submit" disabled={!newLabelName.trim()} className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded disabled:opacity-50">Add</button>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* AI Assistant View */}
            {showAi && <AiAssistant task={task} onClose={() => setShowAi(false)} />}

            {/* Render Labels if they exist */}
            {(task.labels && task.labels.length > 0 || task.members && task.members.length > 0) && (
              <div className="flex flex-wrap gap-8">
                {task.labels && task.labels.length > 0 && (
                  <div>
                    <h3 className="text-muted-foreground mb-2 text-xs font-semibold uppercase tracking-wider">Labels</h3>
                    <div className="flex flex-wrap gap-2">
                      {task.labels.map(lblId => {
                        const preset = boardLabels.find(p => p.id === lblId);
                        if (!preset) return null;
                        return <span key={lblId} className={cn("px-3 py-1 rounded text-xs font-semibold text-white", preset.color)}>{preset.label}</span>
                      })}
                    </div>
                  </div>
                )}

                {task.members && task.members.length > 0 && (
                  <div>
                    <h3 className="text-muted-foreground mb-2 text-xs font-semibold uppercase tracking-wider">Members</h3>
                    <div className="flex flex-wrap gap-1">
                      {task.members.map(email => (
                        <div key={email} title={email} className="relative">
                          <div className={cn("w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold ring-2 ring-card cursor-pointer", getAvatarColor(email))}>
                            {email.charAt(0).toUpperCase()}
                          </div>
                          <OnlineIndicator lastActive={new Date()} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Attachments Section */}
            {task.attachments && task.attachments.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Paperclip className="text-muted-foreground" size={20} />
                  <h3 className="text-lg font-semibold">Attachments</h3>
                </div>
                <div className="ml-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {task.attachments.map((att) => (
                    <div key={att.id} className="group relative flex flex-col bg-muted/20 border border-border/50 rounded-xl overflow-hidden hover:border-primary/30 transition-all shadow-sm">
                      {/* Preview Area */}
                      <div className="aspect-video w-full bg-muted/50 flex items-center justify-center overflow-hidden">
                        {att.type === 'image' ? (
                          <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
                        ) : att.type === 'video' ? (
                          <video src={att.url} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            {att.type === 'link' ? <Share size={24} /> : <Paperclip size={24} />}
                            <span className="text-[10px] font-bold uppercase tracking-widest">{att.type}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <a href={att.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white text-black rounded-full hover:scale-110 transition-transform">
                            <Eye size={18} />
                          </a>
                          <button onClick={() => removeAttachment(att.id)} className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      {/* Info Area */}
                      <div className="p-3">
                        <p className="text-sm font-semibold truncate pr-4">{att.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">
                          Added {new Date(att.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <AlignLeft className="text-muted-foreground" size={20} />
                <h3 className="text-lg font-semibold">Description</h3>
              </div>
              <div className="ml-8">
                {isEditingDesc ? (
                  <div className="flex flex-col gap-2">
                    <RichTextEditor
                      content={desc}
                      onChange={setDesc}
                    />
                    <div className="flex gap-2 mt-2">
                      <button onClick={handleSaveDesc} className="px-3 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-md">Save</button>
                      <button onClick={() => { setDesc(task.description || ""); setIsEditingDesc(false); }} className="px-3 py-1.5 hover:bg-muted text-sm font-medium rounded-md">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setIsEditingDesc(true)}
                    className={cn(
                      "w-full min-h-[60px] p-3 rounded-md cursor-pointer transition-colors text-sm prose prose-sm dark:prose-invert max-w-none",
                      task.description ? "bg-transparent hover:bg-muted/30" : "bg-muted/30 hover:bg-muted"
                    )}
                  >
                    {task.description ? (
                      <div dangerouslySetInnerHTML={{ __html: task.description }} />
                    ) : (
                      <p className="text-muted-foreground m-0">Add a more detailed description...</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Checklists */}
            <div className="flex items-center gap-2 mb-4">
              <CheckSquare className="text-muted-foreground" size={18} />
              <h3 className="font-semibold text-sm">Checklists</h3>
              <button
                onClick={() => onAIChecklist(task.id)}
                className="ml-auto flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 text-[10px] font-bold rounded-md transition-all border border-indigo-500/20"
                title="AI Suggested Checklist"
              >
                <Sparkles size={12} />
                AI Suggest
              </button>
            </div>
            {activeChecklists.length > 0 ? (
              <div className="space-y-6">
                {activeChecklists.map(checklist => (
                  <ChecklistSection key={checklist.id} checklist={checklist} task={task} onUpdateTask={onUpdateTask} activeChecklists={activeChecklists} />
                ))}
              </div>
            ) : (
              <div className="ml-8 p-4 rounded-xl border border-dashed border-border/40 text-center">
                <p className="text-xs text-muted-foreground mb-3">No checklists yet. Use AI to generate one or add manually.</p>
                <button onClick={handleAddChecklist} className="text-xs font-bold text-primary hover:underline">+ Add Checklist</button>
              </div>
            )}

          </div>

          {/* Right Column (Activity & Comments) */}
          <div className="w-full md:w-[480px] flex flex-col gap-6 bg-muted/10 md:-my-8 md:-mr-8 p-8 border-l border-border/40 shrink-0 shadow-[inset_10px_0_20px_-10px_rgba(0,0,0,0.05)] dark:shadow-[inset_10px_0_20px_-10px_rgba(0,0,0,0.2)]">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="text-muted-foreground" size={18} />
                <h3 className="font-semibold text-sm">Comments</h3>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 shrink-0 flex items-center justify-center text-white text-xs font-medium">You</div>
              <div className="flex-1 flex flex-col gap-2">
                <RichTextEditor
                  content={newComment}
                  onChange={setNewComment}
                  onAttachmentClick={() => setShowAttachments(!showAttachments)}
                  placeholder="Write a comment..."
                />
                <div className="flex gap-2 items-center justify-between">
                  <div className="flex gap-2">
                    {newComment.replace(/<[^>]*>/g, '').trim() && (
                      <button onClick={handleAddComment} className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-md">Save Comment</button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5 mt-2">
              {!task.comments || task.comments.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No comments yet.
                </div>
              ) : (
                task.comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 shrink-0 flex items-center justify-center text-white text-xs font-medium">You</div>
                    <div className="text-sm w-full">
                      <p className="font-semibold">{comment.author} <span className="font-normal text-xs text-muted-foreground ml-1">{comment.timestamp}</span></p>
                      <div className="mt-1 p-3 bg-muted/40 rounded-md border border-border/50 text-sm prose prose-sm dark:prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: comment.text }} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>


            <div className="mt-6 pt-6 border-t border-border/40">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="text-muted-foreground" size={18} />
                <h3 className="font-semibold text-sm">Activity History</h3>
              </div>
              <div className="flex flex-col gap-3">
                {!task.history || task.history.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No activity recorded yet.</p>
                ) : (
                  task.history.slice().reverse().map((log, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                        <Activity size={12} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-none">{log.action}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {log.detail} <span className="opacity-50 mx-1">•</span> {log.timestamp}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- SORTABLE TASK CARD ---
function TaskCard({ task, onFocus, onOpen, onOpenAi, onDelete, isOverlay = false, boardLabels = [] }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "Task", task }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-[100px] rounded-xl border border-dashed border-primary/40 bg-primary/5 opacity-50"
      />
    );
  }

  // Determine if we should show a badge area
  const hasLabels = task.labels && task.labels.length > 0;
  const hasDescription = !!task.description;
  const activeChecklists = task.checklists || (task.checklist ? [{ id: "legacy", title: "Checklist", items: task.checklist }] : []);
  const hasChecklist = activeChecklists.length > 0;
  const hasComments = task.comments && task.comments.length > 0;
  const hasDueDate = !!task.dueDate;
  const hasMembers = task.members && task.members.length > 0;
  const hasAttachments = task.attachments && task.attachments.length > 0;

  const checklistCompleted = activeChecklists.reduce((acc, cl) => acc + cl.items.filter(i => i.completed).length, 0);
  const checklistTotal = activeChecklists.reduce((acc, cl) => acc + cl.items.length, 0);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onOpen(task)}
      className={cn(
        "p-4 rounded-xl border flex flex-col gap-3 group relative bg-card text-card-foreground transition-all duration-200",
        isOverlay ? "scale-[1.03] shadow-2xl rotate-2 cursor-grabbing ring-2 ring-primary/40 shadow-primary/20 z-50 bg-background" : "cursor-pointer shadow-sm border-border/50 hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5"
      )}
    >
      {hasLabels && (
        <div className="flex flex-wrap gap-1 mb-1">
          {task.labels.map(lblId => {
            const preset = boardLabels.find(p => p.id === lblId);
            if (!preset) return null;
            return <div key={lblId} className={cn("h-2 w-8 rounded-full", preset.color)} title={preset.label}></div>
          })}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <p className="text-[15px] font-medium leading-relaxed text-foreground/90">{task.title}</p>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 font-medium">
          <Clock size={10} />
          <span>{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Just now'}</span>
          <span>•</span>
          <span>{getDuration(task.createdAt) || 'New'}</span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border/20">
        <div className="flex -space-x-1.5">
          {(task.members || []).slice(0, 3).map((m, i) => (
            <div
              key={i}
              className={cn("w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-[8px] font-bold text-white shadow-sm", getAvatarColor(m))}
              title={m}
            >
              {m.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>

        <TaskPulse task={task} />

        <div className="flex items-center gap-2.5 ml-auto text-muted-foreground">
          {task.dueDate && (
            <div className={cn(
              "flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight",
              new Date(task.dueDate) < new Date() ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"
            )} title={`Due: ${new Date(task.dueDate).toLocaleDateString()}`}>
              <Calendar size={10} />
              {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </div>
          )}
          {task.attachments?.length > 0 && (
            <div className="flex items-center gap-1" title="Attachments">
              <Paperclip size={12} />
              <span className="text-[10px] font-medium">{task.attachments.length}</span>
            </div>
          )}
          {(task.comments?.length > 0) && (
            <div className="flex items-center gap-1" title="Comments">
              <MessageSquare size={12} />
              <span className="text-[10px] font-medium">{task.comments.length}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-auto pt-2">
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); onFocus(task); }}
            onPointerDown={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all opacity-0 group-hover:opacity-100"
          >
            <Target size={12} /> Focus
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); onOpenAi && onOpenAi(task); }}
            onPointerDown={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-all opacity-0 group-hover:opacity-100"
          >
            <Sparkles size={12} /> AI
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); onDelete(task.id); }}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/10 text-destructive/80 hover:text-destructive"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- COLUMN COMPONENT ---
function Column({ title, tasks, onFocus, onOpen, onOpenAi, onDelete, onAddTask, onDeleteColumn, boardLabels }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const { setNodeRef, isOver } = useDroppable({
    id: title,
    data: { type: "Column", title }
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAddTask(title, newTaskTitle.trim());
      setNewTaskTitle("");
      setIsAdding(false);
    }
  };

  return (
    <div className={cn(
      "flex flex-col flex-shrink-0 w-[calc(100vw-2.5rem)] sm:w-[300px] lg:w-[340px] max-h-[78vh] sm:max-h-[85vh] bg-card/30 backdrop-blur-sm border rounded-2xl p-4 transition-all duration-300",
      isOver ? "border-primary/40 shadow-[0_0_30px_-5px_rgba(var(--primary),0.2)] bg-primary/5 scale-[1.01]" : "border-border/50 shadow-sm hover:border-border"
    )}>
      <div className="flex items-center justify-between mb-4 px-1 group">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          {title}
          <span className="text-[10px] font-bold bg-muted/60 text-foreground px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </h2>
        <button
          onClick={() => onDeleteColumn(title)}
          className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-destructive/60 hover:text-destructive transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div ref={setNodeRef} className="flex flex-col gap-3 overflow-y-auto flex-1 min-h-[150px] pb-2 custom-scrollbar">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onFocus={onFocus} onOpen={onOpen} onOpenAi={onOpenAi} onDelete={onDelete} boardLabels={boardLabels} />
          ))}
        </SortableContext>
        {tasks.length === 0 && !isAdding && (
          <div className="h-28 rounded-xl border border-dashed border-border/40 flex items-center justify-center text-sm text-muted-foreground bg-background/50">
            No tasks here
          </div>
        )}

        {isAdding ? (
          <form onSubmit={handleAddSubmit} className="mt-2 flex flex-col gap-2">
            <input
              autoFocus
              type="text"
              placeholder="Card title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-1 focus:ring-primary focus:outline-none"
            />
            <div className="flex gap-2">
              <button type="submit" disabled={!newTaskTitle.trim()} className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50">
                Add Card
              </button>
              <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-1.5 text-xs font-medium hover:bg-muted rounded-lg text-muted-foreground">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="mt-2 flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-xl transition-all border border-transparent hover:border-border/50"
          >
            <Plus size={16} /> Add a card
          </button>
        )}
      </div>
    </div>
  );
}

function ShortcutRow({ keys, label }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex gap-1">
        {keys.map((k, i) => (
          <kbd key={i} className="px-1.5 py-0.5 text-[10px] font-bold bg-muted border border-border rounded shadow-sm min-w-[20px] text-center">
            {k}
          </kbd>
        ))}
      </div>
    </div>
  );
}

// --- MAIN BOARD COMPONENT ---
export function TaskBoard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const [activeTask, setActiveTask] = useState(null); // For dragging
  const [focusedTask, setFocusedTask] = useState(null); // For Zen mode
  const [detailTask, setDetailTask] = useState(null); // For Trello-like Modal
  const [autoStartAi, setAutoStartAi] = useState(false); // Flag for AI
  const [boardLabels, setBoardLabels] = useState([]); // Global Labels
  const [showShortcuts, setShowShortcuts] = useState(false); // Keyboard shortcuts modal
  const [showBgSelector, setShowBgSelector] = useState(false);
  const [activeView, setActiveView] = useState("board"); // "board" | "list" | "calendar"

  // --- WORKSPACE STATE ---
  const [boards, setBoards] = useState([]); // all workspaces
  const [activeBoardId, setActiveBoardId] = useState(null); // current workspace ID
  const [activeBoard, setActiveBoard] = useState(null); // current workspace object (has .title)
  const [showWorkspacePicker, setShowWorkspacePicker] = useState(false);
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // mobile nav drawer
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showTimeTravel, setShowTimeTravel] = useState(false);
  const [timelineIndex, setTimelineIndex] = useState(-1); // -1 is present
  const [historyTasks, setHistoryTasks] = useState(null);
  const [historyColumns, setHistoryColumns] = useState(null);

  // --- FEEDBACK STATE ---
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState("feedback"); // 'bug' | 'feedback' | 'improvement'
  const [feedbackAttachments, setFeedbackAttachments] = useState([]);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // --- AI ANALYSIS STATE ---
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [showAiCoach, setShowAiCoach] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // --- REFLECTION STATE ---
  const [reflectionReport, setReflectionReport] = useState(null);
  const [isReflecting, setIsReflecting] = useState(false);
  const [showReflectionModal, setShowReflectionModal] = useState(false);

  const activeTasks = timelineIndex === -1 ? tasks : historyTasks;
  const activeColumns = timelineIndex === -1 ? (activeBoard?.columns || DEFAULT_COLUMNS) : historyColumns;

  const fetchAiAnalysis = async () => {
    if (activeTasks.length === 0) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: activeTasks, contextType: 'workspace' })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAiAnalysis(data);
      setShowAiCoach(true);
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
          tasks: activeTasks,
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

  useEffect(() => {
    // Check Theme
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }

    // Fetch User Profile
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(err => console.error(err));

    // Fetch Board Data (no boardId = load first/default board)
    loadBoard(null);

    // Heartbeat for usage tracking
    const heartbeatInterval = setInterval(() => {
      fetch('/api/auth/heartbeat', { method: 'POST' }).catch(() => { });
    }, 60000);

    return () => clearInterval(heartbeatInterval);
  }, []);

  const handleTimelineChange = (index) => {
    setTimelineIndex(index);
    if (index === -1) {
      setHistoryTasks(null);
      setHistoryColumns(null);
      setShowTimeTravel(false);
      toast.info("Returned to present state");
    } else {
      const snapshot = activeBoard.snapshots[index];
      setHistoryTasks(snapshot.state.tasks);
      setHistoryColumns(snapshot.state.columns);
      toast.info(`Viewing board as it was on ${new Date(snapshot.timestamp).toLocaleString()}`);
    }
  };

  const handleSendMessage = async (text) => {
    if (!activeBoardId) return;
    try {
      const res = await fetch('/api/board/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardId: activeBoardId, text })
      });
      const data = await res.json();
      if (data.message) {
        const newMessage = data.message;
        setBoards(prev => prev.map(b => b._id === activeBoardId ? { ...b, chat: [...(b.chat || []), newMessage] } : b));
        setActiveBoard(prev => ({ ...prev, chat: [...(prev.chat || []), newMessage] }));
      }
    } catch (e) {
      toast.error("Failed to send message");
    }
  };

  const handleFeedbackFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large. Max 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      let type = 'file';
      if (file.type.startsWith('image/')) type = 'image';
      if (file.type.startsWith('video/')) type = 'video';

      const newAttachment = {
        id: Date.now().toString(),
        type,
        url: event.target.result,
        name: file.name,
        createdAt: new Date()
      };
      setFeedbackAttachments(prev => [...prev, newAttachment]);
    };
    reader.readAsDataURL(file);
    // Reset input
    e.target.value = null;
  };

  const removeFeedbackAttachment = (id) => {
    setFeedbackAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackMsg.trim()) return;
    setIsSubmittingFeedback(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: feedbackMsg,
          rating: feedbackRating,
          type: feedbackType,
          attachments: feedbackAttachments
        })
      });
      if (res.ok) {
        toast.success("Feedback sent! Thank you.");
        setShowFeedbackModal(false);
        setFeedbackMsg("");
        setFeedbackRating(0);
        setFeedbackType("feedback");
        setFeedbackAttachments([]);
      } else {
        toast.error("Failed to send feedback");
      }
    } catch (err) {
      toast.error("Failed to send feedback");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleAIChecklist = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const loadingToast = toast.loading("AI is generating your checklist...");
    try {
      const res = await fetch('/api/ai/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: task.title, description: task.description })
      });

      if (!res.ok) throw new Error("Failed to generate");
      const data = await res.json();

      const newChecklist = {
        id: Date.now().toString(),
        title: "AI Suggested Tasks",
        items: data.checklistItems.map(text => ({ id: Math.random().toString(), text, completed: false }))
      };

      updateTask(taskId, {
        checklists: [...(task.checklists || []), newChecklist]
      });

      toast.success("Checklist generated!", { id: loadingToast });
    } catch (err) {
      toast.error("Failed to generate checklist", { id: loadingToast });
    }
  };

  const loadBoard = (boardId) => {
    setIsLoaded(false);
    const url = boardId ? `/api/board?boardId=${boardId}` : '/api/board';
    fetch(url, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.boards) setBoards(data.boards);
        if (data.activeBoard) {
          setActiveBoardId(data.activeBoard._id);
          setActiveBoard(data.activeBoard);         // ← store the full object with title
          setColumns(data.activeBoard.columns || DEFAULT_COLUMNS);
          setBoardLabels(data.activeBoard.labels || []);
        }
        if (data.tasks) setTasks(data.tasks);
        setIsLoaded(true);
      })
      .catch(err => {
        console.error("Failed to load board", err);
        setColumns(DEFAULT_COLUMNS);
        setTasks(DEFAULT_TASKS);
        setIsLoaded(true);
      });
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      toast.error("Failed to logout");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts if user is typing in an input, textarea, or contenteditable element
      if (
        e.target.tagName.toLowerCase() === 'input' ||
        e.target.tagName.toLowerCase() === 'textarea' ||
        e.target.isContentEditable
      ) {
        if (e.key === 'Escape') {
          e.target.blur();
        }
        return;
      }

      if (e.key === '?') {
        e.preventDefault();
        setShowShortcuts(true);
      } else if (e.key === 'Escape') {
        if (showShortcuts) setShowShortcuts(false);
        else if (focusedTask) setFocusedTask(null);
        else if (detailTask) setDetailTask(null);
        else if (isAddingColumn) setIsAddingColumn(false);
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setIsAddingColumn(true);
      } else if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        // The CommandPalette component usually handles this, but we'll ensure it's triggered
        const searchBtn = document.querySelector('[data-command-palette-trigger]');
        if (searchBtn) searchBtn.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showShortcuts, focusedTask, detailTask, isAddingColumn]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const addTask = (column, title) => {
    if (!activeBoardId) return;
    const newTask = {
      id: Date.now().toString(),
      title,
      column,
      boardId: activeBoardId,
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    }).then(() => toast.success("Task created"));
  };

  const updateTask = (taskId, updates) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
    if (detailTask && detailTask.id === taskId) {
      setDetailTask(prev => ({ ...prev, ...updates }));
    }
    fetch(`/api/tasks/${taskId}`, { method: 'PUT', body: JSON.stringify(updates) });
  };

  const addColumn = (e) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;
    const trimmed = newColumnTitle.trim();
    if (!columns.includes(trimmed)) {
      const newColumns = [...columns, trimmed];
      setColumns(newColumns);
      fetch('/api/board', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardId: activeBoardId, columns: newColumns, labels: boardLabels })
      }).then(() => toast.success(`Column "${trimmed}" created`));
    }
    setNewColumnTitle("");
    setIsAddingColumn(false);
  };

  const deleteColumn = (colTitle) => {
    const newColumns = columns.filter(c => c !== colTitle);
    setColumns(newColumns);
    setTasks(tasks.filter(t => t.column !== colTitle));
    fetch('/api/board', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boardId: activeBoardId, columns: newColumns, labels: boardLabels })
    }).then(() => toast.success(`Column "${colTitle}" deleted`));
  };

  const createWorkspace = async (e) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;
    try {
      const res = await fetch('/api/board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newWorkspaceName.trim() }),
        cache: 'no-store'
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        // If there's a duplicate key error, run migration first then retry
        if (data.error?.includes('E11000') || data.error?.includes('duplicate key')) {
          toast.loading('Fixing database index...', { id: 'migrate' });
          await fetch('/api/migrate');
          toast.dismiss('migrate');
          // Retry workspace creation
          const res2 = await fetch('/api/board', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newWorkspaceName.trim() }),
            cache: 'no-store'
          });
          const data2 = await res2.json();
          if (data2.board) {
            setBoards(prev => [...prev, data2.board]);
            toast.success(`Workspace "${data2.board.title}" created!`);
            setNewWorkspaceName("");
            setIsCreatingWorkspace(false);
            switchWorkspace(data2.board._id);
          } else {
            toast.error(data2.error || "Failed to create workspace after migration");
          }
          return;
        }
        toast.error(data.error || "Failed to create workspace");
        return;
      }
      if (data.board) {
        setBoards(prev => [...prev, data.board]);
        toast.success(`Workspace "${data.board.title}" created!`);
        setNewWorkspaceName("");
        setIsCreatingWorkspace(false);
        switchWorkspace(data.board._id);
      }
    } catch (err) {
      toast.error("Failed to create workspace");
    }
  };

  const switchWorkspace = (boardId) => {
    setShowWorkspacePicker(false);
    loadBoard(boardId);
  };

  const deleteWorkspace = async (boardId) => {
    if (!window.confirm("Delete this workspace and all its tasks? This cannot be undone.")) return;
    try {
      const res = await fetch('/api/board', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardId })
      });
      const data = await res.json();
      if (data.error) { toast.error(data.error); return; }
      toast.success("Workspace deleted");
      // Switch to first remaining board
      const remaining = boards.filter(b => b._id !== boardId);
      setBoards(remaining);
      if (remaining.length > 0) switchWorkspace(remaining[0]._id);
    } catch (err) {
      toast.error("Failed to delete workspace");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    const newMember = { email: inviteEmail.trim(), role: 'member', lastActive: new Date() };
    const newMembers = [...(activeBoard.members || []), newMember];
    try {
      const res = await fetch('/api/board', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardId: activeBoardId, members: newMembers })
      });
      const data = await res.json();
      if (data.board) {
        setActiveBoard(data.board);
        setInviteEmail("");
        toast.success(`Member added!`);
      }
    } catch (err) {
      toast.error("Failed to add member");
    }
  };

  const removeMember = async (email) => {
    const newMembers = activeBoard.members.filter(m => (typeof m === 'string' ? m : m.email) !== email);
    try {
      const res = await fetch('/api/board', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardId: activeBoardId, members: newMembers })
      });
      const data = await res.json();
      if (data.board) {
        setActiveBoard(data.board);
        toast.success("Member removed");
      }
    } catch (err) {
      toast.error("Failed to remove member");
    }
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveTask) return;

    if (isOverTask) {
      setTasks(prev => {
        const activeIndex = prev.findIndex(t => t.id === activeId);
        const overIndex = prev.findIndex(t => t.id === overId);

        if (prev[activeIndex].column !== prev[overIndex].column) {
          const newTasks = [...prev];
          newTasks[activeIndex] = { ...newTasks[activeIndex], column: prev[overIndex].column };
          fetch(`/api/tasks/${activeId}`, { method: 'PUT', body: JSON.stringify({ column: prev[overIndex].column }) });
          return arrayMove(newTasks, activeIndex, overIndex);
        }
        return arrayMove(prev, activeIndex, overIndex);
      });
    }

    if (isOverColumn) {
      setTasks(prev => {
        const activeIndex = prev.findIndex(t => t.id === activeId);
        if (prev[activeIndex].column !== overId) {
          const newTasks = [...prev];
          newTasks[activeIndex] = { ...newTasks[activeIndex], column: overId };
          fetch(`/api/tasks/${activeId}`, { method: 'PUT', body: JSON.stringify({ column: overId }) });
          return newTasks;
        }
        return prev;
      });
    }
  };

  const handleDragEnd = () => {
    setActiveTask(null);
  };

  const updateTaskDate = async (taskId, newDate) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, dueDate: newDate } : t));
    try {
      await fetch(`/api/tasks/${taskId}`, { method: 'PUT', body: JSON.stringify({ dueDate: newDate }) });
      toast.success("Date updated");
    } catch (e) {
      toast.error("Failed to update date");
    }
  };

  const markComplete = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && columns.includes("Done")) {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, column: "Done" } : t));
      fetch(`/api/tasks/${taskId}`, { method: 'PUT', body: JSON.stringify({ column: "Done" }) });
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    if (detailTask && detailTask.id === taskId) {
      setDetailTask(null);
    }
    fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
      .then(() => toast.success("Task deleted"));
  };

  if (!isLoaded) return <BoardSkeleton />;

  if (user && user.permissions && user.permissions.canAccessBoard === false) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
          <Shield size={40} />
        </div>
        <h1 className="text-3xl font-black mb-3">Access Restricted</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          You do not have permission to access the Kanban Board. Please contact your administrator if you believe this is a mistake.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl border border-border/50 hover:bg-muted/50 transition-all font-semibold text-foreground w-full sm:w-auto"
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
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-semibold shadow-lg shadow-primary/20 w-full sm:w-auto"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* HEADER */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-30 px-4 sm:px-8 py-3 sm:py-5 flex items-center justify-between gap-3 sm:gap-6">
        <div className="flex items-center gap-3 relative">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <KanbanSquare size={20} />
          </div>
          {/* Workspace Switcher */}
          <button
            onClick={() => setShowWorkspacePicker(v => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors group"
          >
            <span className="text-lg font-semibold tracking-tight">
              {activeBoard?.title || 'Workspace'}
            </span>
            <ChevronDown size={16} className={cn("text-muted-foreground transition-transform", showWorkspacePicker && "rotate-180")} />
          </button>

          {/* Member Avatars + Invite */}
          <div className="hidden lg:flex items-center -space-x-2 ml-2">
            {[activeBoard?.userId, ...(activeBoard?.members || [])].slice(0, 4).map((m, i) => {
              const isOwner = i === 0;
              const email = isOwner ? (user?.email || 'Owner') : (typeof m === 'string' ? m : m.email);
              const isActive = !isOwner && m.lastActive && (new Date() - new Date(m.lastActive) < 1000 * 60 * 5);

              return (
                <div
                  key={i}
                  className={cn(
                    "w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white shadow-sm relative transition-transform hover:scale-110",
                    getAvatarColor(email)
                  )}
                  title={isOwner ? "Owner" : email}
                >
                  {email?.charAt(0).toUpperCase()}
                  {isActive && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border border-background rounded-full" />
                  )}
                </div>
              );
            })}
            {(activeBoard?.members?.length > 3) && (
              <div className="w-7 h-7 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground shadow-sm">
                +{activeBoard.members.length - 3}
              </div>
            )}
            <button
              onClick={() => setShowMembersModal(true)}
              className="w-7 h-7 rounded-full border-2 border-background bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground transition-colors ml-1"
              title="Manage Members"
            >
              <UserPlus size={12} />
            </button>
          </div>

          {/* Workspace Dropdown */}
          <AnimatePresence>
            {showWorkspacePicker && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-2 w-72 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 py-1.5">Workspaces</p>
                  {boards.map(board => (
                    <div
                      key={board._id}
                      className={cn(
                        "flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg cursor-pointer group transition-colors",
                        board._id === activeBoardId ? "bg-primary/10 text-primary" : "hover:bg-muted"
                      )}
                    >
                      <button
                        onClick={() => switchWorkspace(board._id)}
                        className="flex items-center gap-2.5 flex-1 text-left"
                      >
                        <FolderKanban size={15} />
                        <span className="text-sm font-medium truncate">{board.title || 'Default Workspace'}</span>
                        {board._id === activeBoardId && <span className="text-[10px] font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded-full ml-auto">Active</span>}
                      </button>
                      {board._id !== activeBoardId && (
                        <button
                          onClick={() => deleteWorkspace(board._id)}
                          className="p-1 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive rounded transition-all"
                          title="Delete workspace"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="border-t border-border p-2">
                  {isCreatingWorkspace ? (
                    <form onSubmit={createWorkspace} className="flex gap-2 px-1">
                      <input
                        autoFocus
                        type="text"
                        placeholder="Workspace name..."
                        value={newWorkspaceName}
                        onChange={e => setNewWorkspaceName(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 text-sm rounded-lg border border-border bg-background focus:ring-1 focus:ring-primary outline-none"
                      />
                      <button type="submit" disabled={!newWorkspaceName.trim()} className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg disabled:opacity-50">Create</button>
                      <button type="button" onClick={() => setIsCreatingWorkspace(false)} className="px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted rounded-lg">✕</button>
                    </form>
                  ) : (
                    <button
                      onClick={() => setIsCreatingWorkspace(true)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                      <Plus size={15} /> New workspace
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>


        {/* Mobile-only user avatar */}
        {user && (
          <div className="flex md:hidden items-center gap-2">
            <button onClick={() => {
              document.documentElement.classList.toggle('dark');
              localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
            }} className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-all">
              <Moon size={18} className="hidden dark:block" />
              <Sun size={18} className="block dark:hidden" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(v => !v)}
              className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-all"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        )}

        {/* Desktop right controls */}
        <div className="hidden md:flex gap-1.5 items-center">
          <button
            onClick={() => router.push('/tasks')}
            className="group relative flex items-center gap-2 px-2.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 transition-all text-sm font-bold shadow-lg shadow-indigo-500/5 hover:shadow-indigo-500/10 mr-1 whitespace-nowrap overflow-hidden shrink-0"
            title="Switch to Regular Tasks"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CheckSquare size={16} className="relative z-10 group-hover:scale-110 group-hover:rotate-3 transition-transform text-indigo-500" />
            <span className="relative z-10 hidden lg:block">My Tasks</span>
          </button>

          {(!user || user.permissions?.canUseAI !== false) && (
            <>
              <button
                onClick={fetchAiAnalysis}
                disabled={isAnalyzing}
                className={cn(
                  "group relative flex items-center gap-2 px-2.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/20 hover:border-purple-500/40 transition-all text-sm font-bold shadow-lg shadow-purple-500/5 hover:shadow-purple-500/10 mr-1 whitespace-nowrap overflow-hidden shrink-0",
                  isAnalyzing && "animate-pulse opacity-80"
                )}
                title="AI Priority & Risk Analysis"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {isAnalyzing ? (
                  <Activity size={16} className="relative z-10 animate-spin" />
                ) : (
                  <Brain size={16} className="relative z-10 group-hover:scale-110 transition-transform text-purple-500" />
                )}
                <span className="relative z-10 hidden lg:block">AI Insights</span>
              </button>

              <button
                onClick={fetchReflectionReport}
                disabled={isReflecting}
                className={cn(
                  "group relative flex items-center gap-2 px-2.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40 transition-all text-sm font-bold shadow-lg shadow-emerald-500/5 hover:shadow-emerald-500/10 mr-1 whitespace-nowrap overflow-hidden shrink-0",
                  isReflecting && "animate-pulse opacity-80"
                )}
                title="What Did I Actually Do?"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {isReflecting ? (
                  <RefreshCw size={16} className="relative z-10 animate-spin" />
                ) : (
                  <Trophy size={16} className="relative z-10 group-hover:scale-110 transition-transform text-emerald-500" />
                )}
                <span className="relative z-10 hidden lg:block">Reflection</span>
              </button>
            </>
          )}

          <div className="relative flex items-center">
            <button
              onClick={() => setShowBgSelector(!showBgSelector)}
              className={cn("p-2 rounded-lg transition-all", showBgSelector ? "bg-muted text-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground")}
              title="Change Background"
            >
              <Image size={18} />
            </button>
            {showBgSelector && (
              <div className="absolute top-12 right-0 w-72 bg-card border border-border shadow-2xl rounded-2xl p-4 z-50 overflow-hidden">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                  <Image size={12} /> Board Background
                </h4>
                <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                  {BOARD_BACKGROUNDS.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        fetch('/api/board', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ boardId: activeBoardId, background: bg.url })
                        }).then(res => res.json()).then(data => {
                          if (data.board) {
                            setBoards(prev => prev.map(b => b._id === activeBoardId ? data.board : b));
                            setActiveBoard(data.board);
                            toast.success(`Background updated to ${bg.name}`);
                          }
                        });
                        setShowBgSelector(false);
                      }}
                      className={cn(
                        "group relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
                        activeBoard?.background === bg.url ? "border-primary shadow-md" : "border-transparent hover:border-primary/50"
                      )}
                    >
                      {bg.url ? (
                        <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground font-bold">Default</div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                        <span className="text-[8px] text-white font-bold truncate">{bg.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button onClick={() => setShowChat(true)} className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-all relative" title="Workspace Chat">
            <MessageSquare size={18} />
            {(activeBoard?.chat?.length > 0) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-pulse" />
            )}
          </button>
          <button
            onClick={() => {
              if (showTimeTravel) {
                handleTimelineChange(-1);
                setShowTimeTravel(false);
              } else {
                setShowTimeTravel(true);
              }
            }}
            className={cn("p-2 rounded-lg transition-all", showTimeTravel || timelineIndex !== -1 ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground")}
            title="Visual Time-Travel"
          >
            <History size={18} />
          </button>

          <div className="h-4 w-[1px] bg-border/50 mx-1 hidden lg:block" />

          <button onClick={() => {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
          }} className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-all" title="Toggle Theme">
            <Moon size={18} className="hidden dark:block" />
            <Sun size={18} className="block dark:hidden" />
          </button>
          <button onClick={() => setShowShortcuts(true)} className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-all hidden lg:block" title="Keyboard Shortcuts">
            <Keyboard size={18} />
          </button>
          <button onClick={() => setShowFeedbackModal(true)} className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-all hidden lg:block" title="Send Feedback">
            <MessageCircleHeart size={18} />
          </button>
          {user?.role === 'admin' && (
            <button
              onClick={() => router.push('/admin')}
              className="p-2 hover:bg-indigo-500/10 text-indigo-500 rounded-lg transition-all"
              title="Admin Panel"
            >
              <Shield size={18} />
            </button>
          )}
          {user && (
            <div className="flex items-center gap-3 border-l border-border/50 pl-4 ml-2">
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button onClick={handleLogout} className="text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-500/10 px-2 py-1 rounded transition-colors">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MOBILE NAV DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-border/50 bg-background/95 backdrop-blur-xl z-20 overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-2">
              {/* View switcher */}
              <div className="grid grid-cols-4 gap-1 bg-muted/50 p-1 rounded-xl">
                {[{ id: 'board', icon: <KanbanSquare size={16} />, label: 'Board' }, { id: 'list', icon: <LayoutList size={16} />, label: 'List' }, { id: 'calendar', icon: <Calendar size={16} />, label: 'Cal' }, { id: 'dashboard', icon: <LineChart size={16} />, label: 'Stats' }].map(v => (
                  <button
                    key={v.id}
                    onClick={() => { setActiveView(v.id); setIsMobileMenuOpen(false); }}
                    className={cn("flex flex-col items-center gap-1 py-2 px-1 text-xs font-medium rounded-lg transition-all", activeView === v.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground")}
                  >
                    {v.icon}
                    {v.label}
                  </button>
                ))}
              </div>

              {/* My Tasks mobile link */}
              <button
                onClick={() => router.push('/tasks')}
                className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-500 border border-indigo-500/20 text-sm font-black mt-2 active:scale-95 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                    <CheckSquare size={18} className="text-indigo-400" />
                  </div>
                  My Regular Tasks
                </div>
                <ChevronRight size={16} className="text-indigo-500/50" />
              </button>

              {/* User + logout */}
              {user && (
                <div className="flex items-center justify-between px-1 pt-2 pb-1">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setShowShortcuts(true); setIsMobileMenuOpen(false); }} className="p-2 hover:bg-muted rounded-lg">
                      <Keyboard size={16} className="text-muted-foreground" />
                    </button>
                    <button onClick={handleLogout} className="text-xs font-medium text-red-500 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors border border-red-500/20">
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIEWS */}
      {activeView === "board" && (
        <div
          className="flex-1 overflow-x-auto overflow-y-hidden p-4 sm:p-8 relative bg-cover bg-center bg-no-repeat transition-all duration-500"
          style={{ backgroundImage: activeBoard?.background ? `url("${activeBoard.background}")` : 'none' }}
        >
          {/* Professional Overlay for readability */}
          {activeBoard?.background && <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] pointer-events-none" />}

          <div className="flex gap-4 sm:gap-6 h-full items-start relative z-10">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              {activeColumns.map(column => (
                <Column
                  key={column}
                  title={column}
                  tasks={activeTasks.filter(t => t.column === column)}
                  onFocus={setFocusedTask}
                  onOpen={setDetailTask}
                  onOpenAi={(task) => { setDetailTask(task); setAutoStartAi(true); }}
                  onDelete={deleteTask}
                  onAddTask={addTask}
                  onDeleteColumn={deleteColumn}
                  boardLabels={boardLabels}
                />
              ))}

              <DragOverlay dropAnimation={defaultDropAnimationSideEffects({ duration: 250 })}>
                {activeTask ? <TaskCard task={activeTask} isOverlay onFocus={() => { }} onOpen={() => { }} onDelete={() => { }} boardLabels={boardLabels} /> : null}
              </DragOverlay>
            </DndContext>

            {/* ADD COLUMN BUTTON */}
            <div className="flex-shrink-0 w-[calc(100vw-2.5rem)] sm:w-[300px] lg:w-[340px]">
              {isAddingColumn ? (
                <form onSubmit={addColumn} className="bg-muted/20 border border-border/50 p-4 rounded-2xl">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Board name..."
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-1 focus:ring-primary focus:outline-none mb-3"
                  />
                  <div className="flex gap-2">
                    <button type="submit" disabled={!newColumnTitle.trim()} className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50">
                      Add Board
                    </button>
                    <button type="button" onClick={() => setIsAddingColumn(false)} className="px-3 py-1.5 text-xs font-medium hover:bg-muted rounded-lg text-muted-foreground">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsAddingColumn(true)}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-border/40 text-muted-foreground hover:bg-muted/20 hover:text-foreground hover:border-border transition-all"
                >
                  <Plus size={18} /> Add new board
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {activeView === "list" && (
        <ListView tasks={activeTasks} columns={activeColumns} onSelectTask={setDetailTask} />
      )}

      {/* DASHBOARD VIEW */}
      {activeView === "dashboard" && (
        <DashboardView
          tasks={activeTasks}
          columns={activeColumns.map(c => ({ id: c, title: c }))}
        />
      )}

      {activeView === "calendar" && (
        <CalendarView
          tasks={activeTasks}
          onSelectTask={setDetailTask}
          onUpdateTaskDate={updateTaskDate}
        />
      )}

      <AnimatePresence>
        {focusedTask && (
          <ZenFocusMode
            task={focusedTask}
            onClose={() => setFocusedTask(null)}
            onComplete={markComplete}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {detailTask && (
          <TaskDetailModal
            task={detailTask}
            user={user}
            onClose={() => { setDetailTask(null); setAutoStartAi(false); }}
            onUpdateTask={updateTask}
            onAIChecklist={handleAIChecklist}
            onAddChecklist={(taskId) => {
              const task = tasks.find(t => t.id === taskId);
              if (task) {
                updateTask(taskId, {
                  checklists: [...(task.checklists || []), { id: Date.now().toString(), title: "New Checklist", items: [] }]
                });
              }
            }}
            initialShowAi={autoStartAi}
            boardLabels={boardLabels}
            setBoardLabels={(newLabels) => {
              setBoardLabels(newLabels);
              fetch('/api/board', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ boardId: activeBoardId, columns, labels: newLabels })
              });
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showShortcuts && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowShortcuts(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-card border border-border shadow-2xl rounded-3xl overflow-hidden"
            >
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h3 className="text-xl font-bold">Keyboard Shortcuts</h3>
                <button onClick={() => setShowShortcuts(false)} className="p-2 hover:bg-muted rounded-full">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest">Navigation</p>
                  <div className="space-y-3">
                    <ShortcutRow keys={["?"]} label="Show shortcuts" />
                    <ShortcutRow keys={["Esc"]} label="Close / Clear focus" />
                    <ShortcutRow keys={["Ctrl", "K"]} label="Command Palette" />
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest">Actions</p>
                  <div className="space-y-3">
                    <ShortcutRow keys={["C"]} label="Add new board" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFeedbackModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowFeedbackModal(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-3xl overflow-hidden"
            >
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Send Feedback</h3>
                  <p className="text-sm text-muted-foreground">Help us improve the app!</p>
                </div>
                <button onClick={() => setShowFeedbackModal(false)} className="p-2 hover:bg-muted rounded-full">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleFeedbackSubmit} className="p-6">
                <textarea
                  autoFocus
                  placeholder="What's on your mind? (bugs, feature requests, or general thoughts)"
                  value={feedbackMsg}
                  onChange={(e) => setFeedbackMsg(e.target.value)}
                  className="w-full h-32 p-3 text-sm rounded-xl border border-border bg-muted/30 focus:ring-2 focus:ring-primary/20 outline-none resize-none mb-4"
                  required
                />

                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">Feedback Category</label>
                  <select
                    value={feedbackType}
                    onChange={(e) => setFeedbackType(e.target.value)}
                    className="w-full p-3 text-sm rounded-xl border border-border bg-muted/30 focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer hover:bg-muted/50 appearance-none"
                  >
                    <option value="bug">Bug Report</option>
                    <option value="feedback">General Feedback</option>
                    <option value="improvement">Feature Improvement</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Attachments (Images/Videos/Docs)</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {feedbackAttachments.map(att => (
                      <div key={att.id} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-border bg-muted">
                        {att.type === 'image' ? (
                          <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Paperclip size={16} className="text-muted-foreground" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFeedbackAttachment(att.id)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <label className="w-16 h-16 rounded-lg border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center justify-center cursor-pointer text-muted-foreground">
                      <Plus size={20} />
                      <input type="file" className="hidden" onChange={handleFeedbackFileUpload} />
                    </label>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm font-medium mb-2">Rate your experience (optional)</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        className={cn(
                          "p-2 rounded-lg transition-all",
                          feedbackRating >= star ? "text-yellow-500 bg-yellow-500/10" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <Star size={24} className={feedbackRating >= star ? "fill-current" : ""} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowFeedbackModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted text-muted-foreground transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmittingFeedback || !feedbackMsg.trim()} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50">
                    {isSubmittingFeedback ? "Sending..." : "Send Feedback"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMembersModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowMembersModal(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-3xl overflow-hidden"
            >
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">Workspace Members</h3>
                  <p className="text-sm text-muted-foreground">Collaborate with your team</p>
                </div>
                <button onClick={() => setShowMembersModal(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleAddMember} className="flex gap-2 mb-6">
                  <input
                    type="email"
                    placeholder="Enter email address..."
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="flex-1 bg-muted/50 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  />
                  <button type="submit" className="bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all flex items-center gap-2">
                    <UserPlus size={16} /> Add
                  </button>
                </form>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-2xl border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{user?.name} (You)</p>
                        <p className="text-xs text-muted-foreground">Owner</p>
                      </div>
                    </div>
                  </div>

                  {activeBoard?.members?.map((member) => {
                    const memberEmail = typeof member === 'string' ? member : member.email;
                    const role = typeof member === 'string' ? 'Member' : (member.role || 'Member');
                    const isActive = member.lastActive && (new Date() - new Date(member.lastActive) < 1000 * 60 * 5); // Online if active in last 5 mins

                    return (
                      <div key={memberEmail} className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-2xl border border-transparent hover:border-border/50 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-white font-bold shadow-sm", getAvatarColor(memberEmail))}>
                              {memberEmail.charAt(0).toUpperCase()}
                            </div>
                            {isActive && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-card rounded-full" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium truncate max-w-[150px]">{memberEmail}</p>
                            <p className="text-xs text-muted-foreground capitalize">{role}</p>
                          </div>
                        </div>
                        {user?.id === activeBoard?.userId && (
                          <button
                            onClick={() => removeMember(memberEmail)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {showTimeTravel && (
        <TimeTravelSlider
          snapshots={activeBoard?.snapshots || []}
          onTimelineChange={handleTimelineChange}
          currentSnapshotIndex={timelineIndex}
          onClose={() => handleTimelineChange(-1)}
        />
      )}

      <GlobalChat
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        messages={activeBoard?.chat || []}
        onSendMessage={handleSendMessage}
        currentUser={user?.email}
      />

      <CommandPalette
        tasks={tasks}
        onSelectTask={(task) => setDetailTask(task)}
        onAddBoard={() => setIsAddingColumn(true)}
      />

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
              className="relative w-full max-w-4xl bg-card border border-border shadow-2xl rounded-[32px] overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-8 border-b border-border/50 flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Brain className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">AI Board Insights</h2>
                    <p className="text-xs text-purple-500 font-bold uppercase tracking-[0.2em] mt-1">Workspace Risk & Priority Audit</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAiCoach(false)}
                  className="p-3 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
                {/* SUMMARY */}
                <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-6 flex gap-4">
                  <Lightbulb className="text-purple-500 shrink-0" size={24} />
                  <div>
                    <p className="text-sm font-bold text-purple-600 uppercase tracking-widest mb-1">AI Recommendation</p>
                    <p className="text-muted-foreground leading-relaxed italic">"{aiAnalysis.summary}"</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* PRIORITIES */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <Zap className="text-amber-500" size={20} />
                      <h3 className="text-lg font-bold">Priority Suggestions</h3>
                    </div>
                    <div className="space-y-3">
                      {Object.entries(aiAnalysis.priorities).map(([id, data]) => {
                        const task = activeTasks.find(t => t._id === id || t.id === id);
                        if (!task) return null;
                        return (
                          <div key={id} className="bg-muted/30 border border-border/50 rounded-xl p-4 group hover:bg-muted/50 transition-all">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-black truncate max-w-[150px]">{task.title}</span>
                              <span className={cn(
                                "text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest",
                                data.category === "Do First" ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" :
                                  data.category === "Can Wait" ? "bg-blue-500/20 text-blue-600 dark:text-blue-400" :
                                    data.category === "Delegate" ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" : "bg-slate-500/20 text-slate-600 dark:text-slate-400"
                              )}>
                                {data.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-normal">{data.reasoning}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* RISKS */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <Shield className="text-rose-500" size={20} />
                      <h3 className="text-lg font-bold">Risk Predictions</h3>
                    </div>
                    <div className="space-y-3">
                      {Object.entries(aiAnalysis.risks).map(([id, data]) => {
                        const task = activeTasks.find(t => t._id === id || t.id === id);
                        if (!task) return null;
                        return (
                          <div key={id} className="bg-muted/30 border border-border/50 rounded-xl p-4 border-l-4 border-l-rose-500/50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-black truncate max-w-[150px]">{task.title}</span>
                              <span className={cn(
                                "flex items-center gap-1 text-[9px] font-black uppercase tracking-widest",
                                data.riskLevel === "high" ? "text-rose-500" : "text-amber-500"
                              )}>
                                <AlertTriangle size={10} /> {data.riskLevel} Risk
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground mb-2 font-medium">{data.prediction}</p>
                            <div className="bg-background/40 rounded-lg p-2 text-[10px] text-purple-600 dark:text-purple-400 font-mono italic">
                              💡 {data.suggestedAction}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-border/50 bg-muted/10">
                <button
                  onClick={() => setShowAiCoach(false)}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all"
                >
                  Dismiss Insights
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReflectionModal && (
          <ReflectionModal
            isOpen={showReflectionModal}
            onClose={() => setShowReflectionModal(false)}
            report={reflectionReport}
            isLoading={isReflecting}
          />
        )}
      </AnimatePresence>

      {/* FLOATING BOTTOM DOCK (VIEW SWITCHER) */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.5 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-2 py-2 bg-white/10 dark:bg-black/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-1"
      >
        {[
          { id: 'board', label: 'Board', icon: KanbanSquare },
          { id: 'list', label: 'List', icon: LayoutList },
          { id: 'calendar', label: 'Calendar', icon: Calendar },
          { id: 'dashboard', label: 'Dashboard', icon: LineChart },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-black transition-all group",
                isActive ? "text-white" : "text-white/50 hover:text-white/80"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="dock-active-pill"
                  className="absolute inset-0 bg-gradient-to-r from-primary to-indigo-600 rounded-full shadow-lg shadow-primary/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon size={18} className={cn("relative z-10 transition-transform", isActive && "scale-110")} />
              <span className="relative z-10 hidden sm:block">{item.label}</span>

              {/* Tooltip for mobile */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-3 py-1 bg-black text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none sm:hidden">
                {item.label}
              </div>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}
