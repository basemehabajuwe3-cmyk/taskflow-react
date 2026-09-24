import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Connexion() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');
  const [chargement, setChargement] = useState(false);

  const { connexion } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur('');
    setSucces('');
    setChargement(true);

    try {
      const res = await fetch(
        `http://localhost:3000/utilisateurs?email=${encodeURIComponent(email)}`
      );

      if (!res.ok) {
        throw new Error('Erreur serveur');
      }

      const utilisateurs = await res.json();
      const utilisateur = utilisateurs.find(
        (u) => u.motDePasse === motDePasse
      );

      if (!utilisateur) {
        setErreur('Email ou mot de passe incorrect');
        return;
      }

      // On enregistre l'utilisateur dans le contexte
      connexion(utilisateur);

      // Message de confirmation
      setSucces(`✅ Bienvenue ${utilisateur.email}, vous êtes connecté !`);

      // Redirection après 1,5 seconde
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error(err);
      setErreur('Impossible de se connecter. Vérifie que le serveur est lancé.');
    } finally {
      setChargement(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Connexion</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Mot de passe"
        value={motDePasse}
        onChange={(e) => setMotDePasse(e.target.value)}
        required
      />

      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
      {succes && <p style={{ color: 'green' }}>{succes}</p>}

      <button type="submit" disabled={chargement}>
        {chargement ? 'Connexion...' : 'Se connecter'}
      </button>

      <p>
        Pas de compte ? <Link to="/inscription">S'inscrire</Link>
      </p>
    </form>
  );
}

export default Connexion;

