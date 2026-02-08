export default function StudentTable({ students, stats, onSelectStudent }) {
  if (!students || students.length === 0) return <p>Aucun stagiaire.</p>;

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Nom</th>
            <th>Points</th>
            <th>Tres bien</th>
            <th>Bien</th>
            <th>Pas bien</th>
            <th>Absent</th>
            <th>Sorties</th>
            <th>% sorties</th>
            {onSelectStudent && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={s.idstagiaires}>
              <th scope="row">{i + 1}</th>
              <td>{s.prenom} {s.nom.charAt(0)}.</td>
              <td>{s.points}</td>
              <td>{s.vgood} ({s.vgood_pct}%)</td>
              <td>{s.good} ({s.good_pct}%)</td>
              <td>{s.nogood} ({s.nogood_pct}%)</td>
              <td>{s.absent} ({s.absent_pct}%)</td>
              <td>{s.sorties}</td>
              <td>{s.sortie_pct}%</td>
              {onSelectStudent && (
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onSelectStudent(s)}
                  >
                    Choisir
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
