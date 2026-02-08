/**
 * ProtectedRoute.jsx — Garde de sécurité pour les routes protégées.
 *
 * C'est l'équivalent React de $this->requireAuth() et du contrôle
 * de permission ($_SESSION['perm']) dans les contrôleurs PHP.
 *
 * En PHP, si l'utilisateur n'est pas connecté, on fait un redirect('/').
 * En React, on affiche <Navigate to="/login" /> qui change l'URL sans recharger la page.
 *
 * Utilisation dans App.jsx :
 *   <Route path="/dashboard" element={
 *     <ProtectedRoute>         ← Vérifie l'auth
 *       <DashboardPage />       ← Affiché seulement si connecté
 *     </ProtectedRoute>
 *   } />
 *
 *   <Route path="/student" element={
 *     <ProtectedRoute requiredPerm={0}>  ← Vérifie auth + permission étudiant
 *       <StudentPage />
 *     </ProtectedRoute>
 *   } />
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * @param {ReactNode} children     — Le composant enfant à afficher si l'accès est autorisé
 * @param {number}    requiredPerm — (optionnel) La permission requise (0=étudiant, 1=prof)
 */
export default function ProtectedRoute({ children, requiredPerm }) {
  // On lit l'état d'authentification depuis le contexte global
  const { user, loading } = useAuth();

  // Phase 1 : On vérifie encore si l'utilisateur est connecté (appel /api/v1/me en cours)
  // → On affiche un spinner Bootstrap en attendant
  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" /></div>;
  }

  // Phase 2 : L'utilisateur n'est PAS connecté → on le redirige vers le login
  // "replace" remplace l'URL dans l'historique (comme un redirect 302 en PHP)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Phase 3 : L'utilisateur est connecté mais n'a pas la bonne permission
  // Ex: un prof (perm=1) essaie d'accéder à /student (requiredPerm=0)
  // → On le redirige vers la page qui correspond à son rôle
  if (requiredPerm !== undefined && user.perm !== requiredPerm) {
    return <Navigate to={user.perm === 0 ? '/student' : '/dashboard'} replace />;
  }

  // Phase 4 : Tout est OK → on affiche le composant enfant (la page demandée)
  // "children" = ce qui est entre <ProtectedRoute> et </ProtectedRoute> dans App.jsx
  return children;
}
