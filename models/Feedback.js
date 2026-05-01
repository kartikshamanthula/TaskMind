import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
  type: {
    type: String,
    enum: ['bug', 'feedback', 'improvement'],
    default: 'feedback',
  },
  attachments: {
    type: [{
      id: String,
      type: { type: String, enum: ['link', 'image', 'video', 'file'] },
      url: String,
      name: String,
      createdAt: { type: Date, default: Date.now }
    }],
    default: [],
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
