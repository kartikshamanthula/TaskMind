"use client";

import { useMemo } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { isBefore, isThisWeek, startOfDay } from "date-fns";
import { CheckCircle2, Clock, AlertCircle, ListTodo } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function DashboardView({ tasks, columns }) {
  // 1. Tasks by Column Data (for Bar Chart)
  const columnData = useMemo(() => {
    return columns.map(col => ({
      name: col.title,
      tasks: tasks.filter(t => t.columnId === col.id).length
    }));
  }, [tasks, columns]);

  // 2. Overview Stats
  const stats = useMemo(() => {
    const today = startOfDay(new Date());
    
    // Find the "done" column (usually the last column, or named 'Done')
    const doneColId = columns.find(c => c.title.toLowerCase().includes('done'))?.id || columns[columns.length - 1]?.id;
    
    const completedTasks = tasks.filter(t => t.columnId === doneColId);
    const activeTasks = tasks.filter(t => t.columnId !== doneColId);
    
    const overdueTasks = activeTasks.filter(t => t.dueDate && isBefore(startOfDay(new Date(t.dueDate)), today));
    const dueThisWeekTasks = activeTasks.filter(t => t.dueDate && isThisWeek(new Date(t.dueDate)));

    return {
      total: tasks.length,
      completed: completedTasks.length,
      active: activeTasks.length,
      overdue: overdueTasks.length,
      dueThisWeek: dueThisWeekTasks.length,
      completionRate: tasks.length === 0 ? 0 : Math.round((completedTasks.length / tasks.length) * 100)
    };
  }, [tasks, columns]);

  // 3. Task Status for Pie Chart
  const pieData = useMemo(() => {
    return [
      { name: 'Completed', value: stats.completed, color: '#10b981' }, // Emerald
      { name: 'Active', value: stats.active - stats.overdue, color: '#3b82f6' }, // Blue
      { name: 'Overdue', value: stats.overdue, color: '#ef4444' }, // Red
    ].filter(d => d.value > 0);
  }, [stats]);

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto custom-scrollbar">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Workspace Analytics</h2>
        <p className="text-muted-foreground">Here is a high-level overview of your team's productivity and task distribution.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          icon={<ListTodo className="text-blue-500" />} 
          label="Total Tasks" 
          value={stats.total} 
        />
        <StatCard 
          icon={<CheckCircle2 className="text-emerald-500" />} 
          label="Completion Rate" 
          value={`${stats.completionRate}%`} 
          subValue={`${stats.completed} tasks done`}
        />
        <StatCard 
          icon={<Clock className="text-amber-500" />} 
          label="Due This Week" 
          value={stats.dueThisWeek} 
        />
        <StatCard 
          icon={<AlertCircle className="text-red-500" />} 
          label="Overdue Tasks" 
          value={stats.overdue} 
          className={stats.overdue > 0 ? "border-red-500/50 bg-red-500/5" : ""}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[400px]">
        {/* Bar Chart: Tasks by Status */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold mb-6">Task Distribution by Board</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={columnData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} dx={-10} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                  contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Bar dataKey="tasks" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Task Health */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold mb-6">Task Health</h3>
          <div className="flex-1 min-h-[300px]">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: "20px" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No tasks available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subValue, className }) {
  return (
    <div className={cn("bg-card border border-border rounded-xl p-5 shadow-sm flex items-start gap-4", className)}>
      <div className="p-3 bg-muted rounded-lg shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
        <h4 className="text-3xl font-bold">{value}</h4>
        {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
      </div>
    </div>
  );
}
