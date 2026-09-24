import { API_BASE_URL } from './config';

const API_URL = `${API_BASE_URL}/taches`;

export async function getTaches(projetId) {
  const url = new URL(API_URL);
  if (projetId) url.searchParams.set('projetId', projetId);

  const res = await fetch(url);
  if (!res.ok) throw new Error('Erreur chargement des tâches');

  return res.json();
}

export async function creerTache(data) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Erreur création de la tâche');

  return res.json();
}

export async function supprimerTache(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erreur suppression de la tâche');
}

export async function modifierTache(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Erreur modification de la tâche');

  return res.json();
}