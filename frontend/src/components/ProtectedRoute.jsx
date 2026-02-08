import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredPerm }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" /></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPerm !== undefined && user.perm !== requiredPerm) {
    return <Navigate to={user.perm === 0 ? '/student' : '/dashboard'} replace />;
  }

  return children;
}
