import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjets, creerProjet, supprimerProjet } from '../api/projets';
import { CarteProjet } from '../components/CarteProjet';
import { Modale } from '../components/Modale';

export function Projets() {
  const [projets, setProjets] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    charger();
  }, []);

  async function charger() {
    setChargement(true);
    const data = await getProjets();
    setProjets(data);
    setChargement(false);
  }

  async function handleCreer(e) {
    e.preventDefault();
    const nouveau = await creerProjet({
      nom,
      description,
      nbTaches: 0,
    });
    setProjets((prev) => [...prev, nouveau]);
    setNom('');
    setDescription('');
    setModaleOuverte(false);
  }

  async function handleSupprimer(id, e) {
    e.stopPropagation();
    if (!confirm('Supprimer ce projet ?')) return;
    await supprimerProjet(id);
    setProjets((prev) => prev.filter((p) => p.id !== id));
  }

  if (chargement) return <p>Chargement...</p>;

  return (
    <div className="page-projets">
      <header>
        <h1>Mes projets</h1>
        <button type="button" onClick={() => setModaleOuverte(true)}>
          Ajouter le projet
        </button>
      </header>

      {projets.length === 0 ? (
        <p>Aucun projet pour le moment.</p>
      ) : (
        <div className="grille-projets">
          {projets.map((projet) => (
            <div key={projet.id} className="conteneur-carte">
              <CarteProjet
                projet={projet}
                onClick={() => navigate(`/projets/${projet.id}`)}
              />
              <button
                className="btn-supprimer"
                onClick={(e) => handleSupprimer(projet.id, e)}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

      <Modale ouverte={modaleOuverte} onFermer={() => setModaleOuverte(false)}>
        <h2>Nouveau projet</h2>
        <form onSubmit={handleCreer}>
          <div>
            <label>Nom</label>
            <input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button type="submit">Ajouter projet</button>
        </form>
      </Modale>
    </div>
  );
}

export default Projets;