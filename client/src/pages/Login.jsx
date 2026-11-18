import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/dashboard" replace />;
  const submit = async (event) => {
    event.preventDefault(); setError(''); setBusy(true);
    try { await login(form); navigate(location.state?.from?.pathname || '/dashboard', { replace: true }); }
    catch (requestError) { setError(requestError.response?.data?.message || 'Unable to sign in. Check your details.'); }
    finally { setBusy(false); }
  };
  return <main className="auth-page"><section className="auth-panel"><div className="auth-brand"><span className="brand-mark">H</span><span>Habitual</span></div><div className="auth-copy"><p className="eyebrow">WELCOME BACK</p><h1>Make room for the things that matter.</h1><p>Build a rhythm you can return to, one small promise at a time.</p></div><form className="auth-form" onSubmit={submit}><label>Email<input className="transition-shadow duration-200 focus:ring-2 focus:ring-[#ff7d66]/20" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></label><label>Password<input className="transition-shadow duration-200 focus:ring-2 focus:ring-[#ff7d66]/20" type="password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Your password" /></label><div className="password-row"><Link to="/forgot-password">Forgot password?</Link></div>{error && <div className="form-error px-3 py-2.5 text-xs">{error}</div>}<button className="auth-submit transition-opacity duration-200 disabled:cursor-wait disabled:opacity-60" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'} <span>→</span></button></form><p className="auth-switch">New to Habitual? <Link to="/register">Create an account</Link></p></section><div className="auth-art"><div className="art-quote">“The secret of your future is hidden in your daily routine.”<small>— Mike Murdock</small></div><div className="art-orbit orbit-one"></div><div className="art-orbit orbit-two"></div><span className="art-star">✦</span></div></main>;
}
