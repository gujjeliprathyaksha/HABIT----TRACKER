import { useEffect, useState } from 'react';
import api from '../services/api.js';

export default function HabitCard({ habit, onToggle, onDelete }) {
  const [stats, setStats] = useState({ currentStreak: 0, totalCompletions: habit.totalCompletions || 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!habit.id || String(habit.id).length < 12) return;
    api.get(`/habits/${habit.id}/stats`).then(({ data }) => setStats(data.data)).catch(() => {});
  }, [habit.id]);

  const toggle = async () => {
    setSaving(true);
    await onToggle(habit, !habit.completedToday);
    setSaving(false);
  };

  const remove = () => {
    if (window.confirm(`Delete "${habit.name}"? This will also remove its completion history.`)) onDelete(habit.id);
  };

  return <article className={`habit-card ${habit.completedToday ? 'is-done' : ''}`}>
    <div className="card-top"><span className="habit-dot" style={{ background: habit.color }}></span><button className="more" onClick={remove} aria-label={`Delete ${habit.name}`}>•••</button></div>
    <h3>{habit.name}</h3><p>{habit.description || 'Make it part of your rhythm.'}</p>
    <div className="card-footer"><div className="streak"><strong>{stats.currentStreak}</strong><span>day streak · {stats.totalCompletions} total</span></div><button className="check-button" disabled={saving} style={{ '--check-color': habit.color }} onClick={toggle}>{habit.completedToday ? '✓' : ''}</button></div>
  </article>;
}
