import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('habit-user') || 'null'); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const expire = () => { setUser(null); setLoading(false); };
    window.addEventListener('habit-auth-expired', expire);
    const token = localStorage.getItem('habit-token');
    if (!token) { setLoading(false); return () => window.removeEventListener('habit-auth-expired', expire); }
    api.get('/auth/me').then(({ data }) => {
      setUser(data.user);
      localStorage.setItem('habit-user', JSON.stringify(data.user));
    }).catch(() => {
      localStorage.removeItem('habit-token');
      localStorage.removeItem('habit-user');
      setUser(null);
    }).finally(() => setLoading(false));
    return () => window.removeEventListener('habit-auth-expired', expire);
  }, []);

  const saveSession = (data) => {
    localStorage.setItem('habit-token', data.token);
    localStorage.setItem('habit-user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };
  const register = async (details) => saveSession((await api.post('/auth/register', details)).data);
  const login = async (details) => saveSession((await api.post('/auth/login', details)).data);
  const logout = () => { localStorage.removeItem('habit-token'); localStorage.removeItem('habit-user'); setUser(null); };

  return <AuthContext.Provider value={{ user, loading, register, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
