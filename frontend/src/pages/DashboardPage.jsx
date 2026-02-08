import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
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
  const { key } = useParams();
  const url = key ? `/dashboard/temps/${key}` : '/dashboard';
  const { data, loading, error, refetch } = useApi(url);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleNewRandom = useCallback(async () => {
    try {
      const result = await api.get('/random-student');
      setSelectedStudent(result);
    } catch (err) {
      alert(err.message);
    }
  }, []);

  const handleRecorded = useCallback(() => {
    refetch();
    handleNewRandom();
  }, [refetch, handleNewRandom]);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;
  if (!data) return null;

  const currentStudent = selectedStudent || data.randomStudent;

  return (
    <>
      <Navbar
        baseUrl="/dashboard"
        timeFilters={data.timeFilter.available}
        currentTime={data.timeFilter.key}
        showTimeFilters
        showChangeClass
      />
      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-md-8">
            <h4>{data.class.section} - {data.class.year}</h4>
            <p>Filtre : {data.timeFilter.label}</p>

            <StatsCard stats={data.stats} />

            <RandomStudent student={currentStudent} onRefresh={handleNewRandom} />
            <ResponseButtons
              student={currentStudent}
              classeId={data.class.id}
              onRecorded={handleRecorded}
            />

            <StudentTable
              students={data.students}
              stats={data.stats}
              onSelectStudent={setSelectedStudent}
            />
          </div>
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
