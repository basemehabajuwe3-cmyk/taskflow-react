import { useEffect, useState } from 'react';
import { getProjet, modifierProjet } from '../api/projets';
import {
    getTaches,
    creerTache,
    supprimerTache,
    modifierTache,
} from '../api/taches';

export function useTaches(projetId) {
    const [taches, setTaches] = useState([]);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState(null);

    useEffect(() => {
        if (!projetId) {
            setTaches([]);
            setChargement(false);
            return;
        }

        async function chargerTaches() {
            try {
                setChargement(true);
                setErreur(null);

                const data = await getTaches(projetId);
                setTaches(data.filter((tache) => String(tache.projetId) === String(projetId)));
            } catch (err) {
                console.error('Erreur chargement des tâches:', err);
                setErreur('Impossible de charger les tâches.');
                setTaches([]);
            } finally {
                setChargement(false);
            }
        }

        chargerTaches();
    }, [projetId]);

    async function synchroniserCompteurProjet(nouveauTotal) {
        if (!projetId) return;

        try {
            const projetActuel = await getProjet(projetId);
            await modifierProjet(projetId, {
                ...projetActuel,
                nbTaches: nouveauTotal,
            });
        } catch (err) {
            console.error('Erreur synchronisation du compteur du projet:', err);
        }
    }

    async function ajouter(tache) {
        try {
            setErreur(null);

            const nouvelleTache = await creerTache({
                ...tache,
                projetId: String(projetId),
            });

            const prochaines = [
                ...taches,
                { ...nouvelleTache, projetId: String(projetId) },
            ];

            setTaches(prochaines);
            await synchroniserCompteurProjet(prochaines.length);

            return nouvelleTache;
        } catch (err) {
            console.error('Erreur ajout de la tâche:', err);
            setErreur("Impossible d'ajouter la tâche.");
            throw err;
        }
    }

    async function supprimer(id) {
        try {
            setErreur(null);

            await supprimerTache(id);

            const prochaines = taches.filter(
                (tache) => String(tache.id) !== String(id),
            );

            setTaches(prochaines);
            await synchroniserCompteurProjet(prochaines.length);
        } catch (err) {
            console.error('Erreur suppression de la tâche:', err);
            setErreur('Impossible de supprimer la tâche.');
            throw err;
        }
    }

    async function toggle(id) {
        try {
            setErreur(null);
            const tache = taches.find((element) => String(element.id) === String(id));
            if (!tache) return;

            const tacheModifiee = await modifierTache(id, {
                terminee: !tache.terminee,
            });

            setTaches((precedentes) => precedentes.map((element) =>
                String(element.id) === String(id) ? tacheModifiee : element,
            ));
            return tacheModifiee;
        } catch (err) {
            console.error('Erreur modification de la tâche:', err);
            setErreur('Impossible de modifier la tâche.');
            throw err;
        }
    }

    return {
        taches,
        chargement,
        erreur,
        ajouter,
        supprimer,
        toggle,
    };
}


