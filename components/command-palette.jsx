"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Search, Plus, KanbanSquare, Target } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function CommandPalette({ tasks, onSelectTask, onAddBoard }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && e.altKey) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] bg-background/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={() => setOpen(false)} 
      />
      
      <Command 
        className="relative z-10 w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            setOpen(false);
          }
        }}
      >
        <div className="flex items-center border-b border-border px-4 py-3 gap-3">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <Command.Input 
            autoFocus
            value={search}
            onValueChange={setSearch}
            placeholder="Search for tasks, actions..." 
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-base"
          />
          <kbd className="hidden sm:inline-flex px-2 py-1 bg-muted border border-border rounded text-[10px] font-mono font-medium text-muted-foreground uppercase">Esc</kbd>
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
            No results found.
          </Command.Empty>

          <Command.Group heading="Actions" className="text-xs font-medium text-muted-foreground px-2 py-1.5 [&_[cmdk-group-heading]]:mb-2">
            <Command.Item 
              onSelect={() => { setOpen(false); onAddBoard(); }}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground rounded-lg cursor-pointer hover:bg-primary hover:text-primary-foreground aria-selected:bg-primary aria-selected:text-primary-foreground transition-colors"
            >
              <Plus className="w-4 h-4" /> Add a new board
            </Command.Item>
          </Command.Group>

          {tasks.length > 0 && (
            <Command.Group heading="Tasks" className="text-xs font-medium text-muted-foreground px-2 py-1.5 [&_[cmdk-group-heading]]:mb-2 mt-2">
              {tasks.map(task => (
                <Command.Item 
                  key={task.id}
                  onSelect={() => { setOpen(false); onSelectTask(task); }}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground rounded-lg cursor-pointer hover:bg-secondary aria-selected:bg-secondary transition-colors group"
                >
                  <Target className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                  <div className="flex flex-col">
                    <span>{task.title}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{task.column}</span>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>
      </Command>
    </div>
  );
}
