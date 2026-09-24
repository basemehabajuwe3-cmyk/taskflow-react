export function LigneTache({ tache, onToggle, onSupprimer }) {
  return (
    <li className={`ligne-tache ${tache.terminee ? 'terminee' : ''}`}>
      <input
        type="checkbox"
        checked={Boolean(tache.terminee)}
        onChange={() => onToggle(tache.id)}
        aria-label={`Marquer "${tache.titre}" comme ${tache.terminee ? 'non terminée' : 'terminée'}`}
      />
<span className="tache-titre">{tache.titre}</span>
      <span className={`priorite priorite-${tache.priorite}`}>{tache.priorite}</span>
      <button type="button" onClick={() => onSupprimer(tache.id)}>
        Supprimer
      </button>
    </li>
  );
}
