/**
 * ResponseButtons.jsx — Boutons pour enregistrer la réponse d'un étudiant.
 *
 * Équivalent React des boutons "Très bien" / "Bien" / "Pas bien" / "Absent"
 * qui étaient gérés par la fonction choix() dans l'ancien app.js.
 *
 * Quand le prof clique sur un bouton :
 * 1. On envoie POST /api/v1/responses avec l'ID de l'étudiant et le score
 * 2. Le serveur PHP insère la réponse dans la table `reponseslog`
 * 3. On appelle onRecorded() → le parent (DashboardPage) recharge les données
 *
 * @param {object}   student    — L'étudiant sélectionné {idstagiaires, prenom, nom}
 * @param {number}   classeId   — L'ID de la classe
 * @param {function} onRecorded — Callback appelé après enregistrement réussi
 */
import { useState } from 'react';
import { api } from '../api/client';

// Les 4 types de réponses possibles, avec leur valeur numérique et couleur Bootstrap.
// Correspond à reponseslogcol dans la base de données :
// 0 = absent, 1 = pas bien, 2 = bien, 3 = très bien
const RESPONSES = [
  { value: 3, label: 'Tres bien', color: 'primary' },
  { value: 2, label: 'Bien', color: 'success' },
  { value: 1, label: 'Pas bien', color: 'danger' },
  { value: 0, label: 'Absent', color: 'warning' },
];

export default function ResponseButtons({ student, classeId, onRecorded }) {
  const [remarque, setRemarque] = useState('');     // Le texte de la remarque optionnelle
  const [submitting, setSubmitting] = useState(false); // true pendant l'envoi

  // Si aucun étudiant n'est sélectionné, on n'affiche rien
  if (!student) return null;

  /**
   * Envoie la réponse au serveur.
   * Appelée quand le prof clique sur un des 4 boutons.
   *
   * POST /api/v1/responses envoie :
   * - idstag  : l'ID de l'étudiant
   * - idan    : l'ID de la classe
   * - points  : la valeur de la réponse (0-3)
   * - remarque : texte optionnel
   *
   * Le token CSRF est ajouté automatiquement par api.post() (voir client.js).
   */
  const handleClick = async (points) => {
    setSubmitting(true); // Désactive les boutons pendant l'envoi
    try {
      await api.post('/responses', {
        idstag: student.idstagiaires,
        idan: classeId,
        points,
        remarque: remarque || null,
      });
      setRemarque('');             // On vide le champ remarque
      if (onRecorded) onRecorded(); // On prévient le parent → il recharge les données
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false); // On réactive les boutons
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
