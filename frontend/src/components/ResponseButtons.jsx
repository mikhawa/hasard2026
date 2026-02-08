import { useState } from 'react';
import { api } from '../api/client';

const RESPONSES = [
  { value: 3, label: 'Tres bien', color: 'primary' },
  { value: 2, label: 'Bien', color: 'success' },
  { value: 1, label: 'Pas bien', color: 'danger' },
  { value: 0, label: 'Absent', color: 'warning' },
];

export default function ResponseButtons({ student, classeId, onRecorded }) {
  const [remarque, setRemarque] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!student) return null;

  const handleClick = async (points) => {
    setSubmitting(true);
    try {
      await api.post('/responses', {
        idstag: student.idstagiaires,
        idan: classeId,
        points,
        remarque: remarque || null,
      });
      setRemarque('');
      if (onRecorded) onRecorded();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h6>Reponse de {student.prenom} {student.nom} :</h6>
        <div className="d-flex gap-2 mb-2">
          {RESPONSES.map((r) => (
            <button
              key={r.value}
              className={`btn btn-${r.color}`}
              disabled={submitting}
              onClick={() => handleClick(r.value)}
            >
              {r.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          className="form-control"
          placeholder="Remarque (optionnel)"
          value={remarque}
          onChange={(e) => setRemarque(e.target.value)}
        />
      </div>
    </div>
  );
}
