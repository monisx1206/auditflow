import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Toaster, label } from '../ui';

const links = [
  ['/', 'Overview'], ['/sites', 'Sites'], ['/audits', 'Audits'],
  ['/inspections', 'Inspections'], ['/capa', 'Corrective actions'], ['/reports', 'Statutory reports'],
];

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <div className="shell">
      <aside className="rail">
        <div className="brand"><span className="mark" aria-hidden="true" />AuditFlow</div>
        <nav>
          {links.map(([to, text]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>{text}</NavLink>
          ))}
        </nav>
        <div className="me">
          <strong>{user.name}</strong>
          <span>{label(user.role)}</span>
          <button className="ghost light" onClick={logout}>Sign out</button>
        </div>
      </aside>
      <main><Outlet /></main>
      <Toaster />
    </div>
  );
}
