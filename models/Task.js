import mongoose from 'mongoose';

const ChecklistItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const ChecklistSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, default: "Checklist" },
  items: { type: [ChecklistItemSchema], default: [] }
});

const CommentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  author: { type: String, required: true },
  timestamp: { type: String, required: true }
});

const TaskSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // We keep string id for client compatibility
  title: { type: String, required: true },
  column: { type: String, required: true },
  description: { type: String, default: "" },
  checklists: { type: [ChecklistSchema], default: [] },
  labels: { type: [String], default: [] }, // array of label IDs
  dueDate: { type: String, default: null }, // or Date, but string is fine for date input
  members: { type: [String], default: [] }, // array of emails
  attachments: { type: [{
    id: String,
    type: { type: String, enum: ['link', 'image', 'video', 'file'] },
    url: String,
    name: String,
    createdAt: { type: Date, default: Date.now }
  }], default: [] },
  comments: { type: [CommentSchema], default: [] },
  userId: { type: String, required: true },
  boardId: { type: String, default: null }, // which workspace this task belongs to
  blockedBy: { type: [String], default: [] },
  history: { type: [{ action: String, detail: String, timestamp: String }], default: [] }
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
