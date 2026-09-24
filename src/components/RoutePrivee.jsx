import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RoutePrivee() {
  const { utilisateur } = useAuth();
  return utilisateur ? <Outlet /> : <Navigate to="/connexion" replace />;
}