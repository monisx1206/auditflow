import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Sites from './pages/Sites';
import Audits from './pages/Audits';
import AuditDetail from './pages/AuditDetail';
import Inspections from './pages/Inspections';
import Capas from './pages/Capas';
import Reports from './pages/Reports';

function Private({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return <div className="boot">Loading…</div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Private><Layout /></Private>}>
        <Route index element={<Dashboard />} />
        <Route path="sites" element={<Sites />} />
        <Route path="audits" element={<Audits />} />
        <Route path="audits/:id" element={<AuditDetail />} />
        <Route path="inspections" element={<Inspections />} />
        <Route path="capa" element={<Capas />} />
        <Route path="reports" element={<Reports />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
