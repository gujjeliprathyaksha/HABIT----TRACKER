import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  frequency: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
  targetPerWeek: { type: Number, min: 1, max: 7, default: 7 },
  scheduledTime: { type: String, default: '09:00' },
  reminderInterval: { type: Number, min: 5, max: 1440, default: 5 },
  reminderLimit: { type: Number, min: 0, max: 20, default: 3 },
  reminderEnabled: { type: Boolean, default: true },
  color: { type: String, default: '#ff7d66' },
  isArchived: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Habit', habitSchema);