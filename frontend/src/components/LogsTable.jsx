const RESPONSE_LABELS = {
  0: 'Absent',
  1: 'Pas bien',
  2: 'Bien',
  3: 'Tres bien',
};

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
                <span className={`badge bg-${RESPONSE_COLORS[log.reponseslogcol] || 'secondary'}`}>
                  {RESPONSE_LABELS[log.reponseslogcol] || log.reponseslogcol}
                </span>
              </td>
              <td>{log.remarque || '-'}</td>
              <td>{log.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
