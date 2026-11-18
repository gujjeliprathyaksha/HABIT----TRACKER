import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/dashboard" replace />;
  const submit = async (event) => {
    event.preventDefault(); setError(''); setBusy(true);
    try { await register(form); navigate('/dashboard', { replace: true }); }
    catch (requestError) { setError(requestError.response?.data?.message || 'Unable to create your account.'); }
    finally { setBusy(false); }
  };
  return <main className="auth-page"><section className="auth-panel"><div className="auth-brand"><span className="brand-mark">H</span><span>Habitual</span></div><div className="auth-copy"><p className="eyebrow">A FRESH START</p><h1>Turn intention into a daily rhythm.</h1><p>Keep your promises to yourself visible, simple, and quietly consistent.</p></div><form className="auth-form" onSubmit={submit}><label>Name<input className="transition-shadow duration-200 focus:ring-2 focus:ring-[#ff7d66]/20" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" /></label><label>Email<input className="transition-shadow duration-200 focus:ring-2 focus:ring-[#ff7d66]/20" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></label><label>Password<input className="transition-shadow duration-200 focus:ring-2 focus:ring-[#ff7d66]/20" type="password" minLength="6" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="At least 6 characters" /></label>{error && <div className="form-error px-3 py-2.5 text-xs">{error}</div>}<button className="auth-submit transition-opacity duration-200 disabled:cursor-wait disabled:opacity-60" disabled={busy}>{busy ? 'Creating account...' : 'Create account'} <span>→</span></button></form><p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p></section><div className="auth-art register-art"><div className="art-quote">A little every day adds up to a life.<small>Make it yours.</small></div><div className="art-orbit orbit-one"></div><div className="art-orbit orbit-two"></div><span className="art-star">✦</span></div></main>;
}
