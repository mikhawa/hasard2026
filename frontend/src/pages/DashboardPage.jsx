/**
 * DashboardPage.jsx — Page principale du tableau de bord professeur.
 *
 * Équivalent React de : DashboardController::index() + dashboard/index.html.twig
 *
 * C'est la page la plus complexe de l'application. Elle affiche :
 * - Les statistiques globales de la classe
 * - Un étudiant tiré au hasard
 * - Les boutons pour enregistrer une réponse
 * - Le tableau de tous les étudiants
 * - Les graphiques (camembert + barres)
 *
 * FLUX DE DONNÉES (comparaison PHP vs React) :
 *
 * En PHP :
 *   1. Le contrôleur fait des requêtes SQL
 *   2. Il passe les résultats à Twig : $this->render('dashboard/index.html.twig', [...])
 *   3. Twig génère le HTML et l'envoie au navigateur
 *
 * En React :
 *   1. Le composant s'affiche VIDE (avec un spinner)
 *   2. useApi() envoie GET /api/v1/dashboard au serveur PHP
 *   3. Le serveur PHP fait les mêmes requêtes SQL et retourne du JSON
 *   4. React reçoit le JSON et RE-AFFICHE la page avec les données
 */
import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
// useParams() : récupère les paramètres dynamiques de l'URL
// Ex: /dashboard/temps/1-mois → { key: '1-mois' }
// C'est l'équivalent de $key dans DashboardController::index(string $key)

import { useApi } from '../hooks/useApi';
import { api } from '../api/client';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import StudentTable from '../components/StudentTable';
import RandomStudent from '../components/RandomStudent';
import ResponseButtons from '../components/ResponseButtons';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';

export default function DashboardPage() {
  // Récupère le paramètre :key de l'URL (ex: "1-mois" dans /dashboard/temps/1-mois)
  // Si l'URL est /dashboard (sans filtre), key sera undefined
  const { key } = useParams();

  // On construit l'URL de l'API en fonction du filtre de temps
  const url = key ? `/dashboard/temps/${key}` : '/dashboard';

  // useApi() fait automatiquement GET /api/v1/dashboard[/temps/key] au chargement
  // et retourne { data, loading, error, refetch }
  const { data, loading, error, refetch } = useApi(url);

  // L'étudiant actuellement sélectionné (par le tirage au hasard ou par clic dans le tableau)
  const [selectedStudent, setSelectedStudent] = useState(null);

  /**
   * Tire un nouvel étudiant au hasard.
   * Appelle GET /api/v1/random-student.
   *
   * useCallback() mémorise la fonction pour éviter de la recréer à chaque rendu.
   * C'est une optimisation : les composants enfants qui reçoivent cette fonction
   * en prop ne se re-affichent pas inutilement.
   */
  const handleNewRandom = useCallback(async () => {
    try {
      const result = await api.get('/random-student');
      setSelectedStudent(result); // Met à jour l'étudiant affiché
    } catch (err) {
      alert(err.message);
    }
  }, []);

  /**
   * Appelée après qu'une réponse a été enregistrée (clic sur un bouton "Très bien", etc.)
   *
   * 1. refetch() : recharge les données du dashboard (les stats ont changé)
   * 2. handleNewRandom() : tire un nouvel étudiant au hasard
   *
   * C'est l'équivalent de la fonction onLoadPage() dans l'ancien app.js
   * qui rechargait les sections de la page après une action.
   */
  const handleRecorded = useCallback(() => {
    refetch();          // Recharge GET /api/v1/dashboard
    handleNewRandom();  // Tire un nouvel étudiant
  }, [refetch, handleNewRandom]);

  // --- Gestion des 3 états possibles ---

  // État 1 : Les données sont en cours de chargement → afficher un spinner
  if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;

  // État 2 : Une erreur s'est produite → afficher le message d'erreur
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  // État 3 : Pas de données (cas improbable) → rien à afficher
  if (!data) return null;

  // L'étudiant à afficher : celui sélectionné manuellement, ou celui du tirage initial
  const currentStudent = selectedStudent || data.randomStudent;

  /**
   * Le rendu de la page.
   *
   * On compose la page en assemblant des composants React réutilisables,
   * comme des briques LEGO. Chaque composant reçoit ses données via des "props"
   * (paramètres passés comme des attributs HTML).
   *
   * En Twig, on passerait ces données via le 2ème argument de $this->render().
   * En React, on les passe comme attributs : <StatsCard stats={data.stats} />
   *
   * Les callbacks (onRefresh, onRecorded, onSelectStudent) sont des fonctions
   * que le composant enfant appellera quand un événement se produit.
   * C'est le mécanisme de communication enfant → parent en React.
   */
  return (
    <>
      {/* Barre de navigation avec les filtres de temps */}
      <Navbar
        baseUrl="/dashboard"
        timeFilters={data.timeFilter.available}
        currentTime={data.timeFilter.key}
        showTimeFilters
        showChangeClass
      />
      <div className="container-fluid mt-3">
        <div className="row">
          {/* Colonne principale (8/12 de la largeur) */}
          <div className="col-md-8">
            <h4>{data.class.section} - {data.class.year}</h4>
            <p>Filtre : {data.timeFilter.label}</p>

            {/* Bloc des statistiques globales de la classe */}
            <StatsCard stats={data.stats} />

            {/* Carte de l'étudiant tiré au hasard + bouton "Nouveau tirage" */}
            <RandomStudent student={currentStudent} onRefresh={handleNewRandom} />

            {/* Boutons "Très bien" / "Bien" / "Pas bien" / "Absent" */}
            {/* onRecorded sera appelé après l'enregistrement → recharge les données */}
            <ResponseButtons
              student={currentStudent}
              classeId={data.class.id}
              onRecorded={handleRecorded}
            />

            {/* Tableau de tous les étudiants avec leurs stats */}
            {/* onSelectStudent : quand on clique "Choisir" sur un étudiant */}
            <StudentTable
              students={data.students}
              stats={data.stats}
              onSelectStudent={setSelectedStudent}
            />
          </div>

          {/* Colonne latérale (4/12) avec les graphiques */}
          <div className="col-md-4">
            <PieChart stats={data.stats} />
            <BarChart students={data.students} title="Top points" dataKey="points" />
            <BarChart students={data.students} title="Top sorties" dataKey="sorties" />
          </div>
        </div>
      </div>
    </>
  );
}
