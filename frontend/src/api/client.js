/**
 * client.js — Module centralisé pour communiquer avec l'API PHP.
 *
 * En PHP/Twig, le navigateur envoie une requête HTTP classique à chaque clic
 * et le serveur renvoie une page HTML complète.
 *
 * En React (SPA), la page ne se recharge JAMAIS. À la place, on utilise
 * fetch() pour envoyer des requêtes HTTP "en arrière-plan" (AJAX) et
 * on met à jour uniquement les parties de la page qui changent.
 *
 * Ce fichier est le "pont" entre React et le serveur PHP.
 * Tous les appels API passent par ici.
 */

// L'URL de base de toutes nos requêtes API
// En développement, Vite redirige automatiquement /api vers le serveur PHP (voir vite.config.js)
const BASE = '/api/v1';

/**
 * Variable qui stocke le token CSRF en mémoire JavaScript.
 *
 * En PHP/Twig, le token CSRF est inclus dans un champ <input hidden> du formulaire.
 * En React, on ne peut pas faire ça (il n'y a pas de formulaire HTML classique).
 * À la place, on récupère le token via l'API et on l'envoie dans un header HTTP.
 */
let csrfToken = null;

/**
 * Récupère un token CSRF depuis le serveur PHP.
 * Appelle GET /api/v1/csrf qui retourne { success: true, data: { csrf: "abc123..." } }
 *
 * credentials: 'include' → envoie le cookie de session PHP avec la requête.
 * Sans ça, le serveur PHP ne saurait pas qui on est (pas de session).
 */
async function fetchCsrf() {
  const res = await fetch(`${BASE}/csrf`, { credentials: 'include' });
  const json = await res.json();
  csrfToken = json.data.csrf;
  return csrfToken;
}

/**
 * Retourne le token CSRF en cache, ou va le chercher sur le serveur si on ne l'a pas encore.
 * Évite de faire une requête réseau à chaque appel POST.
 */
async function getCsrfToken() {
  if (csrfToken) return csrfToken;  // Déjà en mémoire → on le retourne directement
  return fetchCsrf();                // Pas encore → on le demande au serveur
}

/**
 * Efface le token CSRF de la mémoire.
 * Appelé lors de la déconnexion, car le token de l'ancienne session n'est plus valide.
 */
export function clearCsrfToken() {
  csrfToken = null;
}

/**
 * Met à jour le token CSRF en mémoire.
 * Appelé après le login, car le serveur PHP régénère le token après l'authentification.
 */
export function setCsrfToken(token) {
  csrfToken = token;
}

/**
 * Fonction centrale qui effectue TOUTES les requêtes HTTP vers l'API.
 *
 * @param {string} url     — Le chemin après /api/v1 (ex: "/dashboard", "/login")
 * @param {object} options — Options fetch() : method, headers, body, etc.
 * @returns {object}       — Les données de la réponse (le contenu de "data" dans le JSON)
 * @throws {Error}         — Si le serveur retourne une erreur
 */
async function request(url, options = {}) {
  // On prépare la configuration de la requête fetch()
  const config = {
    // credentials: 'include' → INDISPENSABLE : envoie le cookie de session PHP (PHPSESSID)
    // Sans ça, chaque requête serait vue comme un visiteur anonyme par PHP
    credentials: 'include',
    headers: {
      // On dit au serveur qu'on envoie du JSON (équivalent de Content-Type en PHP)
      'Content-Type': 'application/json',
      // On fusionne avec les headers personnalisés éventuels
      ...options.headers,
    },
    // On fusionne le reste des options (method, body, etc.)
    ...options,
  };

  // Pour les requêtes qui MODIFIENT des données (POST, PUT, DELETE),
  // on ajoute automatiquement le token CSRF dans un header HTTP.
  // C'est l'équivalent du <input type="hidden" name="_csrf"> en Twig,
  // mais envoyé dans le header au lieu du corps du formulaire.
  if (config.method === 'POST' || config.method === 'PUT' || config.method === 'DELETE') {
    const token = await getCsrfToken();
    config.headers['X-CSRF-Token'] = token;
  }

  // On envoie la requête HTTP au serveur PHP
  // Exemple : fetch('/api/v1/dashboard', { method: 'GET', credentials: 'include', ... })
  const res = await fetch(`${BASE}${url}`, config);

  // On décode la réponse JSON du serveur
  // Le serveur PHP retourne toujours : { success: true, data: {...} } ou { success: false, error: "..." }
  const json = await res.json();

  // Si la requête a échoué (code HTTP >= 400 ou success === false),
  // on lance une erreur qui sera attrapée par le composant React appelant
  if (!res.ok || !json.success) {
    throw new Error(json.error || `Erreur ${res.status}`);
  }

  // Tout va bien → on retourne uniquement la partie "data" de la réponse
  // (on n'a pas besoin de { success: true, data: ... } dans les composants React)
  return json.data;
}

/**
 * Objet exporté qui simplifie les appels API dans les composants React.
 *
 * Utilisation dans un composant :
 *   import { api } from '../api/client';
 *
 *   // Requête GET (lecture de données)
 *   const data = await api.get('/dashboard');
 *
 *   // Requête POST (envoi de données)
 *   const result = await api.post('/login', { username: 'prof', userpwd: '1234' });
 *
 * api.get()  → requête GET  (pas de corps, pas de CSRF nécessaire)
 * api.post() → requête POST (corps JSON + header CSRF automatique)
 */
export const api = {
  get: (url) => request(url),
  post: (url, body) => request(url, { method: 'POST', body: JSON.stringify(body) }),
};
