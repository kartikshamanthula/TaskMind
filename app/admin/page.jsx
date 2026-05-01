"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, Layout, CheckSquare, TrendingUp, 
  Search, Shield, Trash2, ArrowLeft,
  Activity, Calendar, Mail, User as UserIcon,
  CheckCircle2, XCircle, Clock, Timer, Paperclip, Info,
  BarChart3, ShieldCheck, Zap, Globe, LogOut, MessageSquare, Star, Eye, EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminPanel() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null); // { url, name }
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchFeedbacks();
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          if (data.user.role !== 'admin') {
            router.push('/');
          }
        } else {
          router.push('/login');
        }
      });
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (!data.error) setStats(data.stats);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
        setLoading(false);
        return;
      }
      setUsers(data.users);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch('/api/admin/feedback');
      const data = await res.json();
      if (!data.error) setFeedbacks(data.feedbacks);
    } catch (err) { console.error(err); }
  };

  const toggleFeedbackRead = async (id, currentStatus) => {
    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedbackId: id, read: !currentStatus })
      });
      if (res.ok) {
        toast.success(currentStatus ? "Marked as unread" : "Marked as read");
        fetchFeedbacks();
        if (selectedFeedback && selectedFeedback._id === id) {
          setSelectedFeedback(prev => ({ ...prev, read: !currentStatus }));
        }
      }
    } catch (err) { toast.error("Update failed"); }
  };

  const deleteFeedback = async (id) => {
    try {
      const res = await fetch(`/api/admin/feedback?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Feedback deleted");
        fetchFeedbacks();
      }
    } catch (err) { toast.error("Failed to delete"); }
  };

  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this user? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('User deleted permanently');
        fetchUsers();
        if (selectedUser && selectedUser._id === id) setSelectedUser(null);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete user');
      }
    } catch (err) { toast.error('Failed to delete user'); }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      toast.error("Failed to logout");
    }
  };

  const updateUserStatus = async (userId, status) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`User marked as ${status}`);
        fetchUsers();
      }
    } catch (err) { toast.error("Action failed"); }
  };

  const updateUserPermissions = async (userId, newPermissions) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, permissions: newPermissions })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Permissions updated");
        fetchUsers();
        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser(data.user);
        }
      }
    } catch (err) { toast.error("Failed to update permissions"); }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020203] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-t-4 border-indigo-500 rounded-full"
          />
          <p className="text-indigo-400 font-mono tracking-widest text-sm animate-pulse">ESTABLISHING SECURE CONNECTION...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* GLOW EFFECTS */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* SIDEBAR */}
      <div className="fixed left-0 top-0 bottom-0 w-72 border-r border-white/5 bg-black/40 backdrop-blur-3xl z-20 flex flex-col p-8">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/20 ring-1 ring-white/20">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-black text-xl leading-tight tracking-tight text-white">CORE ADMIN</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-bold">System Online</p>
            </div>
          </div>
        </div>

        <nav className="space-y-3 flex-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">Main Terminal</p>
          <NavItem 
            active={activeTab === "overview"} 
            onClick={() => setActiveTab("overview")} 
            icon={<TrendingUp size={20} />} 
            label="Overview" 
          />
          <NavItem 
            active={activeTab === "users"} 
            onClick={() => setActiveTab("users")} 
            icon={<Users size={20} />} 
            label="User Governance" 
            count={users.filter(u => u.status === 'pending').length}
          />
          <NavItem 
            active={activeTab === "security"} 
            onClick={() => setActiveTab("security")} 
            icon={<Shield size={20} />} 
            label="Security Audit" 
          />
          <NavItem 
            active={activeTab === "feedback"} 
            onClick={() => setActiveTab("feedback")} 
            icon={<MessageSquare size={20} />} 
            label="User Feedback" 
            count={feedbacks.filter(fb => !fb.read).length}
          />
        </nav>

        <div className="pt-8 border-t border-white/5 space-y-3">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-4 text-sm font-bold text-red-400 hover:text-white hover:bg-red-500/20 rounded-2xl transition-all border border-transparent hover:border-red-500/30"
          >
            <LogOut size={18} /> Terminate Session
          </button>
          <p className="text-[10px] text-slate-600 font-mono text-center">CORE OS v2.0.4</p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="ml-72 p-12 max-w-[1400px]">
        <header className="mb-12 flex items-end justify-between">
          <div>
            <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">Management Console</p>
            <h2 className="text-4xl font-black text-white tracking-tight capitalize">{activeTab}</h2>
          </div>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search registry..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm w-80 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all outline-none text-white placeholder:text-slate-600"
            />
          </div>
        </header>

        {activeTab === "overview" && stats && (
          <div className="space-y-10">
            {/* BIG STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard label="Active Citizens" value={stats.totalUsers} icon={<Users className="text-blue-400" />} trend="Operational" />
              <StatCard label="Pending Approval" value={users.filter(u => u.status === 'pending').length} icon={<Zap className="text-amber-400" />} trend="Priority" isAlert={users.filter(u => u.status === 'pending').length > 0} />
              <StatCard label="Total Workspaces" value={stats.totalBoards} icon={<Globe className="text-indigo-400" />} trend="Global" />
              <StatCard label="Current Traffic" value={users.filter(u => u.isOnline).length} icon={<Activity className="text-emerald-400" />} trend="Live Now" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* PENDING APPROVALS LIST */}
               <div className="lg:col-span-2 bg-white/5 border border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden backdrop-blur-md">
                <div className="p-8 border-b border-white/10 flex items-center justify-between">
                  <h3 className="font-bold text-lg flex items-center gap-3 text-amber-400"><Clock size={20} /> Access Requests</h3>
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest">{users.filter(u => u.status === 'pending').length} New</span>
                </div>
                <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto">
                  {users.filter(u => u.status === 'pending').map(u => (
                    <div key={u._id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 text-xl font-black border border-amber-500/20">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-base font-bold text-white">{u.name}</p>
                          <p className="text-xs text-slate-500 font-mono">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => updateUserStatus(u._id, 'active')} className="px-5 py-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl hover:bg-emerald-500 text-sm font-bold hover:text-white transition-all">Approve Access</button>
                        <button onClick={() => updateUserStatus(u._id, 'blocked')} className="px-5 py-2.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500 text-sm font-bold hover:text-white transition-all">Deny</button>
                      </div>
                    </div>
                  ))}
                  {users.filter(u => u.status === 'pending').length === 0 && (
                    <div className="p-20 text-center">
                      <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4 text-slate-600">
                        <CheckCircle2 size={32} />
                      </div>
                      <p className="text-slate-500 font-medium">All access requests cleared.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* SYSTEM HEALTH */}
              <div className="bg-gradient-to-b from-indigo-600/20 to-purple-600/20 border border-white/10 shadow-2xl rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center">
                 <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center text-white mb-6 border border-white/20 shadow-inner">
                  <Activity size={40} className="text-indigo-400" />
                </div>
                <h3 className="font-black text-2xl text-white mb-4 italic">SYSTEM CORE</h3>
                <div className="space-y-4 w-full">
                  <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                      <span>Database Density</span>
                      <span className="text-indigo-400">{Math.min(100, Math.round(((stats.totalTasks + stats.totalBoards) / 500) * 100))}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, ((stats.totalTasks + stats.totalBoards) / 500) * 100)}%` }} className="h-full bg-indigo-500" />
                    </div>
                  </div>
                  <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                      <span>Platform Engagement</span>
                      <span className="text-purple-400">{Math.round(users.reduce((acc, u) => acc + (u.totalUsageMinutes || 0), 0))}m</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (users.reduce((acc, u) => acc + (u.totalUsageMinutes || 0), 0) / 1000) * 100)}%` }} className="h-full bg-purple-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
           <div className="bg-white/5 border border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden backdrop-blur-md">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                   <th className="px-8 py-6">Identity / Activity</th>
                   <th className="px-8 py-6">Permission Level</th>
                   <th className="px-8 py-6">Engagement</th>
                   <th className="px-8 py-6">Registry Timestamp</th>
                   <th className="px-8 py-6 text-right">Protocol</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {filteredUsers.map(u => (
                   <tr key={u._id} className="hover:bg-white/5 transition-all group">
                     <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                         <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-sm font-black border border-white/10 group-hover:border-indigo-500/50 transition-colors">
                              {u.name.charAt(0)}
                            </div>
                            {u.isOnline && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-[#050508] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            )}
                         </div>
                         <div>
                           <p className="text-base font-bold text-white">
                             {u.name} 
                             {user?.email === u.email && (
                               <span className="ml-2 text-[10px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded font-black tracking-widest uppercase">You</span>
                             )}
                           </p>
                           <p className="text-xs text-slate-500 font-mono">{u.email}</p>
                         </div>
                       </div>
                     </td>
                     <td className="px-8 py-6">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                          u.status === 'active' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                          u.status === 'pending' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : 
                          "bg-red-500/10 text-red-400 border-red-500/20"
                        )}>
                          {u.status}
                        </span>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-slate-600" />
                          <span className="text-sm font-mono text-indigo-400">{Math.round(u.totalUsageMinutes || 0)}m</span>
                        </div>
                     </td>
                     <td className="px-8 py-6 text-xs text-slate-500 font-mono">
                       {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'System Default'}
                     </td>
                     <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                           {u.status === 'pending' && (
                              <button onClick={() => updateUserStatus(u._id, 'active')} className="flex items-center gap-1.5 px-3 py-2 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl border border-emerald-500/20 transition-all text-[10px] font-bold uppercase tracking-widest"><CheckCircle2 size={14} /> Approve</button>
                           )}
                           <button onClick={() => setSelectedUser(u)} className="flex items-center gap-1.5 px-3 py-2 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl border border-indigo-500/20 transition-all text-[10px] font-bold uppercase tracking-widest"><Info size={14} /> Details</button>
                           {user?.email !== u.email && (
                             <button onClick={() => updateUserStatus(u._id, u.status === 'blocked' ? 'active' : 'blocked')} className="flex items-center gap-1.5 px-3 py-2 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-xl border border-red-500/20 transition-all text-[10px] font-bold uppercase tracking-widest">
                               {u.status === 'blocked' ? <><CheckCircle2 size={14} /> Unblock</> : <><Trash2 size={14} /> Block</>}
                             </button>
                           )}
                           {user?.email !== u.email && (
                             <button onClick={() => deleteUser(u._id)} className="flex items-center gap-1.5 px-3 py-2 text-red-400 bg-red-900/20 hover:bg-red-600 hover:text-white rounded-xl border border-red-800/30 transition-all text-[10px] font-bold uppercase tracking-widest"><Trash2 size={14} /> Delete</button>
                           )}
                        </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        )}

        {activeTab === "security" && (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-md">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                    <ShieldCheck size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Auth Protocol</h3>
                    <p className="text-slate-500 text-sm">Active Identity Protection</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <SecurityFeature 
                    title="Bcrypt Password Hashing" 
                    desc="All user credentials are encrypted using one-way cryptographic salt-hashing." 
                    status="Operational" 
                  />
                  <SecurityFeature 
                    title="JWT Session Security" 
                    desc="Authenticated sessions are managed via signed JSON Web Tokens with 7-day expiration." 
                    status="Active" 
                  />
                  <SecurityFeature 
                    title="Admin Approval Gate" 
                    desc="Mandatory manual verification for all new accounts. Zero automatic entry." 
                    status="Enforced" 
                    highlight 
                  />
                </div>
             </div>

             <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-md">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                    <Zap size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">API Integrity</h3>
                    <p className="text-slate-500 text-sm">Data Sanitization & Shielding</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <SecurityFeature 
                    title="Zero-Trust Architecture" 
                    desc="Every API request is validated server-side against workspace permissions." 
                    status="Operational" 
                  />
                  <SecurityFeature 
                    title="Input Sanitization" 
                    desc="Task content and chat messages are filtered to prevent injection attacks." 
                    status="Active" 
                  />
                  <SecurityFeature 
                    title="Role-Based Controls" 
                    desc="Administrative endpoints are hard-locked to Super Admin accounts." 
                    status="Active" 
                  />
                </div>
             </div>
           </div>
        )}

        {activeTab === "feedback" && (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden backdrop-blur-md p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                  <MessageSquare size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">User Feedback</h3>
                  <p className="text-slate-500 text-sm">Direct input from your citizens</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {feedbacks.length === 0 ? (
                  <div className="col-span-full py-20 text-center text-slate-500 font-medium">No feedback received yet.</div>
                ) : (
                  feedbacks.map(fb => (
                    <div 
                      key={fb._id} 
                      onClick={() => setSelectedFeedback(fb)}
                      className={cn(
                        "border rounded-2xl p-6 flex flex-col relative group transition-all cursor-pointer shadow-lg",
                        fb.read 
                          ? "bg-black/20 border-white/5 hover:bg-black/40 hover:border-white/10" 
                          : "bg-indigo-950/20 border-indigo-500/20 hover:border-indigo-500/40 hover:bg-indigo-950/30 shadow-indigo-500/5"
                      )}
                    >
                      {/* Unread glow bar */}
                      {!fb.read && (
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500 to-indigo-500/0 rounded-t-2xl" />
                      )}

                      {/* Action buttons — top right */}
                      <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFeedbackRead(fb._id, fb.read); }}
                          className={cn(
                            "p-2 rounded-xl transition-all border",
                            fb.read
                              ? "bg-white/5 text-slate-500 border-white/5 hover:bg-white/10 hover:text-slate-300"
                              : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20"
                          )}
                          title={fb.read ? 'Mark as Unread' : 'Mark as Read'}
                        >
                          {fb.read ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteFeedback(fb._id); }}
                          className="p-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                          title="Delete Feedback"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      {/* User info row */}
                      <div className="flex items-start gap-3 mb-4 pr-16">
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">
                            {fb.user?.name?.charAt(0) || '?'}
                          </div>
                          {!fb.read && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-indigo-500 border-2 border-[#050508] animate-pulse" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">{fb.user?.name || 'Unknown User'}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{new Date(fb.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {/* Category badge */}
                      {fb.type && (
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-[0.1em] px-2.5 py-1 rounded-lg border mb-3 w-fit",
                          fb.type === 'bug' ? "bg-red-500/15 text-red-400 border-red-500/25" : 
                          fb.type === 'improvement' ? "bg-blue-500/15 text-blue-400 border-blue-500/25" : 
                          "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                        )}>
                          {fb.type === 'bug' ? '🐛 Bug Report' : fb.type === 'improvement' ? '✨ Feature Improvement' : '💬 General Feedback'}
                        </span>
                      )}

                      {/* Star rating */}
                      {fb.rating && (
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} className={i < fb.rating ? "text-amber-400 fill-amber-400" : "text-slate-800"} />
                          ))}
                        </div>
                      )}
                      
                      {/* Message preview */}
                      <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-4 flex-1">{fb.message}</p>
                      
                      {/* Attachment badge */}
                      {fb.attachments && fb.attachments.length > 0 && (
                        <div className="mt-auto flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 bg-indigo-400/5 w-fit px-2.5 py-1 rounded-lg border border-indigo-400/10">
                          <Paperclip size={11} />
                          {fb.attachments.length} ATTACHMENT{fb.attachments.length > 1 ? 'S' : ''}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FEEDBACK DETAIL MODAL */}
      <AnimatePresence>
        {selectedFeedback && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedFeedback(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0a10] border border-white/10 shadow-[0_0_50px_-12px_rgba(79,70,229,0.5)] rounded-[3rem] overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-[2rem] bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-2xl font-black border border-indigo-500/30">
                    {selectedFeedback.user?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-black text-white tracking-tight">{selectedFeedback.user?.name || 'Unknown User'}</h3>
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border shadow-lg",
                        selectedFeedback.type === 'bug' ? "bg-red-500/20 text-red-400 border-red-500/30" : 
                        selectedFeedback.type === 'improvement' ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : 
                        "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      )}>
                        {selectedFeedback.type === 'bug' ? 'Bug Report' : selectedFeedback.type === 'improvement' ? 'Feature Improvement' : 'General Feedback'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 font-mono mt-1">{selectedFeedback.user?.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedFeedback(null)} 
                  className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/5"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="p-10 overflow-y-auto custom-scrollbar flex-1">
                <div className="flex items-center gap-6 mb-8 text-xs font-bold uppercase tracking-widest text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-indigo-400" />
                    {new Date(selectedFeedback.createdAt).toLocaleDateString(undefined, { dateStyle: 'full' })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-purple-400" />
                    {new Date(selectedFeedback.createdAt).toLocaleTimeString()}
                  </div>
                </div>

                {selectedFeedback.rating && (
                  <div className="flex items-center gap-1.5 mb-8 p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 w-fit">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest mr-2">Experience:</span>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} className={i < selectedFeedback.rating ? "text-amber-400 fill-amber-400" : "text-slate-800"} />
                    ))}
                  </div>
                )}

                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">{selectedFeedback.message}</p>
                </div>

                {selectedFeedback.attachments && selectedFeedback.attachments.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-white/5">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                      <Paperclip size={14} /> Evidence / Attachments ({selectedFeedback.attachments.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedFeedback.attachments.map(att => (
                        att.type === 'image' ? (
                          <button
                            key={att.id}
                            type="button"
                            onClick={() => setLightboxImage({ url: att.url, name: att.name })}
                            className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all aspect-video cursor-zoom-in"
                          >
                            <img src={att.url} alt={att.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl">View Full Size</span>
                            </div>
                          </button>
                        ) : (
                          <a 
                            key={att.id} 
                            href={att.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all aspect-video"
                          >
                            <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-slate-500 group-hover:text-indigo-400">
                              <Paperclip size={32} />
                              <span className="text-[10px] font-bold uppercase tracking-widest px-4 text-center">{att.name}</span>
                            </div>
                            <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl">Open File</span>
                            </div>
                          </a>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 bg-white/[0.02] border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => toggleFeedbackRead(selectedFeedback._id, selectedFeedback.read)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 border",
                    selectedFeedback.read
                      ? "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                      : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20"
                  )}
                >
                  {selectedFeedback.read ? <><EyeOff size={14} /> Mark Unread</> : <><Eye size={14} /> Mark as Read</>}
                </button>
                <button 
                  onClick={() => setSelectedFeedback(null)}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* IMAGE LIGHTBOX */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6"
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 shadow-2xl"
              title="Close"
            >
              <XCircle size={24} />
            </button>

            {/* Image name */}
            <div className="absolute top-6 left-6 z-10">
              <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">{lightboxImage.name}</p>
            </div>

            {/* Image */}
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              src={lightboxImage.url}
              alt={lightboxImage.name}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/10 cursor-default"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* USER DETAIL MODAL */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-[#0a0a10] border border-white/10 shadow-[0_0_50px_-12px_rgba(79,70,229,0.5)] rounded-[3rem] overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-8 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-[2rem] bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-2xl font-black border border-indigo-500/30">
                        {selectedUser.name.charAt(0)}
                      </div>
                      {selectedUser.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-[#0a0a10] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight">{selectedUser.name}</h3>
                      <p className="text-sm text-slate-500 font-mono">{selectedUser.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedUser(null)} 
                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/5"
                  >
                    <XCircle size={24} />
                  </button>
                </div>

                {/* Status & Role badges */}
                <div className="flex items-center gap-3 mt-5">
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border",
                    selectedUser.status === 'active' ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                    selectedUser.status === 'pending' ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                    "bg-red-500/20 text-red-400 border-red-500/30"
                  )}>
                    {selectedUser.status}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
                    {selectedUser.role}
                  </span>
                  {selectedUser.isOnline && (
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                    </span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="p-8 overflow-y-auto flex-1 space-y-6">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 mb-2">Registered</p>
                    <p className="text-sm font-bold text-white">{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A'}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleTimeString() : ''}</p>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 mb-2">Last Login</p>
                    <p className="text-sm font-bold text-white">{selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Never'}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleTimeString() : ''}</p>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 mb-2">Total Engagement</p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-2xl font-black text-indigo-400">{Math.round(selectedUser.totalUsageMinutes || 0)}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">minutes</p>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 mb-2">Gamification</p>
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-xl font-black text-amber-400">{selectedUser.level || 1}</p>
                        <p className="text-[8px] font-bold text-slate-600 uppercase">Level</p>
                      </div>
                      <div className="h-8 w-px bg-white/10" />
                      <div className="text-center">
                        <p className="text-xl font-black text-purple-400">{selectedUser.xp || 0}</p>
                        <p className="text-[8px] font-bold text-slate-600 uppercase">XP</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                {selectedUser.badges && selectedUser.badges.length > 0 && (
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 mb-3">Earned Badges</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.badges.map((badge, i) => (
                        <span key={i} className="text-[10px] font-bold px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">{badge}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Permissions Management */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 mb-4">Access Permissions</p>
                  
                  {['canUseAI', 'canAccessBoard', 'canAccessRegularTasks', 'canAccessFinancialFeature'].map((permKey) => {
                    const defaultPerms = { canUseAI: true, canAccessBoard: true, canAccessRegularTasks: true, canAccessFinancialFeature: true };
                    const currentPerms = selectedUser.permissions || defaultPerms;
                    const isEnabled = currentPerms[permKey] ?? defaultPerms[permKey];
                    
                    const permNames = {
                      canUseAI: "AI Coach & OCR",
                      canAccessBoard: "Kanban Board",
                      canAccessRegularTasks: "Regular Tasks",
                      canAccessFinancialFeature: "Financial Dashboard"
                    };

                    return (
                      <div key={permKey} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                        <span className="text-sm font-bold text-white">{permNames[permKey]}</span>
                        <button
                          onClick={() => {
                            const newPermissions = { ...currentPerms, [permKey]: !isEnabled };
                            updateUserPermissions(selectedUser._id, newPermissions);
                          }}
                          className={cn(
                            "w-12 h-6 rounded-full transition-all relative shadow-inner",
                            isEnabled ? "bg-emerald-500 shadow-emerald-500/20" : "bg-white/10"
                          )}
                        >
                          <div className={cn(
                            "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-md",
                            isEnabled ? "left-7" : "left-1"
                          )} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer actions */}
              <div className="p-8 bg-white/[0.02] border-t border-white/10 flex items-center justify-between">
                <div className="flex gap-2">
                  {selectedUser.status === 'pending' && (
                    <button
                      onClick={() => { updateUserStatus(selectedUser._id, 'active'); setSelectedUser(prev => ({ ...prev, status: 'active' })); }}
                      className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                    >
                      <CheckCircle2 size={14} /> Approve
                    </button>
                  )}
                  {user?.email !== selectedUser.email && (
                    <button
                      onClick={() => { 
                        const newStatus = selectedUser.status === 'blocked' ? 'active' : 'blocked';
                        updateUserStatus(selectedUser._id, newStatus); 
                        setSelectedUser(prev => ({ ...prev, status: newStatus })); 
                      }}
                      className={cn(
                        "flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 border",
                        selectedUser.status === 'blocked' 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                      )}
                    >
                      {selectedUser.status === 'blocked' ? <><CheckCircle2 size={14} /> Unblock</> : <><Trash2 size={14} /> Block</>}
                    </button>
                  )}
                  {user?.email !== selectedUser.email && (
                    <button
                      onClick={() => deleteUser(selectedUser._id)}
                      className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 bg-red-900/30 text-red-400 border border-red-800/30 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SecurityFeature({ title, desc, status, highlight }) {
  return (
    <div className={cn(
      "p-6 rounded-2xl border transition-all",
      highlight ? "bg-indigo-500/10 border-indigo-500/30 shadow-lg shadow-indigo-500/10" : "bg-black/20 border-white/5 hover:border-white/10"
    )}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-white tracking-tight">{title}</h4>
        <span className={cn(
          "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
          status === "Enforced" ? "bg-indigo-500 text-white" : "bg-emerald-500/20 text-emerald-400"
        )}>{status}</span>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function NavItem({ active, onClick, icon, label, count }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-5 py-4 rounded-[1.25rem] text-sm font-bold transition-all duration-300",
        active 
          ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 ring-1 ring-white/20 translate-x-2" 
          : "text-slate-400 hover:text-white hover:bg-white/5"
      )}
    >
      <div className="flex items-center gap-4">
        {icon} {label}
      </div>
      {count > 0 && (
        <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-black flex items-center justify-center animate-bounce shadow-lg shadow-amber-500/20 ring-2 ring-black">
          {count}
        </span>
      )}
    </button>
  );
}

function StatCard({ label, value, icon, trend, isAlert }) {
  return (
    <div className={cn(
      "bg-white/5 border border-white/10 shadow-xl rounded-[2rem] p-7 group transition-all backdrop-blur-sm relative overflow-hidden",
      isAlert && "ring-1 ring-amber-500/50 bg-amber-500/[0.02]"
    )}>
      {isAlert && <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 blur-[40px] rounded-full" />}
      <div className="flex items-center justify-between mb-5">
        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 border border-white/10">
          {icon}
        </div>
        <span className={cn(
          "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest",
          isAlert ? "bg-amber-500 text-black animate-pulse" : "bg-white/5 text-slate-500 border border-white/10"
        )}>{trend}</span>
      </div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
      <h4 className="text-4xl font-black text-white tracking-tighter">{value}</h4>
    </div>
  );
}
