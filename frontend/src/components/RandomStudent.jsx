/**
 * RandomStudent -- Composant d'affichage simple pour le tirage au sort.
 *
 * COMPARAISON AVEC L'ANCIEN SYSTEME
 * ----------------------------------
 * Dans l'ancienne version PHP, le tirage au hasard etait fait via un appel
 * AJAX dans app.js : on faisait un fetch('/ajax/random') et on injectait
 * le resultat dans le DOM avec innerHTML.
 *
 * En React, c'est plus propre :
 *  - Le parent (la page) fait l'appel API et stocke le resultat dans son state.
 *  - Il passe le stagiaire tire au sort via la prop "student".
 *  - Il passe aussi une fonction "onRefresh" que ce composant appelle
 *    quand l'utilisateur clique sur "Nouveau tirage".
 *  - Le parent refait alors l'appel API, met a jour son state,
 *    et React re-rend automatiquement ce composant avec le nouveau stagiaire.
 *
 * onRefresh est une "callback prop" : ce composant ne sait PAS comment
 * tirer un nouveau stagiaire. Il dit juste au parent "l'utilisateur veut
 * un nouveau tirage" et le parent s'en occupe.
 *
 * @param {Object}   props
 * @param {Object}   props.student   - Le stagiaire tire au sort (prenom, nom)
 * @param {Function} props.onRefresh - Callback appelee au clic sur "Nouveau tirage"
 */
export default function RandomStudent({ student, onRefresh }) {
  // Garde : tant que le stagiaire n'est pas charge, on n'affiche rien.
  if (!student) return null;

  return (
    <div className="card mb-3 border-primary">
      <div className="card-body text-center">
        <h5 className="card-title">Stagiaire au hasard</h5>
        <p className="card-text fs-3">
          <strong>{student.prenom} {student.nom}</strong>
        </p>
        {/* onClick={onRefresh} : quand on clique, on appelle la fonction
            du parent qui va refaire un appel API pour tirer un nouveau stagiaire.
            Ancien equivalent : le $.ajax() dans app.js. */}
        <button className="btn btn-outline-primary" onClick={onRefresh}>
          Nouveau tirage
        </button>
      </div>
    </div>
  );
}
