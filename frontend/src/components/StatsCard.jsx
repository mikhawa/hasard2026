export default function StatsCard({ stats }) {
  if (!stats) return null;

  return (
    <div className="card mb-3">
      <div className="card-body">
        <p>Nombre de questions : <strong>{stats.sorties}</strong></p>
        <p>Tres bonnes reponses : <strong>{stats.vgood} ({stats.vgood_pct}%)</strong></p>
        <p>Bonnes reponses : <strong>{stats.good} ({stats.good_pct}%)</strong></p>
        <p>Mauvaises reponses : <strong>{stats.nogood} ({stats.nogood_pct}%)</strong></p>
        <p>Absences : <strong>{stats.absent} ({stats.absent_pct}%)</strong></p>
      </div>
    </div>
  );
}
