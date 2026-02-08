/**
 * PieChart -- Graphique camembert des reponses.
 *
 * COMPARAISON AVEC L'ANCIEN SYSTEME (JpGraph)
 * --------------------------------------------
 * Dans l'ancienne version PHP, les graphiques etaient generes cote serveur
 * avec JpGraph : le controleur ChartController::pieData() calculait les donnees,
 * JpGraph generait une image PNG, et on l'affichait avec <img src="/chart/pie">.
 * Chaque changement de donnees necessitait un rechargement complet de l'image.
 *
 * En React, le graphique est rendu cote CLIENT dans un element <canvas> HTML5 :
 *  - Chart.js est la librairie JavaScript de graphiques (comme JpGraph mais cote client).
 *  - react-chartjs-2 est un "wrapper" React autour de Chart.js qui fournit
 *    des composants comme <Pie />, <Bar />, etc.
 *  - Le rendu est instantane et interactif (survol, animations) sans appel serveur.
 *
 * ChartJS.register() : en Chart.js v3+, il faut enregistrer explicitement
 * les modules dont on a besoin (tree-shaking). Ici on enregistre :
 *  - ArcElement : les "parts" du camembert
 *  - Tooltip : les infobulles au survol
 *  - Legend : la legende en haut du graphique
 *
 * L'objet "data" a le meme format que ce que ChartController::pieData()
 * retournait en JSON : labels + datasets[].data + datasets[].backgroundColor.
 *
 * @param {Object} props
 * @param {Object} props.stats - Statistiques globales (vgood, good, nogood, absent)
 */
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Enregistrement des modules Chart.js necessaires pour le camembert.
// Sans cet appel, Chart.js ne sait pas dessiner les arcs ni afficher les tooltips.
ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ stats }) {
  if (!stats) return null;

  // Format identique a celui que retournait ChartController::pieData() en Symfony.
  // labels = noms affiches dans la legende, data = valeurs numeriques.
  const data = {
    labels: ['Tres bien', 'Bien', 'Pas bien', 'Absent'],
    datasets: [{
      data: [stats.vgood, stats.good, stats.nogood, stats.absent],
      backgroundColor: ['#1E90FF', '#BA55D3', '#DC143C', '#ADFF2F'],
    }],
  };

  return (
    <div style={{ maxWidth: 350, margin: '0 auto' }}>
      {/* <Pie /> = composant react-chartjs-2 qui cree un <canvas> et dessine le camembert.
          Ancien equivalent : <img src="/chart/pie.png"> genere par JpGraph cote serveur. */}
      <Pie data={data} />
    </div>
  );
}
