/**
 * useApi.js — Hook personnalisé pour charger des données depuis l'API.
 *
 * En PHP, quand on veut afficher des données, on fait une requête SQL dans le contrôleur,
 * puis on passe les résultats au template Twig. C'est synchrone et direct.
 *
 * En React, c'est ASYNCHRONE : le composant s'affiche D'ABORD (vide),
 * puis les données arrivent du serveur, et le composant se RE-AFFICHE avec les données.
 *
 * Ce hook automatise ce cycle : chargement → données → erreur.
 * C'est un "raccourci" pour éviter de réécrire la même logique fetch()
 * dans chaque page.
 *
 * Utilisation dans un composant :
 *   const { data, loading, error, refetch } = useApi('/dashboard');
 *
 *   if (loading) return <Spinner />;         // Phase 1 : en cours de chargement
 *   if (error)   return <Erreur msg={error} />; // Phase 2 : erreur serveur
 *   return <Tableau data={data} />;            // Phase 3 : données reçues → on affiche
 */
import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

/**
 * @param {string} url         — L'URL de l'API à appeler (ex: '/dashboard', '/student/logs?page=2')
 * @param {object} options     — Options : { immediate: true } = appeler automatiquement au chargement
 * @returns {object}           — { data, loading, error, refetch }
 *
 * Retourne 4 choses :
 *   - data    : les données reçues du serveur (null au début)
 *   - loading : true pendant le chargement, false quand c'est terminé
 *   - error   : le message d'erreur (null s'il n'y a pas d'erreur)
 *   - refetch : une fonction pour relancer la requête (ex: après un ajout)
 */
export function useApi(url, { immediate = true } = {}) {
  // Les 3 états possibles d'une requête API :
  const [data, setData] = useState(null);           // Les données reçues
  const [loading, setLoading] = useState(immediate); // En cours de chargement ?
  const [error, setError] = useState(null);          // Message d'erreur

  /**
   * useCallback() — Mémorise la fonction pour qu'elle ne soit pas recréée
   * à chaque re-rendu. C'est une optimisation de performance.
   *
   * execute() est la fonction qui fait réellement l'appel API.
   * On peut l'appeler avec une URL différente (overrideUrl) pour
   * recharger avec des paramètres différents (ex: changer de page).
   */
  const execute = useCallback(async (overrideUrl) => {
    setLoading(true);   // On commence → on affiche le spinner
    setError(null);      // On efface l'erreur précédente

    try {
      // On appelle l'API PHP via notre client (GET /api/v1/...)
      const result = await api.get(overrideUrl || url);
      setData(result);   // Les données sont arrivées → on les stocke
      return result;
    } catch (err) {
      // Le serveur a renvoyé une erreur → on la stocke pour l'afficher
      setError(err.message);
      throw err;
    } finally {
      setLoading(false); // Dans tous les cas, le chargement est terminé
    }
  }, [url]); // [url] = recréer la fonction si l'URL change

  /**
   * useEffect() — Appel automatique de l'API au chargement du composant.
   *
   * Si immediate === true (par défaut), on lance la requête dès que
   * le composant apparaît à l'écran.
   *
   * Si l'URL change (ex: l'utilisateur clique sur un filtre de temps),
   * useEffect détecte le changement et relance automatiquement la requête.
   *
   * C'est l'équivalent de : "quand la page se charge, va chercher les données".
   */
  useEffect(() => {
    if (immediate && url) {
      execute();
    }
  }, [url, immediate, execute]);

  // On retourne les 4 éléments que le composant pourra utiliser
  return { data, loading, error, refetch: execute };
}
