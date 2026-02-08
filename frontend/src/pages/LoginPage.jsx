/**
 * LoginPage.jsx — Page de connexion.
 *
 * Équivalent React de : AuthController::showLogin() + AuthController::login() + auth/login.html.twig
 *
 * En PHP/Twig :
 *   1. GET /  → le serveur affiche le formulaire HTML
 *   2. L'utilisateur remplit et clique "Connexion"
 *   3. POST / → le serveur vérifie les identifiants et fait un redirect()
 *   4. La page ENTIÈRE se recharge
 *
 * En React :
 *   1. Le composant s'affiche avec un formulaire vide
 *   2. L'utilisateur tape → React met à jour les variables username/userpwd EN TEMPS RÉEL
 *   3. Au clic "Connexion" → on envoie un POST fetch() en arrière-plan (pas de rechargement)
 *   4. Si OK → navigate() change l'URL sans recharger la page
 *   5. Si erreur → on affiche le message dans la même page
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  /**
   * Les variables d'état du formulaire.
   *
   * En HTML classique, les valeurs des <input> vivent dans le DOM.
   * En React, on les stocke dans des variables d'état (useState).
   * Quand l'utilisateur tape, onChange met à jour la variable,
   * et React re-affiche l'input avec la nouvelle valeur.
   *
   * C'est le pattern "composant contrôlé" : React contrôle la valeur de l'input.
   */
  const [username, setUsername] = useState('');    // Valeur du champ "nom d'utilisateur"
  const [userpwd, setUserpwd] = useState('');      // Valeur du champ "mot de passe"
  const [error, setError] = useState(null);        // Message d'erreur (null = pas d'erreur)
  const [submitting, setSubmitting] = useState(false); // true pendant l'envoi → désactive le bouton

  // On récupère la fonction login() depuis le contexte d'authentification
  const { login } = useAuth();

  // useNavigate() retourne une fonction pour changer l'URL programmatiquement
  // C'est l'équivalent de $this->redirect('/dashboard') en PHP
  const navigate = useNavigate();

  /**
   * Fonction appelée quand l'utilisateur soumet le formulaire.
   *
   * e.preventDefault() empêche le comportement par défaut du <form>
   * (qui serait d'envoyer une requête HTTP et de recharger la page).
   * En React, on gère l'envoi nous-mêmes avec fetch().
   */
  const handleSubmit = async (e) => {
    e.preventDefault();     // Empêche le rechargement de la page
    setError(null);          // On efface l'erreur précédente
    setSubmitting(true);     // On désactive le bouton pendant l'envoi

    try {
      // On appelle la fonction login() du contexte Auth
      // qui fait POST /api/v1/login en arrière-plan
      const data = await login(username, userpwd);
      const perm = data.user.perm;

      // Redirection selon le rôle (même logique que redirectBasedOnPermission() en PHP)
      if (perm === 0) {
        navigate('/student');       // Étudiant → page étudiant
      } else if (data.classes.length === 1) {
        navigate('/dashboard');     // Prof avec 1 seule classe → dashboard directement
      } else {
        navigate('/choice');        // Prof avec plusieurs classes → choix de classe
      }
    } catch (err) {
      // Le serveur a renvoyé une erreur (mauvais identifiants, CSRF invalide, etc.)
      // On affiche le message d'erreur dans la page
      setError(err.message);
    } finally {
      setSubmitting(false);  // On réactive le bouton dans tous les cas
    }
  };

  /**
   * Le JSX ci-dessous est le "template" de la page.
   *
   * JSX = HTML écrit directement dans le JavaScript.
   * C'est l'équivalent du fichier Twig auth/login.html.twig.
   *
   * Différences avec Twig :
   * - class → className (car "class" est un mot réservé en JavaScript)
   * - {{ variable }} → {variable} (accolades simples, pas doubles)
   * - style="..." → style={{ propriété: valeur }} (objet JavaScript)
   * - onSubmit, onChange, onClick → événements gérés directement en JSX
   *
   * {error && <div>...</div>} = "si error n'est pas null, affiche le div"
   * C'est l'équivalent de {% if error %} ... {% endif %} en Twig.
   */
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="text-center mb-4">
            <img src="/img/logo.png" alt="Hasard 2026" style={{ maxWidth: 200 }} />
          </div>
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-3">Connexion</h3>

              {/* Affichage conditionnel de l'erreur (équivalent de {% if error %} en Twig) */}
              {error && <div className="alert alert-danger">{error}</div>}

              {/* onSubmit : quand le formulaire est soumis, on appelle handleSubmit */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  {/* value={username} : l'input affiche toujours la valeur de la variable */}
                  {/* onChange : à chaque frappe, on met à jour la variable username */}
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Mot de passe"
                    value={userpwd}
                    onChange={(e) => setUserpwd(e.target.value)}
                    required
                  />
                </div>
                {/* disabled={submitting} : le bouton est grisé pendant l'envoi */}
                {/* Le texte change dynamiquement : "Connexion..." ou "Se connecter" */}
                <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                  {submitting ? 'Connexion...' : 'Se connecter'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
