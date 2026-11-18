import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function PrivateRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="auth-loading px-6 text-center text-sm tracking-wide text-[#929299]">Loading your space...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}
