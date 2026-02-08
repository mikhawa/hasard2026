import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ChoicePage from './pages/ChoicePage';
import DashboardPage from './pages/DashboardPage';
import DashboardLogsPage from './pages/DashboardLogsPage';
import StudentPage from './pages/StudentPage';
import StudentLogsPage from './pages/StudentLogsPage';

function RedirectHome() {
  const { user, selectedClass } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.perm === 0) return <Navigate to="/student" replace />;
  if (!selectedClass) return <Navigate to="/choice" replace />;
  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<RedirectHome />} />

      <Route path="/choice" element={
        <ProtectedRoute><ChoicePage /></ProtectedRoute>
      } />

      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      } />
      <Route path="/dashboard/temps/:key" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      } />
      <Route path="/dashboard/logs" element={
        <ProtectedRoute><DashboardLogsPage /></ProtectedRoute>
      } />

      <Route path="/student" element={
        <ProtectedRoute requiredPerm={0}><StudentPage /></ProtectedRoute>
      } />
      <Route path="/student/temps/:key" element={
        <ProtectedRoute requiredPerm={0}><StudentPage /></ProtectedRoute>
      } />
      <Route path="/student/logs" element={
        <ProtectedRoute requiredPerm={0}><StudentLogsPage /></ProtectedRoute>
      } />

      <Route path="*" element={<RedirectHome />} />
    </Routes>
  );
}
