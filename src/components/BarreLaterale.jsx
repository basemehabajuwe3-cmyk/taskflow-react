import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function BarreLaterale() {
  const { deconnexion } = useAuth();
  return (
    <>
      <aside className="barre-laterale">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/projets">Projets</NavLink>
        <button type="button" onClick={deconnexion}>
          Déconnexion
        </button>
      </aside>
      <Outlet />
    </>
  );
}