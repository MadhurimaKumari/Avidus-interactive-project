import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

const AdminRoute = ({ children }) => {
  const { isAdmin } = useAuth();

  return (
    <ProtectedRoute>
      {isAdmin ? children : <Navigate to="/dashboard" replace />}
    </ProtectedRoute>
  );
};

export default AdminRoute;
