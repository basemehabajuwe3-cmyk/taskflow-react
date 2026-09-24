import { Link } from 'react-router-dom';

export function NonTrouve() {
  return (
    <div className="page-404">
      <h1>404</h1>
      <h2>Page introuvable</h2>
      <p>La page que vous cherchez n'existe pas ou a été déplacée.</p>
      <Link to="/">Retour à l'accueil</Link>
    </div>
  );
}