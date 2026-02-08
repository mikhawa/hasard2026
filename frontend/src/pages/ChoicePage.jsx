import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function ChoicePage() {
  const { classes, selectClass, user } = useAuth();
  const navigate = useNavigate();

  const handleSelect = async (id) => {
    await selectClass(id);
    navigate('/dashboard');
  };

  return (
    <>
      <Navbar baseUrl="/choice" showTimeFilters={false} showChangeClass={false} />
      <div className="container mt-4">
        <h2 className="mb-4">Choisissez une classe</h2>
        <div className="row">
          {classes.map((c) => (
            <div className="col-md-4 mb-3" key={c.idannee}>
              <div className="card">
                <div className="card-body text-center">
                  <h5 className="card-title">{c.section}</h5>
                  <p className="card-text">{c.annee}</p>
                  <button className="btn btn-primary" onClick={() => handleSelect(c.idannee)}>
                    Selectionner
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
