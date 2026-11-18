import Habit from '../models/Habit.js';
import HabitLog from '../models/HabitLog.js';

const pageOptions = (query, defaultLimit) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || defaultLimit, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
};

const today = () => new Date().toISOString().slice(0, 10);
const dateAtOffset = (offset) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - offset);
  return date.toISOString().slice(0, 10);
};

const habitFields = ['name', 'description', 'frequency', 'targetPerWeek', 'scheduledTime', 'reminderInterval', 'reminderLimit', 'reminderEnabled', 'color', 'isArchived'];
const habitPayload = (body) => Object.fromEntries(
  habitFields.filter((field) => body[field] !== undefined).map((field) => [field, body[field]])
);

async function logsForHabits(habits, userId) {
  const ids = habits.map((habit) => habit._id);
  const logs = await HabitLog.find({ user: userId, habit: { $in: ids } }).lean();
  return habits.map((habit) => {
    const habitLogs = logs.filter((log) => String(log.habit) === String(habit._id));
    return {
      ...habit,
      completedToday: habitLogs.some((log) => log.date === today() && log.completed),
      totalCompletions: habitLogs.filter((log) => log.completed).length
    };
  });
}

export async function listHabits(req, res, next) {
  try {
    const { page, limit, skip } = pageOptions(req.query, 10);
    const filter = { user: req.user._id };
    if (req.query.archived !== 'true') filter.isArchived = false;
    const [habits, total] = await Promise.all([
      Habit.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Habit.countDocuments(filter)
    ]);
    const data = await logsForHabits(habits, req.user._id);
    return res.status(200).json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) { return next(error); }
}

export async function createHabit(req, res, next) {
  try {
    const habit = await Habit.create({ ...habitPayload(req.body), user: req.user._id });
    return res.status(201).json({ success: true, data: habit });
  } catch (error) { return next(error); }
}

export async function getHabit(req, res, next) {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id }).lean();
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    const [data] = await logsForHabits([habit], req.user._id);
    return res.status(200).json({ success: true, data });
  } catch (error) { return next(error); }
}

export async function updateHabit(req, res, next) {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      habitPayload(req.body),
      { new: true, runValidators: true }
    );
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    return res.status(200).json({ success: true, data: habit });
  } catch (error) { return next(error); }
}

export async function deleteHabit(req, res, next) {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    await HabitLog.deleteMany({ habit: habit._id, user: req.user._id });
    return res.status(200).json({ success: true, message: 'Habit deleted' });
  } catch (error) { return next(error); }
}

export async function upsertLog(req, res, next) {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    const log = await HabitLog.findOneAndUpdate(
      { habit: habit._id, user: req.user._id, date: req.body.date || today() },
      { completed: req.body.completed !== false },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
    return res.status(200).json({ success: true, data: log });
  } catch (error) { return next(error); }
}

export async function listLogs(req, res, next) {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id }).select('_id');
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    const { page, limit, skip } = pageOptions(req.query, 30);
    const filter = { habit: habit._id, user: req.user._id };
    const [data, total] = await Promise.all([
      HabitLog.find(filter).sort({ date: -1 }).skip(skip).limit(limit).lean(),
      HabitLog.countDocuments(filter)
    ]);
    return res.status(200).json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) { return next(error); }
}

export async function getStats(req, res, next) {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id }).select('_id');
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    const logs = await HabitLog.find({ habit: habit._id, user: req.user._id, completed: true }).select('date -_id').lean();
    const completedDates = new Set(logs.map((log) => log.date));
    let currentStreak = 0;
    while (completedDates.has(dateAtOffset(currentStreak))) currentStreak += 1;
    return res.status(200).json({ success: true, data: { totalCompletions: logs.length, currentStreak } });
  } catch (error) { return next(error); }
}

export async function getInsights(req, res, next) {
  try {
    const habits = await Habit.find({ user: req.user._id, isArchived: false }).select('_id name color').lean();
    const logs = await HabitLog.find({ user: req.user._id, completed: true }).select('habit date -_id').lean();
    const completedDates = new Set(logs.map((log) => log.date));
    const lastSevenDays = Array.from({ length: 7 }, (_, index) => dateAtOffset(6 - index));
    const daily = lastSevenDays.map((date) => ({ date, completed: logs.filter((log) => log.date === date).length }));
    const totalPossible = habits.length * 7;
    const bestHabit = habits.map((habit) => ({ ...habit, total: logs.filter((log) => String(log.habit) === String(habit._id)).length })).sort((a, b) => b.total - a.total)[0];
    return res.status(200).json({ success: true, data: { daily, totalCompletions: logs.length, consistency: totalPossible ? Math.round(logs.length / totalPossible * 100) : 0, activeDays: completedDates.size, bestHabit: bestHabit?.name || null } });
  } catch (error) { return next(error); }
}