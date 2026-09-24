import { API_BASE_URL } from './config';

const API_URL = `${API_BASE_URL}/projets`;

export async function getProjets(utilisateurId) {
  const url = new URL(API_URL);
  if (utilisateurId) url.searchParams.set('utilisateurid', utilisateurId);
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Erreur chargement projets');
  }

  return res.json();
}

export async function getProjet(id) {
  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    throw new Error('Projet introuvable');
  }

  return res.json();
}

export async function creerProjet(data) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Erreur création du projet');
  }

  return res.json();
}

export async function modifierProjet(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Erreur modification du projet');
  }

  return res.json();
}

export async function supprimerProjet(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Erreur suppression du projet');
  }
}
