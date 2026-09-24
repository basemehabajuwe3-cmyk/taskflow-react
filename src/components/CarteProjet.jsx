export function CarteProjet({ projet, onClick }) {
  return (
    <div className="carte-projet" onClick={() => onClick(projet.id)}>
      <h3>{projet.nom}</h3>
      <p>{projet.description}</p>
      <span>{projet.nbTaches} tâches</span>
    </div>
  );
}