
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'user')[];
  children: ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
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

  return <>{children}</>;
};

export default ProtectedRoute;
