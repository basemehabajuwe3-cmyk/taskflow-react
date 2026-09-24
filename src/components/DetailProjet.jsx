import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjet } from '../api/projets';
import { useTaches } from '../hooks/useTaches';
import { LigneTache } from './LigneTache';
import { Modale } from './Modale';

export function DetailProjet() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [projet, setProjet] = useState(null);
  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [titre, setTitre] = useState('');
  const [priorite, setPriorite] = useState('moyenne');
  const [messageAction, setMessageAction] = useState('');

  const { taches, chargement, erreur, ajouter, supprimer, toggle } = useTaches(id);

  useEffect(() => {
    getProjet(id).then(setProjet).catch(() => navigate('/projets'));
  }, [id, navigate]);

  async function handleAjouter(e) {
    e.preventDefault();

    try {
      await ajouter({ titre, priorite, terminee: false });
      setMessageAction('Tâche ajoutée avec succès.');
      setTitre('');
      setPriorite('moyenne');
      setModaleOuverte(false);
    } catch {
      setMessageAction('L’ajout a échoué. Veuillez réessayer.');
    }
  }

  async function handleSupprimer(idTache) {
    try {
      await supprimer(idTache);
      setMessageAction('Tâche supprimée avec succès.');
    } catch {
      setMessageAction('La suppression a échoué. Veuillez réessayer.');
    }
  }

  if (!projet) return <p>Chargement du projet...</p>;

  return (
    <div className="page-detail-projet">
      <button className="btn-retour" onClick={() => navigate('/projets')}>← Retour aux projets</button>

      <div className="entete-projet">
        <div>
          <span className="sur-titre">Espace de travail</span>
          <h1>{projet.nom}</h1>
          <p>{projet.description || 'Organisez les prochaines étapes de ce projet.'}</p>
        </div>
        <span className="compteur-projet">{taches.length} tâche{taches.length !== 1 ? 's' : ''}</span>
      </div>

      <header>
        <h2>Tâches ({taches.length})</h2>
        <button className="btn-principal" onClick={() => setModaleOuverte(true)}>+ Nouvelle tâche</button>
      </header>

      {messageAction && <p className="message-ajout">{messageAction}</p>}
      {erreur && <p className="erreur" role="alert">{erreur}</p>}
      {chargement ? (
        <p>Chargement des tâches...</p>
      ) : taches.length === 0 ? (
        <p>Aucune tâche pour ce projet.</p>
      ) : (
        <ul className="liste-taches">
          {taches.map((tache) => (
            <LigneTache
              key={tache.id}
              tache={tache}
              onToggle={toggle}
              onSupprimer={handleSupprimer}
            />
          ))}
        </ul>
      )}

      <Modale ouverte={modaleOuverte} onFermer={() => setModaleOuverte(false)}>
        <h2>Nouvelle tâche</h2>
        <form onSubmit={handleAjouter}>
          <div className="champ">
            <label htmlFor="titre-tache">Titre</label>
            <input
              id="titre-tache"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              required
            />
          </div>
          <div className="champ">
            <label htmlFor="priorite-tache">Priorité</label>
            <select
              id="priorite-tache"
              value={priorite}
              onChange={(e) => setPriorite(e.target.value)}
            >
              <option value="haute">Haute</option>
              <option value="moyenne">Moyenne</option>
              <option value="basse">Basse</option>
            </select>
          </div>
          <button className="btn-principal" type="submit">Ajouter la tâche</button>
        </form>
      </Modale>
    </div>
  );
}