import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ baseUrl, timeFilters, currentTime, showTimeFilters, showChangeClass }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light justify-content-md-end" style={{ backgroundColor: '#e3f2fd' }}>
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {showTimeFilters && timeFilters && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {timeFilters.map((filter) => (
                <li className="nav-item" key={filter.key}>
                  <Link
                    className={`nav-link${currentTime === filter.key ? ' active' : ''}`}
                    to={filter.key === 'tous' ? baseUrl : `${baseUrl}/temps/${filter.key}`}
                  >
                    {filter.label}
                  </Link>
                </li>
              ))}
              <li className="nav-item">
                <Link className="nav-link" to={`${baseUrl}/logs`}>logs</Link>
              </li>
            </ul>
          )}
          {!showTimeFilters && <span className="navbar-nav me-auto mb-2 mb-lg-0"></span>}

          {showChangeClass && (
            <Link to="/choice" className="px-2">
              <button type="button" className="btn btn-primary">Changer de classe</button>
            </Link>
          )}

          <button type="button" className="btn btn-primary" onClick={handleLogout}>
            Deconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}
