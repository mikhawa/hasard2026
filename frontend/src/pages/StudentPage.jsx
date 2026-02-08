import { useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import StudentTable from '../components/StudentTable';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';

export default function StudentPage() {
  const { key } = useParams();
  const url = key ? `/student/temps/${key}` : '/student';
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
