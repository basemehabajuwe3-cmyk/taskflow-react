// components/Layout.jsx
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div>
      <header>Ma barre de navigation</header>
      <main>
        <Outlet /> {/* ✅ affiche la page enfant */}
      </main>
    </div>
  );
}

export default Layout;