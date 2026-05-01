"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Heading2, Quote, Wand, Loader2, Paperclip } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const MenuBar = ({ editor, onAttachmentClick }) => {
  const [isPolishing, setIsPolishing] = useState(false);

  if (!editor) return null;

  const handlePolish = async () => {
    const text = editor.getText();
    if (!text.trim()) {
      toast.error("Add some text first before polishing!");
      return;
    }
    
    setIsPolishing(true);
    const loadingToast = toast.loading("Polishing text with AI...");
    
    try {
      const res = await fetch('/api/ai/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      if (!res.ok) throw new Error("Failed to polish text");
      const data = await res.json();
      
      if (data.text) {
        editor.commands.setContent(data.text);
        toast.success("Text polished successfully!", { id: loadingToast });
      } else {
        toast.error("AI returned empty result", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Something went wrong with AI polish", { id: loadingToast });
    } finally {
      setIsPolishing(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-1 border-b border-border bg-muted/20 rounded-t-md">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={cn("p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors", editor.isActive('bold') && "bg-muted text-foreground")}
        title="Bold"
      >
        <Bold size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={cn("p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors", editor.isActive('italic') && "bg-muted text-foreground")}
        title="Italic"
      >
        <Italic size={16} />
      </button>
      <div className="w-[1px] h-4 bg-border mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn("p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors", editor.isActive('heading', { level: 2 }) && "bg-muted text-foreground")}
        title="Heading"
      >
        <Heading2 size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn("p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors", editor.isActive('bulletList') && "bg-muted text-foreground")}
        title="Bullet List"
      >
        <List size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn("p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors", editor.isActive('orderedList') && "bg-muted text-foreground")}
        title="Ordered List"
      >
        <ListOrdered size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={cn("p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors", editor.isActive('blockquote') && "bg-muted text-foreground")}
        title="Quote"
      >
        <Quote size={16} />
      </button>

      <div className="w-[1px] h-4 bg-border mx-1" />
      
      <button
        onClick={handlePolish}
        disabled={isPolishing}
        className={cn("p-1.5 rounded hover:bg-indigo-500/10 text-indigo-500 transition-colors disabled:opacity-50 flex items-center gap-1", isPolishing && "animate-pulse")}
        title="AI Magic Polish"
      >
        {isPolishing ? <Loader2 size={16} className="animate-spin" /> : <Wand size={16} />}
      </button>

      {onAttachmentClick && (
        <button
          onClick={onAttachmentClick}
          className="p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors ml-auto"
          title="Add Attachment"
        >
          <Paperclip size={16} />
        </button>
      )}
    </div>
  );
};

export function RichTextEditor({ content, onChange, onAttachmentClick, placeholder = "Add a more detailed description..." }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[120px] p-3 text-sm',
      },
    },
  });

  // Effect to reset content from outside (e.g. clearing after submit)
  useEffect(() => {
    if (editor && content === "" && editor.getHTML() !== "<p></p>") {
      editor.commands.setContent("");
    }
  }, [content, editor]);

  return (
    <div className="w-full rounded-md border border-border bg-background flex flex-col focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
      <MenuBar editor={editor} onAttachmentClick={onAttachmentClick} />
      <EditorContent editor={editor} className="flex-1 custom-tiptap" />
    </div>
  );
}
