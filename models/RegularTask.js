import mongoose from 'mongoose';

const RegularTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  note: { type: String, default: "" },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
  category: { type: String, default: "Personal" },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  dueDate: { type: Date, default: null },
  tags: { type: [String], default: [] },
  starred: { type: Boolean, default: false },
  isMyDay: { type: Boolean, default: false },
  recurring: {
    enabled: { type: Boolean, default: false },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
    lastResetDate: { type: Date, default: null },
  },
  financeDetails: {
    amount: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    isFinanceTask: { type: Boolean, default: false },
    isSubscription: { type: Boolean, default: false },
  },
  savingsDetails: {
    isGoal: { type: Boolean, default: false },
    targetAmount: { type: Number, default: 0 },
    currentAmount: { type: Number, default: 0 },
  },
  subtasks: {
    type: [{
      id: String,
      text: String,
      completed: { type: Boolean, default: false }
    }],
    default: []
  },
  order: { type: Number, default: 0 },
  userId: { type: String, required: true },
  attachments: {
    type: [{
      name: String,
      url: String,
      type: String,
      size: Number,
      createdAt: { type: Date, default: Date.now }
    }],
    default: []
  },
}, { timestamps: true });

export default mongoose.models.RegularTask || mongoose.model('RegularTask', RegularTaskSchema);
