import { useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext';
import { useFetch } from '../hooks';
import { Empty, Field, Modal, daysFrom, fmtDate, toast } from '../ui';

export default function Sites() {
  const { can } = useAuth();
  const { data, loading, reload } = useFetch('/sites');
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: '', code: '', industry: '', location: '', consentValidTill: '' });

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.post('/sites', { ...f, consentValidTill: f.consentValidTill || undefined });
      toast('Site added'); setOpen(false); setF({ name: '', code: '', industry: '', location: '', consentValidTill: '' }); reload();
    } catch (x) { toast(errMsg(x), 'err'); }
  };

  return (
    <>
      <header className="page-head"><h1>Sites</h1>{can('admin') && <button className="primary" onClick={() => setOpen(true)}>Add site</button>}</header>
      {loading ? <div className="boot">Loading…</div> : !data.items.length ? <Empty>No sites yet. Add the first plant or unit to start auditing.</Empty> : (
        <table>
          <thead><tr><th>Site</th><th>Industry</th><th>Location</th><th>Manager</th><th>Consent valid till</th></tr></thead>
          <tbody>{data.items.map((s) => {
            const d = s.consentValidTill ? daysFrom(s.consentValidTill) : null;
            return (
              <tr key={s._id}>
                <td><strong>{s.name}</strong><small>{s.code}</small></td><td>{s.industry}</td><td>{s.location}</td><td>{s.manager?.name || '—'}</td>
                <td>{fmtDate(s.consentValidTill)}{d != null && d <= 60 && <span className={`badge ${d < 0 ? 'red' : 'amber'}`}>{d < 0 ? 'Expired' : `${d} days left`}</span>}</td>
              </tr>
            );
          })}</tbody>
        </table>
      )}
      {open && (
        <Modal title="Add site" onClose={() => setOpen(false)}>
          <form onSubmit={save} className="form">
            <Field label="Site name"><input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
            <Field label="Site code"><input required value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} placeholder="e.g. NTU-01" /></Field>
            <Field label="Industry"><input value={f.industry} onChange={(e) => setF({ ...f, industry: e.target.value })} /></Field>
            <Field label="Location"><input value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} /></Field>
            <Field label="Consent valid till"><input type="date" value={f.consentValidTill} onChange={(e) => setF({ ...f, consentValidTill: e.target.value })} /></Field>
            <button className="primary">Save site</button>
          </form>
        </Modal>
      )}
    </>
  );
}
