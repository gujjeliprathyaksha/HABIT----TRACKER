import mongoose from 'mongoose';

const habitLogSchema = new mongoose.Schema({
  habit: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  completed: { type: Boolean, default: true }
}, { timestamps: true });

habitLogSchema.index({ habit: 1, date: 1 }, { unique: true });
export default mongoose.model('HabitLog', habitLogSchema);