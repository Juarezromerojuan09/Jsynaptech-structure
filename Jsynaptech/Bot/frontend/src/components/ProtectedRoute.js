import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Si no está autenticado, redirigir al login
    // Guardamos la ubicación para redirigir de vuelta después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si se especifican roles y el rol del usuario no está incluido,
  // redirigir a una página de 'no autorizado' o al dashboard principal.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
