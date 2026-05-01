import mongoose from 'mongoose';

const LabelSchema = new mongoose.Schema({
  id: { type: String, required: true },
  color: { type: String, required: true },
  label: { type: String, required: true },
});

const MemberSchema = new mongoose.Schema({
  email: { type: String, required: true },
  role: { type: String, enum: ['owner', 'admin', 'member', 'viewer'], default: 'member' },
  lastActive: { type: Date, default: Date.now }
});

const ChatMessageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  sender: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const BoardSnapshotSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  state: { type: mongoose.Schema.Types.Mixed, required: true }, // Snapshots of tasks/columns
});

const BoardSchema = new mongoose.Schema({
  title: { type: String, default: 'Default Workspace' },
  columns: { type: [String], default: ["To Do", "In Progress", "Done"] },
  labels: { type: [LabelSchema], default: [] },
  userId: { type: String, required: true },
  members: { type: [MemberSchema], default: [] },
  chat: { type: [ChatMessageSchema], default: [] },
  snapshots: { type: [BoardSnapshotSchema], default: [] }, // For Visual Time-Travel
  background: { type: String, default: null },
}, { timestamps: true });

export default mongoose.models.Board || mongoose.model('Board', BoardSchema);
