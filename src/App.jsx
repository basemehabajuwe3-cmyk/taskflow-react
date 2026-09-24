import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RoutePrivee } from './components/RoutePrivee';
import { BarreLaterale } from './components/BarreLaterale';
import {Connexion} from './pages/Connexion';
import {Inscription} from './pages/Inscription';
import Dashboard from './pages/Dashboard';
import { Projets } from './pages/Projets';
import { DetailProjet } from './components/DetailProjet';
import { NonTrouve } from './pages/NonTrouve';
// ... imports pages

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />

        <Route element={<RoutePrivee />}>
          <Route element={<BarreLaterale />}> {/* layout */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/projets" element={<Projets />} />
            <Route path="/projets/:id" element={<DetailProjet />} />
          </Route>
        </Route>

        <Route path="*" element={<NonTrouve />} />
      </Routes>
    </AuthProvider>
  );
}
