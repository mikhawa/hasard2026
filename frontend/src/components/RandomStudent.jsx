export default function RandomStudent({ student, onRefresh }) {
  if (!student) return null;

  return (
    <div className="card mb-3 border-primary">
      <div className="card-body text-center">
        <h5 className="card-title">Stagiaire au hasard</h5>
        <p className="card-text fs-3">
          <strong>{student.prenom} {student.nom}</strong>
        </p>
        <button className="btn btn-outline-primary" onClick={onRefresh}>
          Nouveau tirage
        </button>
      </div>
    </div>
  );
}
