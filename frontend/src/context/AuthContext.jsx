import { createContext, useContext, useState, useEffect } from 'react';
import { api, setCsrfToken, clearCsrfToken } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if already logged in on mount
  useEffect(() => {
    api.get('/me')
      .then((data) => {
        setUser(data.user);
        setClasses(data.classes);
        setSelectedClass(data.selectedClass);
        if (data.csrf) setCsrfToken(data.csrf);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, userpwd) => {
    const data = await api.post('/login', { username, userpwd });
    setUser(data.user);
    setClasses(data.classes);
    if (data.csrf) setCsrfToken(data.csrf);
    // Auto-select for students
    if (data.user.perm === 0 && data.classes.length > 0) {
      setSelectedClass(data.classes[0].idannee);
    }
    return data;
  };

  const logout = async () => {
    await api.post('/logout', {});
    setUser(null);
    setClasses([]);
    setSelectedClass(null);
    clearCsrfToken();
  };

  const selectClass = async (id) => {
    const data = await api.post(`/classes/${id}/select`, {});
    setSelectedClass(id);
    return data;
  };

  return (
    <AuthContext.Provider value={{
      user, classes, selectedClass, loading,
      login, logout, selectClass,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
