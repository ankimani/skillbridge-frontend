import { Navigate } from 'react-router-dom';
import { getUserRole } from  '../services/authProfile';

const RoleProtectedRoute = ({ children, allowedRoles, deniedRoles }) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  const userRole = getUserRole();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (deniedRoles && deniedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleProtectedRoute;