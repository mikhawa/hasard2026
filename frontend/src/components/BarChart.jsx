/**
 * BarChart -- Graphique en barres, reutilisable pour differentes donnees.
 *
 * Meme principe que PieChart mais pour les barres horizontales/verticales.
 * Utilise react-chartjs-2 (wrapper React) + Chart.js (moteur de rendu canvas).
 *
 * CONCEPT CLE 1 : [...students] -- copie du tableau avant tri
 * ------------------------------------------------------------
 * En React, il y a une regle fondamentale : NE JAMAIS MODIFIER (muter) le state
 * directement. Si on faisait students.sort(), on modifierait le tableau original
 * qui est dans le state du parent, ce qui causerait des bugs subtils
 * (React ne detecterait pas le changement, re-rendus inattendus, etc.).
 *
 * [...students] utilise l'operateur "spread" pour creer une COPIE du tableau.
 * On trie ensuite la copie sans toucher a l'original.
 * Equivalent PHP : $sorted = $students; usort($sorted, ...);
 *
 * CONCEPT CLE 2 : la prop "dataKey" rend le composant reutilisable
 * -----------------------------------------------------------------
 * Au lieu de creer BarChartPoints et BarChartSorties (deux composants quasi identiques),
 * on passe le nom du champ a afficher via la prop "dataKey" :
 *    <BarChart dataKey="points" title="Points" />
 *    <BarChart dataKey="sorties" title="Sorties" />
 * s[dataKey] est l'equivalent PHP de $s[$dataKey] -- acces dynamique a une propriete.
 *
 * @param {Object}  props
 * @param {Array}   props.students - Liste des stagiaires
 * @param {string}  props.title    - Titre du graphique
 * @param {string}  props.dataKey  - Nom du champ a utiliser ('points' ou 'sorties')
 */
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';

// Enregistrement des modules Chart.js pour les barres :
// CategoryScale = axe X (noms), LinearScale = axe Y (chiffres),
// BarElement = les barres elles-memes, Title = titre du graphique.
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export default function BarChart({ students, title, dataKey }) {
  if (!students || students.length === 0) return null;

  // [...students] = copie du tableau (spread operator) pour ne PAS muter le state.
  // .sort() trie la copie par ordre decroissant selon la valeur de dataKey.
  const sorted = [...students].sort((a, b) => b[dataKey] - a[dataKey]);

  const data = {
    labels: sorted.map((s) => `${s.prenom} ${s.nom.charAt(0)}.`),
    datasets: [{
      label: title,
      // s[dataKey] : acces dynamique -- si dataKey="points", ca lit s.points.
      data: sorted.map((s) => s[dataKey]),
      backgroundColor: '#1E90FF',
    }],
  };

  const options = {
    responsive: true,
    plugins: { title: { display: true, text: title } },
  };

  return <Bar data={data} options={options} />;
}
