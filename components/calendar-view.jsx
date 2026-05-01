"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from "date-fns";
import { ChevronLeft, ChevronRight, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export function CalendarView({ tasks, onSelectTask, onUpdateTaskDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDraggingOver, setIsDraggingOver] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  
  // Create an array of days for the grid
  // To keep it simple, we just show exactly the days of the month, or pad with empty spaces
  // Let's get the day of the week for the 1st
  const startDayOfWeek = monthStart.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Padding days at the start of the month
  const paddingDays = Array.from({ length: startDayOfWeek }).map((_, i) => null);
  
  const allGridDays = [...paddingDays, ...daysInMonth];

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-8 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h2 className="text-2xl font-semibold flex items-center gap-3">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 border border-border rounded-md hover:bg-muted transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors">
            Today
          </button>
          <button onClick={nextMonth} className="p-2 border border-border rounded-md hover:bg-muted transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden shrink-0">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="bg-muted/30 py-3 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-px bg-border flex-1 overflow-y-auto mt-px rounded-b-xl border border-border/50">
        {allGridDays.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} className="bg-card min-h-[120px]" />;
          
          const isCurrentDay = isToday(day);
          
          // Format 'yyyy-MM-dd' for matching
          const dayString = format(day, "yyyy-MM-dd");
          // Tasks due on this day
          const dayTasks = tasks.filter(t => t.dueDate === dayString);

          return (
            <div 
              key={day.toISOString()} 
              onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(dayString); }}
              onDragLeave={() => setIsDraggingOver(null)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingOver(null);
                const taskId = e.dataTransfer.getData("text/plain");
                if (taskId && onUpdateTaskDate) {
                  onUpdateTaskDate(taskId, dayString);
                }
              }}
              className={cn(
                "bg-card min-h-[120px] p-2 transition-colors relative group border-2 border-transparent",
                isCurrentDay && "bg-primary/5",
                isDraggingOver === dayString ? "border-primary bg-primary/10 border-dashed" : "hover:bg-muted/10"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn(
                  "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                  isCurrentDay ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                )}>
                  {format(day, "d")}
                </span>
              </div>
              
              <div className="flex flex-col gap-1 overflow-y-auto max-h-[80px]">
                {dayTasks.map(task => (
                  <div 
                    key={task.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", task.id);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onClick={() => onSelectTask(task)}
                    className={cn(
                      "text-xs px-2 py-1 rounded truncate cursor-grab active:cursor-grabbing transition-colors border",
                      task.column === "Done" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                    )}
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
