"use client";

import { CheckCircle2, Clock, Calendar as CalendarIcon, Target } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function ListView({ tasks, columns, onSelectTask }) {
  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-8 overflow-y-auto">
      <div className="space-y-8">
        {columns.map(column => {
          const columnTasks = tasks.filter(t => t.column === column);
          if (columnTasks.length === 0) return null;

          return (
            <div key={column} className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="bg-muted/40 px-5 py-3 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  {column}
                  <span className="bg-background text-muted-foreground text-xs px-2 py-0.5 rounded-full border border-border">
                    {columnTasks.length}
                  </span>
                </h3>
              </div>
              <div className="divide-y divide-border">
                {columnTasks.map(task => (
                  <div 
                    key={task.id} 
                    onClick={() => onSelectTask(task)}
                    className="px-5 py-4 flex items-center gap-4 hover:bg-muted/50 cursor-pointer transition-colors group"
                  >
                    <div className="text-muted-foreground group-hover:text-primary transition-colors">
                      {column === "Done" ? <CheckCircle2 className="text-emerald-500" size={20} /> : <Target size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{task.title}</p>
                      {task.description && (
                        <p className="text-sm text-muted-foreground truncate max-w-[500px]">
                          {task.description.replace(/<[^>]*>?/gm, '')}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                      {task.dueDate && (
                        <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                          <CalendarIcon size={14} />
                          <span>{task.dueDate}</span>
                        </div>
                      )}
                      {task.comments?.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{task.comments.length}</span> comments
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {tasks.length === 0 && (
          <div className="text-center py-20 text-muted-foreground border-2 border-dashed border-border rounded-xl">
            <p>No tasks yet. Create some tasks to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
