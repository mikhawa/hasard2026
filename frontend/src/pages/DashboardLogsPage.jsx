import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import Navbar from '../components/Navbar';
import LogsTable from '../components/LogsTable';
import Pagination from '../components/Pagination';

export default function DashboardLogsPage() {
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = useApi(`/dashboard/logs?page=${page}`);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    refetch(`/dashboard/logs?page=${newPage}`);
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;
  if (!data) return null;

  return (
    <>
      <Navbar baseUrl="/dashboard" showTimeFilters={false} showChangeClass />
      <div className="container-fluid mt-3">
        <h4>Logs - {data.stats?.section} {data.stats?.annee}</h4>
        <p>Total : {data.pagination.totalLogs} logs</p>

        <LogsTable logs={data.logs} />
        <Pagination
          currentPage={data.pagination.currentPage}
          totalPages={data.pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}
