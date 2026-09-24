import { useEffect, useState } from 'react';
import { getProjets } from '../api/projets';
import { getTaches } from '../api/taches';
import { useAuth } from '../context/AuthContext';
import {
  compterTachesTerminees,
  pourcentageTermine,
  trierParPriorite,
} from '../utiles/statistique';

export default function Dashboard() {
  const { utilisateur } = useAuth();
  const [projets, setProjets] = useState([]);
  const [taches, setTaches] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    async function charger() {
      try {
        const [p, t] = await Promise.all([getProjets(), getTaches()]);
        setProjets(p);
        setTaches(t);
      } catch (err) {
        console.error('Erreur chargement dashboard', err);
      } finally {
        setChargement(false);
      }
    }
    charger();
  }, []);

  if (chargement) return <p>Chargement...</p>;

  const terminees = compterTachesTerminees(taches);
  const pourcentage = pourcentageTermine(taches);
  const prioritaires = trierParPriorite(taches).slice(0, 5);

  return (
    <div className="page-dashboard">
      <h1>Bonjour {utilisateur?.nom} </h1>

      <section className="stats">
        <div className="stat-card">
          <h3>{projets.length}</h3>
          <p>Projets</p>
        </div>
        <div className="sta-card">
          <h3>{taches.length}</h3>
          <p>Tâches totales</p>
        </div>
        <div className="stat-card">
          <h3>{terminees}</h3>
          <p>Tâches terminées</p>
        </div>
        <div className="stat-card">
          <h3>{pourcentage}%</h3>
          <p>Progression globale</p>
        </div>
      </section>

      <section>
        <h2>Tâches prioritaires</h2>
        {prioritaires.length === 0 ? (
          <p>Aucune tâche en cours </p>
        ) : (
          <ul>
            {prioritaires.map((t) => (
              <li key={t.id}>
                [{t.priorite}] {t.titre}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}