import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  status: { type: String, enum: ['pending', 'active', 'blocked'], default: 'pending' },
  lastLogin: { type: Date, default: Date.now },
  totalUsageMinutes: { type: Number, default: 0 },
  isOnline: { type: Boolean, default: false },
  lastHeartbeat: { type: Date, default: Date.now },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },
  // Gamification fields
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: { type: [String], default: [] },
  permissions: {
    canUseAI: { type: Boolean, default: true },
    canAccessBoard: { type: Boolean, default: true },
    canAccessRegularTasks: { type: Boolean, default: true },
    canAccessFinancialFeature: { type: Boolean, default: true }
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
