/**
 * App.jsx — Composant racine qui définit TOUTES les routes de l'application.
 *
 * C'est l'équivalent du fichier Router.php côté PHP.
 *
 * DIFFÉRENCE FONDAMENTALE avec PHP :
 * - En PHP (FastRoute), le serveur reçoit l'URL, trouve le bon contrôleur, et renvoie du HTML.
 * - En React (react-router-dom), le navigateur intercepte l'URL AVANT qu'elle n'aille au serveur,
 *   et affiche le bon composant React SANS recharger la page.
 *
 * Résultat : la navigation est instantanée (pas de flash blanc entre les pages).
 */

// --- Imports ---
import { Routes, Route, Navigate } from 'react-router-dom';
// Routes   : conteneur qui regroupe toutes les routes
// Route    : définit une route (URL → composant)
// Navigate : redirige vers une autre URL (équivalent de header('Location: ...') en PHP)

import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ChoicePage from './pages/ChoicePage';
import DashboardPage from './pages/DashboardPage';
import DashboardLogsPage from './pages/DashboardLogsPage';
import StudentPage from './pages/StudentPage';
import StudentLogsPage from './pages/StudentLogsPage';

/**
 * RedirectHome — Composant de redirection intelligente.
 *
 * Quand l'utilisateur accède à "/" (la racine) ou une URL inconnue,
 * ce composant décide où le rediriger en fonction de son état.
 *
 * C'est l'équivalent de AuthController::redirectBasedOnPermission() en PHP.
 *
 * - Pas connecté       → page de login
 * - Étudiant (perm=0)  → page étudiant
 * - Prof sans classe   → page de choix de classe
 * - Prof avec classe   → dashboard
 */
function RedirectHome() {
  const { user, selectedClass } = useAuth(); // On lit l'état d'authentification

  if (!user) return <Navigate to="/login" replace />;
  if (user.perm === 0) return <Navigate to="/student" replace />;
  if (!selectedClass) return <Navigate to="/choice" replace />;
  return <Navigate to="/dashboard" replace />;
}

/**
 * App — Le composant principal qui contient le "plan" de toutes les routes.
 *
 * Chaque <Route> associe un chemin (path) à un composant React (element).
 *
 * Les routes sont protégées par <ProtectedRoute> qui vérifie :
 * 1. Que l'utilisateur est connecté (sinon → /login)
 * 2. Optionnellement, qu'il a la bonne permission (requiredPerm)
 *
 * ":key" dans "/dashboard/temps/:key" est un PARAMÈTRE DYNAMIQUE.
 * C'est l'équivalent de "{key}" dans FastRoute.
 * Exemple : /dashboard/temps/1-mois → key = "1-mois"
 * Le composant DashboardPage récupère cette valeur avec useParams().
 *
 * "*" (la dernière route) capture TOUTES les URLs qui ne correspondent
 * à aucune route définie → on redirige vers l'accueil.
 */
export default function App() {
  return (
    <Routes>
      {/* Route publique : page de login (accessible sans être connecté) */}
      <Route path="/login" element={<LoginPage />} />

      {/* Route racine : redirige intelligemment selon l'état de l'utilisateur */}
      <Route path="/" element={<RedirectHome />} />

      {/* Route protégée : choix de la classe (profs uniquement) */}
      <Route path="/choice" element={
        <ProtectedRoute><ChoicePage /></ProtectedRoute>
      } />

      {/* Routes protégées : dashboard prof */}
      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      } />
      {/* Même composant DashboardPage, mais avec un filtre de temps dans l'URL */}
      <Route path="/dashboard/temps/:key" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      } />
      <Route path="/dashboard/logs" element={
        <ProtectedRoute><DashboardLogsPage /></ProtectedRoute>
      } />

      {/* Routes protégées : vue étudiant (requiredPerm={0} = étudiants seulement) */}
      <Route path="/student" element={
        <ProtectedRoute requiredPerm={0}><StudentPage /></ProtectedRoute>
      } />
      <Route path="/student/temps/:key" element={
        <ProtectedRoute requiredPerm={0}><StudentPage /></ProtectedRoute>
      } />
      <Route path="/student/logs" element={
        <ProtectedRoute requiredPerm={0}><StudentLogsPage /></ProtectedRoute>
      } />

      {/* Toute URL non reconnue → redirection vers l'accueil */}
      <Route path="*" element={<RedirectHome />} />
    </Routes>
  );
}
