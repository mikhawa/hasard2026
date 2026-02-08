/**
 * Navbar.jsx — Barre de navigation réutilisable.
 *
 * Équivalent React de : templates/partials/navbar.html.twig
 *
 * Ce composant est utilisé par TOUTES les pages (Dashboard, Student, Choice, Logs).
 * Il s'adapte grâce aux "props" (paramètres) qu'on lui passe :
 *
 * @param {string}  baseUrl         — URL de base ("/dashboard" ou "/student")
 * @param {array}   timeFilters     — Liste des filtres [{key, label}, ...]
 * @param {string}  currentTime     — Le filtre actuellement actif (ex: "1-mois")
 * @param {boolean} showTimeFilters — Afficher les filtres de temps ?
 * @param {boolean} showChangeClass — Afficher le bouton "Changer de classe" ?
 *
 * <Link> est le composant react-router-dom pour créer des liens.
 * Contrairement à <a href="...">, il ne recharge PAS la page.
 * Il change juste l'URL et React affiche le bon composant.
 * C'est ce qui rend la navigation instantanée dans un SPA.
 */
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ baseUrl, timeFilters, currentTime, showTimeFilters, showChangeClass }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Déconnexion : appel API + redirection vers le login
  const handleLogout = async () => {
    await logout();       // POST /api/v1/logout → détruit la session PHP
    navigate('/login');   // Redirige vers la page de login (côté client)
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light justify-content-md-end" style={{ backgroundColor: '#e3f2fd' }}>
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">

          {/* Affichage conditionnel des filtres de temps */}
          {/* Équivalent Twig : {% if show_time_filters|default(false) %} */}
          {showTimeFilters && timeFilters && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {/* Boucle sur les filtres — Équivalent : {% for filter in time_filters %} */}
              {timeFilters.map((filter) => (
                <li className="nav-item" key={filter.key}>
                  {/* <Link> au lieu de <a> : navigation SPA sans rechargement */}
                  {/* La classe "active" est ajoutée si ce filtre est le filtre courant */}
                  <Link
                    className={`nav-link${currentTime === filter.key ? ' active' : ''}`}
                    to={filter.key === 'tous' ? baseUrl : `${baseUrl}/temps/${filter.key}`}
                  >
                    {filter.label}
                  </Link>
                </li>
              ))}
              <li className="nav-item">
                <Link className="nav-link" to={`${baseUrl}/logs`}>logs</Link>
              </li>
            </ul>
          )}
          {/* Spacer vide si pas de filtres (pour garder le layout Bootstrap) */}
          {!showTimeFilters && <span className="navbar-nav me-auto mb-2 mb-lg-0"></span>}

          {/* Bouton "Changer de classe" (affiché seulement pour les profs) */}
          {showChangeClass && (
            <Link to="/choice" className="px-2">
              <button type="button" className="btn btn-primary">Changer de classe</button>
            </Link>
          )}

          {/* Bouton de déconnexion — onClick appelle handleLogout */}
          <button type="button" className="btn btn-primary" onClick={handleLogout}>
            Deconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}
