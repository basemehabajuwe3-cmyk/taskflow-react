import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(null);
  const [chargement, setChargement] = useState(true);

  // Restaurer l'utilisateur depuis localStorage au démarrage
  useEffect(() => {
    const stocke = localStorage.getItem('utilisateur');
    if (stocke) {
      try {
        setUtilisateur(JSON.parse(stocke));
      } catch {
        localStorage.removeItem('utilisateur');
      }
    }
    setChargement(false);
  }, []);

  function connexion(user) {
    setUtilisateur(user);
    localStorage.setItem('utilisateur', JSON.stringify(user));
  }

  function deconnexion() {
    setUtilisateur(null);
    localStorage.removeItem('utilisateur');
  }

  return (
    <AuthContext.Provider
      value={{ utilisateur, chargement, connexion, deconnexion }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return ctx;
}