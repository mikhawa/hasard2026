/**
 * StatsCard -- Composant d'affichage "pur" (presentational component).
 *
 * CONCEPT CLE : les "props"
 * -------------------------
 * En Symfony/Twig, le controleur passe des variables au template :
 *    return $this->render('stats.html.twig', ['stats' => $stats]);
 * puis dans Twig on ecrit {{ stats.sorties }}.
 *
 * En React, c'est exactement le meme principe :
 *  - Le composant parent passe les donnees via des "props" (proprietes).
 *  - Ici, { stats } dans la signature de la fonction equivaut a
 *    "extraire la prop stats de l'objet props".
 *  - Dans le JSX, {stats.sorties} est l'equivalent de {{ stats.sorties }} en Twig.
 *
 * Ce composant ne gere AUCUN etat interne (pas de useState) :
 * il recoit des donnees, il les affiche -- point final.
 * C'est ce qu'on appelle un composant "pur" ou "presentationnel".
 *
 * @param {Object} props
 * @param {Object} props.stats - Objet statistiques (vgood, good, nogood, absent, sorties, etc.)
 */
export default function StatsCard({ stats }) {
  // Garde : si stats n'est pas encore charge (appel API en cours), on n'affiche rien.
  if (!stats) return null;

  return (
    <div className="card mb-3">
      <div className="card-body">
        {/* {stats.sorties} = equivalent de {{ stats.sorties }} en Twig */}
        <p>Nombre de questions : <strong>{stats.sorties}</strong></p>
        <p>Tres bonnes reponses : <strong>{stats.vgood} ({stats.vgood_pct}%)</strong></p>
        <p>Bonnes reponses : <strong>{stats.good} ({stats.good_pct}%)</strong></p>
        <p>Mauvaises reponses : <strong>{stats.nogood} ({stats.nogood_pct}%)</strong></p>
        <p>Absences : <strong>{stats.absent} ({stats.absent_pct}%)</strong></p>
      </div>
    </div>
  );
}
