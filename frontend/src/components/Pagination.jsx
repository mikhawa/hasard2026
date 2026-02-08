/**
 * Pagination -- Composant de pagination Bootstrap.
 *
 * COMPARAISON AVEC LA PAGINATION PHP
 * -----------------------------------
 * En PHP/Symfony, la pagination generait des liens HTML classiques :
 *    <a href="?page=2">2</a>
 *    <a href="?page=3">3</a>
 * Chaque clic rechargeait la page ENTIERE : nouvelle requete HTTP au serveur,
 * nouveau rendu Twig complet, renvoi de tout le HTML.
 *
 * En React, la pagination est 100% cote client :
 *  - Quand l'utilisateur clique sur un numero de page, on appelle
 *    la callback onPageChange(numeroDePage) fournie par le parent.
 *  - Le parent met a jour son state "page", ce qui declenche un nouvel
 *    appel API (fetch) pour recuperer seulement les donnees de cette page.
 *  - Seul le tableau est re-rendu -- le reste de la page ne bouge pas.
 *  - Resultat : navigation beaucoup plus rapide, pas de "flash" blanc.
 *
 * CONCEPT CLE : callback prop "onPageChange"
 * -------------------------------------------
 * Ce composant ne sait PAS comment charger les donnees. Il se contente de
 * signaler au parent : "l'utilisateur veut aller a la page X".
 * Le parent appelle alors son refetch() avec le nouveau numero de page.
 * C'est le meme pattern que onSelectStudent dans StudentTable.
 *
 * @param {Object}   props
 * @param {number}   props.currentPage  - Page actuellement affichee
 * @param {number}   props.totalPages   - Nombre total de pages
 * @param {Function} props.onPageChange - Callback appelee avec le numero de page clique
 */
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Si une seule page, pas besoin de pagination.
  if (totalPages <= 1) return null;

  // Construction du tableau [1, 2, 3, ...totalPages] pour le .map() ci-dessous.
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav>
      <ul className="pagination justify-content-center">
        {/* Bouton "Precedent" : desactive si on est deja a la page 1.
            En PHP, on aurait genere (ou pas) le lien <a href="?page=0">. */}
        <li className={`page-item${currentPage <= 1 ? ' disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>Precedent</button>
        </li>
        {/* Boucle sur les numeros de page. key={p} car chaque numero est unique.
            'active' est ajoute a la page courante (equivalent de
            {% if page == currentPage %}class="active"{% endif %} en Twig). */}
        {pages.map((p) => (
          <li key={p} className={`page-item${p === currentPage ? ' active' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(p)}>{p}</button>
          </li>
        ))}
        {/* Bouton "Suivant" : desactive si on est a la derniere page. */}
        <li className={`page-item${currentPage >= totalPages ? ' disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>Suivant</button>
        </li>
      </ul>
    </nav>
  );
}
