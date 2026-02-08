/**
 * AuthContext.jsx — Gestion de l'état d'authentification global.
 *
 * PROBLÈME : En PHP, l'état de l'utilisateur est dans $_SESSION (côté serveur).
 * Chaque page PHP y accède directement. Mais en React, il n'y a PAS de sessions
 * côté client. On doit stocker l'info "qui est connecté ?" quelque part en JavaScript.
 *
 * SOLUTION : Le "Context API" de React.
 *
 * Le Context est comme une variable globale accessible par TOUS les composants
 * de l'application, sans devoir la passer de parent en enfant manuellement.
 *
 * C'est l'équivalent React de $_SESSION en PHP :
 *   $_SESSION['username']  →  user.username
 *   $_SESSION['perm']      →  user.perm
 *   $_SESSION['classe']    →  selectedClass
 *   $_SESSION['idannee']   →  classes
 */

// --- Imports ---
import { createContext, useContext, useState, useEffect } from 'react';
// createContext : crée un "conteneur" de données global
// useContext   : permet à un composant de LIRE les données du contexte
// useState     : crée une variable réactive (quand elle change, React re-affiche le composant)
// useEffect    : exécute du code au chargement du composant (comme un "onload")

import { api, setCsrfToken, clearCsrfToken } from '../api/client';

/**
 * Création du contexte. C'est un objet "vide" qui sera rempli par le Provider.
 * Tous les composants enfants du Provider pourront lire son contenu.
 */
const AuthContext = createContext(null);

/**
 * AuthProvider — Le composant qui FOURNIT l'état d'authentification.
 *
 * Il enveloppe toute l'application (voir main.jsx) et met à disposition :
 * - user          : l'utilisateur connecté (ou null si déconnecté)
 * - classes       : la liste des classes accessibles
 * - selectedClass : l'ID de la classe sélectionnée
 * - loading       : true pendant la vérification initiale de la session
 * - login()       : fonction pour se connecter
 * - logout()      : fonction pour se déconnecter
 * - selectClass() : fonction pour choisir une classe
 *
 * @param {object} children — Tous les composants enfants (toute l'app React)
 */
export function AuthProvider({ children }) {
  /**
   * useState() crée une variable "réactive".
   *
   * Contrairement à une variable JavaScript normale (let user = null),
   * quand on appelle setUser(nouvelleValeur), React SAIT que la valeur a changé
   * et RE-AFFICHE automatiquement tous les composants qui utilisent "user".
   *
   * C'est le mécanisme fondamental de React : les données changent → l'interface se met à jour.
   *
   * Syntaxe : const [valeur, fonctionPourModifier] = useState(valeurInitiale);
   */
  const [user, setUser] = useState(null);            // L'utilisateur connecté (null = pas connecté)
  const [classes, setClasses] = useState([]);          // Liste des classes [{idannee, annee, section}, ...]
  const [selectedClass, setSelectedClass] = useState(null); // ID de la classe sélectionnée
  const [loading, setLoading] = useState(true);        // true = on vérifie encore si l'utilisateur est déjà connecté

  /**
   * useEffect() — Exécute du code UNE SEULE FOIS au chargement du composant.
   *
   * Le tableau vide [] en 2ème argument signifie "exécute ceci une seule fois,
   * quand le composant apparaît pour la première fois".
   *
   * Ici, on vérifie si l'utilisateur a déjà une session PHP active
   * (par exemple, s'il a rechargé la page sans se déconnecter).
   *
   * C'est comme si en PHP on faisait :
   *   if (isset($_SESSION['myidsession'])) { // déjà connecté }
   *
   * Sauf qu'ici c'est le navigateur qui demande au serveur "est-ce que je suis connecté ?"
   */
  useEffect(() => {
    // On appelle GET /api/v1/me pour vérifier la session
    api.get('/me')
      .then((data) => {
        // La session est active → on met à jour l'état avec les infos de l'utilisateur
        setUser(data.user);             // { iduser, username, perm }
        setClasses(data.classes);       // [{idannee, annee, section}, ...]
        setSelectedClass(data.selectedClass); // L'ID de la classe ou null
        if (data.csrf) setCsrfToken(data.csrf); // On stocke le token CSRF pour les futures requêtes
      })
      .catch(() => {
        // La session n'est pas active (erreur 401) → l'utilisateur n'est pas connecté
        setUser(null);
      })
      .finally(() => setLoading(false)); // Dans tous les cas, on a fini de vérifier
  }, []);

  /**
   * Fonction de connexion.
   * Appelée par LoginPage quand l'utilisateur soumet le formulaire.
   *
   * 1. Envoie POST /api/v1/login avec les identifiants
   * 2. Le serveur PHP vérifie le mot de passe et crée une session
   * 3. On met à jour l'état React avec les infos reçues
   */
  const login = async (username, userpwd) => {
    const data = await api.post('/login', { username, userpwd });

    setUser(data.user);           // On stocke l'utilisateur dans l'état React
    setClasses(data.classes);     // On stocke ses classes
    if (data.csrf) setCsrfToken(data.csrf); // Nouveau token CSRF après login

    // Pour les étudiants (perm === 0), on sélectionne automatiquement leur unique classe
    // (les étudiants n'ont qu'une seule classe, pas besoin de la page de choix)
    if (data.user.perm === 0 && data.classes.length > 0) {
      setSelectedClass(data.classes[0].idannee);
    }

    return data; // On retourne les données pour que LoginPage puisse décider où rediriger
  };

  /**
   * Fonction de déconnexion.
   * Appelée par le bouton "Déconnexion" dans la Navbar.
   *
   * 1. Envoie POST /api/v1/logout au serveur PHP (qui détruit la session)
   * 2. On efface tout l'état React (l'utilisateur redevient anonyme)
   * 3. On efface le token CSRF (il n'est plus valide)
   */
  const logout = async () => {
    await api.post('/logout', {});   // Détruit la session PHP
    setUser(null);                    // Plus d'utilisateur connecté
    setClasses([]);                   // Plus de classes
    setSelectedClass(null);           // Plus de classe sélectionnée
    clearCsrfToken();                 // Token CSRF invalidé
  };

  /**
   * Fonction de sélection de classe.
   * Appelée par ChoicePage quand le prof clique sur une classe.
   *
   * 1. Envoie POST /api/v1/classes/{id}/select au serveur PHP
   *    (qui stocke $_SESSION['classe'] = id)
   * 2. On met à jour l'état React
   */
  const selectClass = async (id) => {
    const data = await api.post(`/classes/${id}/select`, {});
    setSelectedClass(id);
    return data;
  };

  /**
   * Le rendu du Provider.
   *
   * <AuthContext.Provider value={...}> rend les données disponibles
   * à TOUS les composants enfants via le hook useAuth().
   *
   * {children} représente tout ce qui est imbriqué dans <AuthProvider> dans main.jsx,
   * c'est-à-dire toute l'application (<App /> et ses sous-composants).
   */
  return (
    <AuthContext.Provider value={{
      user, classes, selectedClass, loading,  // Les données (lecture)
      login, logout, selectClass,              // Les actions (écriture)
    }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook personnalisé useAuth() — Permet à n'importe quel composant
 * de LIRE l'état d'authentification.
 *
 * Utilisation dans un composant :
 *   const { user, login, logout } = useAuth();
 *
 *   if (user) {
 *     console.log(`Connecté en tant que ${user.username}`);
 *   }
 *
 * C'est l'équivalent React de lire $_SESSION en PHP,
 * sauf que c'est côté navigateur et réactif (l'affichage se met à jour automatiquement).
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
