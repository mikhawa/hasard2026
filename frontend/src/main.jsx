/**
 * main.jsx — Point d'entrée de l'application React.
 *
 * C'est l'équivalent du "public/index.php" côté PHP :
 * c'est ici que tout démarre.
 *
 * React fonctionne en "montant" un arbre de composants dans un élément HTML
 * (la <div id="root"> dans index.html). Chaque composant imbriqué est comme
 * une poupée russe : le plus extérieur enveloppe les suivants.
 */

// --- Imports des bibliothèques ---
import React from 'react';              // La bibliothèque React elle-même
import ReactDOM from 'react-dom/client'; // Le "moteur" qui injecte React dans le DOM HTML
import { BrowserRouter } from 'react-router-dom'; // Le routeur côté client (gère les URLs sans recharger la page)
import App from './App';                 // Notre composant racine (contient toutes les routes)
import { AuthProvider } from './context/AuthContext'; // Le "contexte" d'authentification (état global partagé)
import 'bootstrap/dist/css/bootstrap.min.css';       // Le CSS Bootstrap (importé une seule fois ici)

/**
 * ReactDOM.createRoot() : crée un point d'ancrage React dans le DOM.
 * On lui passe l'élément <div id="root"> de index.html.
 *
 * .render() : lance le rendu de l'arbre de composants.
 *
 * L'ordre d'imbrication est important, de l'extérieur vers l'intérieur :
 *
 * 1. <React.StrictMode>  → Mode développement qui affiche des avertissements
 *                            supplémentaires (désactivé automatiquement en production)
 *
 * 2. <BrowserRouter>     → Active le routage côté client. Sans lui, les <Link>
 *                            et <Route> de react-router-dom ne fonctionneraient pas.
 *                            Il intercepte les changements d'URL et met à jour
 *                            l'affichage SANS recharger la page (contrairement à PHP
 *                            où chaque URL = une requête serveur complète).
 *
 * 3. <AuthProvider>      → Fournit l'état d'authentification (user, classes, etc.)
 *                            à TOUS les composants enfants via le "Context API" de React.
 *                            C'est comme une variable de session PHP, mais côté JavaScript.
 *
 * 4. <App />             → Le composant principal qui contient la définition
 *                            de toutes les routes (quel composant afficher pour quelle URL).
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
