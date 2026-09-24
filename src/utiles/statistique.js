


export function compterTachesTerminees(taches) {
  return taches.filter((t) => t.terminee).length;
}

export function poidsPriorite(priorite) {
  const poids = {
    haute: 3,
    moyenne: 2,
    basse: 1,
  };

  return poids[priorite] ?? 0;
}

export function moyennePriorite(taches) {
  if (taches.length === 0) return 0;

  const totalPoids = taches.reduce((total, tache) => {
    return total + poidsPriorite(tache.priorite);
  }, 0);

  if (totalPoids === 0) return 0;

  const totalTermine = taches.reduce((total, tache) => {
    return total + (tache.terminee ? poidsPriorite(tache.priorite) : 0);
  }, 0);

  return Math.round((totalTermine / totalPoids) * 100);
}

export function pourcentageTermine(taches) {
  return moyennePriorite(taches);
}

export function trierParPriorite(taches) {
  const ordre = { haute: 1, moyenne: 2, basse: 3 };
  return [...taches].sort((a, b) => ordre[a.priorite] - ordre[b.priorite]);
}