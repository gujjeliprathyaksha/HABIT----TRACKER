import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import HabitCard from '../components/HabitCard.jsx';
import AddHabitForm from '../components/AddHabitForm.jsx';
import '../dashboard.css';

const starterHabits = [
  { id: 'water', name: 'Drink water', description: 'Keep the energy steady.', color: '#ff7d66', completedToday: true, totalCompletions: 24 },
  { id: 'read', name: 'Read 20 pages', description: 'A little progress every day.', color: '#61b6a7', completedToday: false, totalCompletions: 18 },
  { id: 'stretch', name: 'Morning stretch', description: 'Start gently, move freely.', color: '#edb85e', completedToday: false, totalCompletions: 12 }
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [habits, setHabits] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [demoMode, setDemoMode] = useState(false);
  const page = pagination.page || 1;

  const loadHabits = async (nextPage = page) => {
    setLoading(true); setError('');
    try {
      const { data } = await api.get(`/habits?page=${nextPage}&limit=6`);
      setHabits((data.data || []).map((habit) => ({ ...habit, id: habit._id })));
      setPagination(data.pagination || { page: nextPage, totalPages: 1 });
      setDemoMode(false);
    } catch {
      setDemoMode(true); setHabits(starterHabits); setPagination({ page: 1, totalPages: 1 });
    } finally { setLoading(false); }
  };

  useEffect(() => { loadHabits(1); }, []);

  const name = user?.name || 'there';
  const completed = habits.filter((habit) => habit.completedToday).length;
  const visibleHabits = filter === 'done' ? habits.filter((habit) => habit.completedToday) : filter === 'open' ? habits.filter((habit) => !habit.completedToday) : habits;
  const toggle = async (habit, completedToday) => {
    setHabits((items) => items.map((item) => item.id === habit.id ? { ...item, completedToday, totalCompletions: (item.totalCompletions || 0) + (completedToday ? 1 : -1) } : item));
    try { await api.post(`/habits/${habit.id}/logs`, { completed: completedToday }); } catch { setError('Could not save that change.'); }
  };
  const addHabit = async (details) => {
    try { const { data } = await api.post('/habits', details); setHabits((items) => [{ ...details, ...data.data, id: data.data._id }, ...items]); setShowForm(false); }
    catch { setError('Could not add this habit.'); }
  };
  const remove = async (id) => {
    try { await api.delete(`/habits/${id}`); if (habits.length === 1 && page > 1) loadHabits(page - 1); else loadHabits(page); }
    catch { setError('Could not delete this habit.'); }
  };

  return <main className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark">H</span><span>Habitual</span></div><nav><a className="active">Overview</a><a>Calendar</a><a>Insights</a></nav><div className="sidebar-bottom"><div className="mini-avatar">{name[0]}</div><div><strong>{name}</strong><span>Personal space</span></div><button onClick={logout} aria-label="Log out">↗</button></div></aside><section className="workspace"><header className="topbar"><div className="mobile-brand">Habitual</div><div className="date-label">Tuesday, September 23, 2026</div><div className="top-actions"><button className="icon-button" aria-label="Notifications">◌</button><div className="avatar">{name[0]}</div></div></header><div className="content"><section className="welcome"><div><p className="eyebrow">YOUR DAILY RHYTHM</p><h1>Good morning, {name}<span className="sun">✦</span></h1><p className="subtext">Small steps, repeated consistently, become remarkable change.</p></div><div className="progress-ring" style={{ '--progress': `${Math.round(completed / Math.max(habits.length, 1) * 100)}%` }}><strong>{Math.round(completed / Math.max(habits.length, 1) * 100)}%</strong><span>today</span></div></section><section className="stats-row"><div className="stat-card accent"><span className="stat-icon">✦</span><div><strong>{habits.reduce((total, habit) => Math.max(total, habit.currentStreak || 0), 12)}</strong><span>day streak</span></div><small>Keep building</small></div><div className="stat-card"><span className="stat-icon teal">✓</span><div><strong>{completed}<i>/{habits.length}</i></strong><span>completed today</span></div><small>Keep going</small></div><div className="stat-card"><span className="stat-icon gold">↗</span><div><strong>{habits.length ? Math.round(completed / habits.length * 100) : 0}%</strong><span>today's consistency</span></div><small>Small steps</small></div></section><section className="section-heading"><div><p className="eyebrow">YOUR ROUTINE</p><h2>Today's habits</h2></div><button className="add-button" onClick={() => setShowForm(!showForm)}><span>+</span> New habit</button></section>{showForm && <AddHabitForm onAdd={addHabit} onCancel={() => setShowForm(false)} />}{error && <div className="form-error dashboard-error">{error}</div>}<div className="filters"><div><button className={filter === 'all' ? 'selected' : ''} onClick={() => setFilter('all')}>All habits <b>{habits.length}</b></button><button className={filter === 'open' ? 'selected' : ''} onClick={() => setFilter('open')}>To do <b>{habits.filter((habit) => !habit.completedToday).length}</b></button><button className={filter === 'done' ? 'selected' : ''} onClick={() => setFilter('done')}>Completed <b>{completed}</b></button></div><span className="today-pill">● Today</span></div>{loading ? <div className="empty-state animate-pulse text-[#85858c]">Loading your habits...</div> : <><div className="habit-grid">{visibleHabits.map((habit) => <HabitCard key={habit.id} habit={habit} onToggle={toggle} onDelete={remove} />)}</div>{visibleHabits.length === 0 && <div className="empty-state px-6 py-12 text-center text-[#85858c]">Nothing here yet. A clear space is a good place to begin.</div>}</>}{!demoMode && pagination.totalPages > 1 && <div className="pagination"><button disabled={page === 1} onClick={() => loadHabits(page - 1)}>← Previous</button><span>Page {page} of {pagination.totalPages}</span><button disabled={page === pagination.totalPages} onClick={() => loadHabits(page + 1)}>Next →</button></div>}<footer><span>“Consistency is a form of self-respect.”</span><span>© 2026 Habitual</span></footer></div></section></main>;
}
