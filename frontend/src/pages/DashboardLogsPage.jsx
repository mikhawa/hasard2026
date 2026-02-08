/**
 * DashboardLogsPage.jsx — Page des logs d'activité (vue professeur).
 *
 * Équivalent React de : DashboardController::logs() + dashboard/logs.html.twig
 *
 * Affiche l'historique de toutes les réponses enregistrées pour la classe,
 * avec pagination (100 logs par page).
 *
 * La pagination fonctionne différemment de PHP :
 * - En PHP : on change l'URL (?page=2) → le serveur renvoie une nouvelle page HTML
 * - En React : on appelle refetch() avec la nouvelle page → seul le tableau se met à jour
 */
import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import Navbar from '../components/Navbar';
import LogsTable from '../components/LogsTable';
import Pagination from '../components/Pagination';

export default function DashboardLogsPage() {
  // Le numéro de page actuel (commence à 1)
  const [page, setPage] = useState(1);

  // Charge les logs depuis GET /api/v1/dashboard/logs?page=1
  const { data, loading, error, refetch } = useApi(`/dashboard/logs?page=${page}`);

  /**
   * Quand l'utilisateur clique sur un numéro de page dans la pagination :
   * 1. On met à jour le numéro de page dans l'état
   * 2. On relance la requête API avec le nouveau numéro
   * → Le tableau se met à jour instantanément, sans recharger la page
   */
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
