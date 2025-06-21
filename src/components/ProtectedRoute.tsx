
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'user')[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { profile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }
  
  if (!profile) {
    toast.error("You must be logged in to view this page.");
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    toast.error("You do not have permission to view this page.");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
