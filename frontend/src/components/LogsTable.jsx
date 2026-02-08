/**
 * LogsTable -- Tableau des logs d'activite (historique des reponses).
 *
 * CONCEPT CLE 1 : les "maps" de correspondance (RESPONSE_LABELS / RESPONSE_COLORS)
 * ---------------------------------------------------------------------------------
 * En base de donnees, la colonne reponseslogcol stocke un chiffre (0, 1, 2, 3).
 * En PHP/Twig, on aurait peut-etre fait un switch/case ou un tableau associatif :
 *    $labels = [0 => 'Absent', 1 => 'Pas bien', ...];
 *    echo $labels[$log->getReponseslogcol()];
 *
 * En JavaScript, c'est le meme principe avec un objet :
 *    RESPONSE_LABELS[log.reponseslogcol]
 * Ces objets sont declares en dehors du composant car ils ne changent jamais
 * (constantes). Pas besoin de les recreer a chaque rendu.
 *
 * CONCEPT CLE 2 : l'operateur || (valeur par defaut)
 * ---------------------------------------------------
 * {log.remarque || '-'} affiche la remarque si elle existe,
 * sinon affiche un tiret.
 * Equivalent Twig : {{ log.remarque ?: '-' }}
 * Equivalent PHP : $log->getRemarque() ?: '-'
 *
 * Le meme principe est utilise pour les couleurs :
 * RESPONSE_COLORS[log.reponseslogcol] || 'secondary'
 * = si la valeur n'est pas dans la map, on utilise 'secondary' comme couleur par defaut.
 *
 * @param {Object} props
 * @param {Array}  props.logs - Liste des logs (idreponseslog, reponseslogdate, prenom, nom, etc.)
 */

// Map de correspondance : code numerique -> texte lisible
// Equivalent PHP : const RESPONSE_LABELS = [0 => 'Absent', 1 => 'Pas bien', ...];
const RESPONSE_LABELS = {
  0: 'Absent',
  1: 'Pas bien',
  2: 'Bien',
  3: 'Tres bien',
};

// Map de correspondance : code numerique -> classe de couleur Bootstrap
// Utilise pour les badges : <span class="badge bg-warning">, etc.
const RESPONSE_COLORS = {
  0: 'warning',
  1: 'danger',
  2: 'success',
  3: 'primary',
};

export default function LogsTable({ logs }) {
  if (!logs || logs.length === 0) return <p>Aucun log.</p>;

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Stagiaire</th>
            <th>Reponse</th>
            <th>Remarque</th>
            <th>Prof</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.idreponseslog}>
              <td>{log.idreponseslog}</td>
              <td>{log.reponseslogdate}</td>
              <td>{log.prenom} {log.nom}</td>
              <td>
                {/* Template literal pour construire la classe CSS dynamiquement.
                    Equivalent Twig : class="badge bg-{{ colors[log.reponseslogcol] ?? 'secondary' }}" */}
                <span className={`badge bg-${RESPONSE_COLORS[log.reponseslogcol] || 'secondary'}`}>
                  {RESPONSE_LABELS[log.reponseslogcol] || log.reponseslogcol}
                </span>
              </td>
              {/* log.remarque || '-' = affiche '-' si remarque est vide/null.
                  Equivalent Twig : {{ log.remarque ?: '-' }} */}
              <td>{log.remarque || '-'}</td>
              <td>{log.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
