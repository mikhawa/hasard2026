/**
 * ChoicePage.jsx — Page de sélection de classe.
 *
 * Équivalent React de : ChoiceController::index() + choice/index.html.twig
 *
 * Affiche les classes accessibles au professeur sous forme de cartes.
 * Quand le prof clique sur une carte, on appelle l'API pour sélectionner
 * la classe, puis on redirige vers le dashboard.
 *
 * Les données (liste des classes) viennent du contexte Auth,
 * car elles ont été chargées lors du login.
 * Pas besoin d'appel API supplémentaire ici.
 */
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function ChoicePage() {
  // On lit la liste des classes depuis le contexte Auth (chargée au login)
  const { classes, selectClass } = useAuth();
  const navigate = useNavigate();

  /**
   * Appelée quand le prof clique sur "Sélectionner" pour une classe.
   *
   * 1. selectClass(id) envoie POST /api/v1/classes/{id}/select au serveur
   *    → Le serveur PHP stocke $_SESSION['classe'] = id
   * 2. navigate('/dashboard') redirige vers le dashboard (sans recharger la page)
   */
  const handleSelect = async (id) => {
    await selectClass(id);   // Appel API + mise à jour du contexte Auth
    navigate('/dashboard');   // Redirection côté client
  };

  /**
   * Le rendu de la page.
   *
   * <> ... </> est un "Fragment" : un conteneur invisible qui permet de
   * retourner plusieurs éléments sans ajouter de <div> supplémentaire dans le HTML.
   *
   * classes.map() est l'équivalent de {% for c in classes %} en Twig.
   * Pour chaque classe dans le tableau, on génère une carte Bootstrap.
   *
   * key={c.idannee} : React a BESOIN d'un identifiant unique pour chaque élément
   * d'une liste, pour savoir lequel mettre à jour quand les données changent.
   * C'est obligatoire dans toute boucle .map() en React.
   *
   * onClick={() => handleSelect(c.idannee)} : quand on clique, on appelle
   * handleSelect avec l'ID de la classe. La syntaxe () => est une "fonction fléchée"
   * qui permet de passer un argument à la fonction.
   */
  return (
    <>
      <Navbar baseUrl="/choice" showTimeFilters={false} showChangeClass={false} />
      <div className="container mt-4">
        <h2 className="mb-4">Choisissez une classe</h2>
        <div className="row">
          {classes.map((c) => (
            <div className="col-md-4 mb-3" key={c.idannee}>
              <div className="card">
                <div className="card-body text-center">
                  <h5 className="card-title">{c.section}</h5>
                  <p className="card-text">{c.annee}</p>
                  <button className="btn btn-primary" onClick={() => handleSelect(c.idannee)}>
                    Selectionner
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
