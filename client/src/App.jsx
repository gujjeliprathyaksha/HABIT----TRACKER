import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/DashboardNew.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

export default function App() {
  return <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route element={<PrivateRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/morning" element={<Dashboard />} />
      <Route path="/dashboard/evening" element={<Dashboard />} />
      <Route path="/dashboard/habits" element={<Dashboard />} />
      <Route path="/dashboard/calendar" element={<Dashboard />} />
      <Route path="/dashboard/history" element={<Dashboard />} />
      <Route path="/dashboard/insights" element={<Dashboard />} />
      <Route path="/dashboard/archived" element={<Dashboard />} />
      <Route path="/dashboard/guide" element={<Dashboard />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
