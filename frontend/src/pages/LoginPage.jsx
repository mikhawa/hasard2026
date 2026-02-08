import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [userpwd, setUserpwd] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const data = await login(username, userpwd);
      const perm = data.user.perm;

      if (perm === 0) {
        navigate('/student');
      } else if (data.classes.length === 1) {
        navigate('/dashboard');
      } else {
        navigate('/choice');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="text-center mb-4">
            <img src="/img/logo.png" alt="Hasard 2026" style={{ maxWidth: 200 }} />
          </div>
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-3">Connexion</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Mot de passe"
                    value={userpwd}
                    onChange={(e) => setUserpwd(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                  {submitting ? 'Connexion...' : 'Se connecter'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
