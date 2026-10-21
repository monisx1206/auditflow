import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { errMsg } from '../api';

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ email: 'auditor@auditflow.io', password: 'audit123' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('');
    try { await login(f.email, f.password); nav('/'); } catch (x) { setErr(errMsg(x)); } finally { setBusy(false); }
  };

  return (
    <div className="login">
      <section className="login-art">
        <h1>Audit it. Fix it. Report it.</h1>
        <p>One record for audits, inspections, corrective actions and the statutory returns that depend on them.</p>
        <ul>
          <li>Non-compliances become corrective actions automatically</li>
          <li>Limit exceedances are flagged the moment a reading is saved</li>
          <li>Reports are built from the records, not retyped</li>
        </ul>
      </section>
      <form className="login-form" onSubmit={submit}>
        <h2>Sign in to AuditFlow</h2>
        <label className="field"><span>Email</span><input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required /></label>
        <label className="field"><span>Password</span><input type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required /></label>
        {err && <p className="err">{err}</p>}
        <button className="primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <p className="hint">Demo accounts after seeding: admin@auditflow.io, auditor@auditflow.io, manager@auditflow.io</p>
      </form>
    </div>
  );
}
