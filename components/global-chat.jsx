"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function GlobalChat({ isOpen, onClose, messages, onSendMessage, currentUser }) {
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]" onClick={onClose} />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[400px] bg-card border-l border-border shadow-2xl flex flex-col"
          >
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2">
                <MessageSquare className="text-primary" size={20} />
                <h2 className="font-bold">Workspace Chat</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground opacity-50">
                   <MessageSquare size={48} className="mb-2" />
                   <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={cn("flex flex-col gap-1 max-w-[85%]", msg.sender === currentUser ? "self-end items-end" : "self-start items-start")}>
                    <span className="text-[10px] font-bold text-muted-foreground px-1">{msg.sender === currentUser ? "You" : msg.sender}</span>
                    <div className={cn(
                      "p-3 rounded-2xl text-sm shadow-sm",
                      msg.sender === currentUser 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-muted text-foreground rounded-tl-none"
                    )}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] opacity-50 px-1">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-border bg-muted/10 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-background border border-border rounded-full focus:ring-2 focus:ring-primary outline-none transition-all"
              />
              <button type="submit" className="p-2 bg-primary text-primary-foreground rounded-full hover:scale-110 active:scale-95 transition-all shadow-lg">
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
