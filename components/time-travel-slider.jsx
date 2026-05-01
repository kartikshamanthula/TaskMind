"use client";

import { motion } from "framer-motion";
import { History, Rewind, Play, X } from "lucide-react";

export function TimeTravelSlider({ snapshots, onTimelineChange, currentSnapshotIndex, onClose }) {
  if (!snapshots || snapshots.length === 0) return null;

  // Add "Present" as the last item
  const totalPoints = snapshots.length + 1;
  const isPresent = currentSnapshotIndex === -1;

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[600px] px-4"
    >
      <div className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl p-4 flex flex-col gap-3 relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all"
          title="Close Time-Travel"
        >
          <X size={16} />
        </button>
        
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <History size={16} />
            <span>Visual Time-Travel</span>
          </div>
          <div className="mr-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {isPresent ? "Present State" : `History: ${new Date(snapshots[currentSnapshotIndex].timestamp).toLocaleString()}`}
          </div>
        </div>

        <div className="relative h-12 flex items-center px-2">
          {/* Track */}
          <div className="absolute inset-x-4 h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary/40 transition-all duration-300" 
              style={{ width: `${((currentSnapshotIndex === -1 ? totalPoints - 1 : currentSnapshotIndex) / (totalPoints - 1)) * 100}%` }}
            />
          </div>

          {/* Slider Input */}
          <input
            type="range"
            min="0"
            max={snapshots.length}
            value={currentSnapshotIndex === -1 ? snapshots.length : currentSnapshotIndex}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              onTimelineChange(val === snapshots.length ? -1 : val);
            }}
            className="absolute inset-x-2 h-6 opacity-0 cursor-pointer z-10"
          />

          {/* Visualization of Snapshots */}
          <div className="absolute inset-x-4 h-1.5 flex justify-between pointer-events-none">
            {[...Array(totalPoints)].map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  (currentSnapshotIndex === -1 && i === snapshots.length) || currentSnapshotIndex === i 
                    ? "bg-primary scale-150 shadow-[0_0_10px_rgba(var(--primary),0.5)]" 
                    : "bg-border"
                }`} 
              />
            ))}
          </div>
        </div>
        
        {!isPresent && (
          <div className="text-center">
            <button 
              onClick={() => onTimelineChange(-1)}
              className="text-[10px] font-bold text-primary hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              <Play size={10} fill="currentColor" /> Return to Present
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
