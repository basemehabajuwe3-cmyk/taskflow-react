import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000';


const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function Inscription() {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [erreur, setErreur] = useState('');
  const [erreursChamps, setErreursChamps] = useState({});
  const [chargement, setChargement] = useState(false);

  const navigate = useNavigate();
 const { connexion } = useAuth();


  const abortRef = useRef(null);
  const monteRef = useRef(true);

  useEffect(() => {
    monteRef.current = true;
    return () => {
      monteRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  // Validation centralisée
  function valider() {
    const errs = {};
    if (!nom.trim()) errs.nom = 'Le nom est obligatoire.';
    else if (nom.trim().length < 2) errs.nom = 'Le nom est trop court.';

    if (!email.trim()) errs.email = "L'email est obligatoire.";
    else if (!EMAIL_REGEX.test(email.trim())) errs.email = 'Adresse email invalide.';

    if (!motDePasse) errs.motDePasse = 'Le mot de passe est obligatoire.';
    else if (motDePasse.length < 8) errs.motDePasse = 'Au moins 8 caractères.';
    else if (!/[A-Z]/.test(motDePasse) || !/[0-9]/.test(motDePasse))
      errs.motDePasse = 'Doit contenir une majuscule et un chiffre.';

    if (motDePasse !== confirmation)
      errs.confirmation = 'Les mots de passe ne correspondent pas.';

    setErreursChamps(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (chargement) return; // Anti double-soumission
    setErreur('');

    if (!valider()) return;

    setChargement(true);

    // Timeout de 15s
    const controller = new AbortController();
    abortRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
     const reponse = await fetch(`${API_URL}/utilisateurs`,  {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: nom.trim(),
          email: email.trim().toLowerCase(),
          motDePasse,
        }),
        signal: controller.signal,
      });

      const donnees = await reponse.json().catch(() => ({}));

      if (!reponse.ok) {
        if (monteRef.current) {
          setErreur(donnees.message || "Échec de l'inscription. Réessayez.");
        }
        return;
      }

      // Vérifie que la réponse contient bien ce qu'on attend
      if (!donnees?.id) {
  if (monteRef.current) setErreur('Réponse du serveur invalide.');
  return;
}
 connexion(donnees);
navigate('/', { replace: true });
    } catch (err) {
      if (err.name === 'AbortError') {
        if (monteRef.current) setErreur('La requête a expiré. Réessayez.');
      } else {
        if (monteRef.current) setErreur('Impossible de contacter le serveur.');
        if (import.meta.env?.DEV) console.error(err);
      }
    } finally {
      clearTimeout(timeoutId);
      if (monteRef.current) setChargement(false);
    }
  }

  return (
    <div className="inscription-container">
      <h1>Créer un compte</h1>

      <form onSubmit={handleSubmit} noValidate aria-busy={chargement}>
        <div className="champ">
          <label htmlFor="nom">Nom</label>
          <input
            id="nom"
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Votre nom"
            disabled={chargement}
            autoComplete="name"
            aria-invalid={!!erreursChamps.nom}
            aria-describedby={erreursChamps.nom ? 'err-nom' : undefined}
          />
          {erreursChamps.nom && (
            <p id="err-nom" className="erreur-champ" role="alert">
              {erreursChamps.nom}
            </p>
          )}
        </div>

        <div className="champ">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="basemehabajuwe3@gmail.com"
            disabled={chargement}
            autoComplete="email"
            aria-invalid={!!erreursChamps.email}
            aria-describedby={erreursChamps.email ? 'err-email' : undefined}
          />
          {erreursChamps.email && (
            <p id="err-email" className="erreur-champ" role="alert">
              {erreursChamps.email}
            </p>
          )}
        </div>

        <div className="champ">
          <label htmlFor="motDePasse">Mot de passe</label>
          <input
            id="motDePasse"
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            placeholder="Au moins 8 caractères, 1 majuscule, 1 chiffre"
            disabled={chargement}
            autoComplete="new-password"
            aria-invalid={!!erreursChamps.motDePasse}
            aria-describedby={erreursChamps.motDePasse ? 'err-mdp' : undefined}
          />
          {erreursChamps.motDePasse && (
            <p id="err-mdp" className="erreur-champ" role="alert">
              {erreursChamps.motDePasse}
            </p>
          )}
        </div>

        <div className="champ">
          <label htmlFor="confirmation">Confirmer ici</label>
          <input
            id="confirmation"
            type="password"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder="Répétez le mot de passe"
            disabled={chargement}
            autoComplete="new-password"
            aria-invalid={!!erreursChamps.confirmation}
            aria-describedby={erreursChamps.confirmation ? 'err-conf' : undefined}
          />
          {erreursChamps.confirmation && (
            <p id="err-conf" className="erreur-champ" role="alert">
              {erreursChamps.confirmation}
            </p>
          )}
        </div>

        {erreur && (
          <p className="erreur" role="alert">
            {erreur}
          </p>
        )}

        <button type="submit" disabled={chargement}>
          {chargement ? 'Inscription en cours...' : "S'inscrire"}
        </button>
      </form>

      <p>
        Vous avez déjà un compte ? <Link to="/connexion">Se connecter</Link>
      </p>
    </div>
  );
}
export default Inscription;