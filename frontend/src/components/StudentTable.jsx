/**
 * StudentTable -- Tableau des stagiaires avec leurs statistiques.
 *
 * CONCEPT CLE 1 : la boucle avec .map()
 * --------------------------------------
 * En Twig, pour parcourir une liste on ecrit :
 *    {% for student in students %}
 *      <tr>{{ student.nom }}</tr>
 *    {% endfor %}
 *
 * En React/JSX, l'equivalent est :
 *    {students.map((s) => <tr>{s.nom}</tr>)}
 * .map() retourne un nouveau tableau de JSX, que React affiche.
 *
 * CONCEPT CLE 2 : l'attribut key
 * -------------------------------
 * React exige un attribut key={valeurUnique} sur chaque element d'une liste.
 * Cela permet a React de savoir quel element a change, a ete ajoute ou supprime
 * sans avoir a re-rendre toute la liste (optimisation du "virtual DOM").
 * Ici, key={s.idstagiaires} utilise l'ID unique en base de donnees.
 * Il n'y a pas d'equivalent Twig : Twig regenere tout le HTML a chaque requete.
 *
 * CONCEPT CLE 3 : les "callback props" (onSelectStudent)
 * -------------------------------------------------------
 * En PHP/Symfony, quand on clique sur un bouton on envoie une requete HTTP
 * au serveur (formulaire POST ou lien GET). Le serveur decide quoi faire.
 *
 * En React, le parent passe une FONCTION en tant que prop :
 *    <StudentTable onSelectStudent={maFonction} />
 * Quand l'utilisateur clique sur "Choisir", le composant enfant appelle
 * cette fonction avec le stagiaire concerne : onSelectStudent(s).
 * C'est le parent qui decide quoi faire (enregistrer la reponse, etc.).
 * On appelle ca un "callback prop" -- le parent donne les ordres,
 * l'enfant se contente de signaler l'evenement.
 *
 * CONCEPT CLE 4 : affichage conditionnel {onSelectStudent && <th>Action</th>}
 * ----------------------------------------------------------------------------
 * Equivalent Twig : {% if onSelectStudent is defined %}<th>Action</th>{% endif %}
 * Si onSelectStudent est null/undefined (le parent ne l'a pas passe),
 * la colonne "Action" et les boutons "Choisir" ne s'affichent pas.
 * Cela rend le composant reutilisable : avec ou sans selection.
 *
 * @param {Object}   props
 * @param {Array}    props.students        - Liste des stagiaires
 * @param {Object}   props.stats           - Stats globales (non utilise directement ici)
 * @param {Function} [props.onSelectStudent] - Callback optionnel appele quand on clique "Choisir"
 */
export default function StudentTable({ students, stats, onSelectStudent }) {
  if (!students || students.length === 0) return <p>Aucun stagiaire.</p>;

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Nom</th>
            <th>Points</th>
            <th>Tres bien</th>
            <th>Bien</th>
            <th>Pas bien</th>
            <th>Absent</th>
            <th>Sorties</th>
            <th>% sorties</th>
            {/* Affichage conditionnel : la colonne n'apparait que si le parent
                a fourni la callback onSelectStudent. Equivalent Twig :
                {% if onSelectStudent is defined %}<th>Action</th>{% endif %} */}
            {onSelectStudent && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {/* .map() = equivalent de {% for s in students %} en Twig.
              key={s.idstagiaires} = identifiant unique pour chaque ligne,
              indispensable pour que React optimise le re-rendu de la liste. */}
          {students.map((s, i) => (
            <tr key={s.idstagiaires}>
              <th scope="row">{i + 1}</th>
              <td>{s.prenom} {s.nom.charAt(0)}.</td>
              <td>{s.points}</td>
              <td>{s.vgood} ({s.vgood_pct}%)</td>
              <td>{s.good} ({s.good_pct}%)</td>
              <td>{s.nogood} ({s.nogood_pct}%)</td>
              <td>{s.absent} ({s.absent_pct}%)</td>
              <td>{s.sorties}</td>
              <td>{s.sortie_pct}%</td>
              {onSelectStudent && (
                <td>
                  {/* onClick appelle la callback du parent avec le stagiaire s.
                      Equivalent ancien : un <form action="/reponse"> avec un champ hidden. */}
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onSelectStudent(s)}
                  >
                    Choisir
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
