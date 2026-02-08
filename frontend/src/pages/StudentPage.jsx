/**
 * StudentPage.jsx — Page de la vue étudiant (lecture seule).
 *
 * Équivalent React de : StudentController::index() + student/index.html.twig
 *
 * Cette page est similaire au DashboardPage, mais en version lecture seule :
 * - Pas de tirage au hasard
 * - Pas de boutons de réponse
 * - Deux classements : par points et par sorties
 *
 * Accessible uniquement aux utilisateurs avec perm=0 (étudiants),
 * grâce au <ProtectedRoute requiredPerm={0}> dans App.jsx.
 */
import { useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import StudentTable from '../components/StudentTable';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';

export default function StudentPage() {
  // Récupère le filtre de temps depuis l'URL (ex: "1-mois")
  const { key } = useParams();
  const url = key ? `/student/temps/${key}` : '/student';

  // Charge les données depuis GET /api/v1/student[/temps/{key}]
  const { data, loading, error } = useApi(url);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;
  if (!data) return null;

  return (
    <>
      <Navbar
        baseUrl="/student"
        timeFilters={data.timeFilter.available}
        currentTime={data.timeFilter.key}
        showTimeFilters
        showChangeClass={false}
      />
      <div className="container-fluid mt-3">
        <h4>Filtre : {data.timeFilter.label}</h4>

        <StatsCard stats={data.stats} />

        <div className="row">
          <div className="col-md-8">
            <h5>Classement par points</h5>
            <StudentTable students={data.studentsByPoints} stats={data.stats} />

            <h5 className="mt-4">Classement par sorties</h5>
            <StudentTable students={data.studentsBySorties} stats={data.stats} />
          </div>
          <div className="col-md-4">
            <PieChart stats={data.stats} />
            <BarChart students={data.studentsByPoints} title="Top points" dataKey="points" />
          </div>
        </div>
      </div>
    </>
  );
}
