import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  // Show a brutalist loading state while checking the JWT
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        <h1 className="text-4xl font-black tracking-tighter uppercase animate-pulse">Loading...</h1>
      </div>
    );
  }

  // If authenticated, render the child routes. Otherwise, redirect to login.
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}