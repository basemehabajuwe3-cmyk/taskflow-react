export function Modale({ ouverte, onFermer, children }) {
  if (!ouverte) return null;
  return (
   <div className="modale-overlay" onClick={onFermer}>
  <div className="modale-contenu" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}