import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext';
import { useFetch } from '../hooks';
import { Badge, Empty, Field, Modal, fmtDate, label, toast } from '../ui';

const TEMPLATE = [
  ['Air', 'Stack emissions monitored and within limits?'], ['Air', 'Air pollution control devices operating?'],
  ['Water', 'ETP outlet meets discharge norms?'], ['Water', 'Water meter readings recorded daily?'],
  ['Waste', 'Hazardous waste stored in labelled, covered bins?'], ['Waste', 'Manifest maintained for every waste dispatch?'],
  ['Noise', 'Noise levels within permissible limits at boundary?'], ['Records', 'Consent conditions displayed and complied with?'],
];

export default function Audits() {
  const { can } = useAuth();
  const nav = useNavigate();
  const [status, setStatus] = useState('');
  const { data, loading, reload } = useFetch(`/audits${status ? `?status=${status}` : ''}`);
  const sites = useFetch('/sites');
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ title: '', site: '', type: 'internal', scheduledDate: '', useTemplate: true });

  const save = async (e) => {
    e.preventDefault();
    try {
      const { useTemplate, ...rest } = f;
      const checklist = useTemplate ? TEMPLATE.map(([clause, question]) => ({ clause, question })) : [];
      const { data: a } = await api.post('/audits', { ...rest, checklist });
      toast('Audit scheduled'); setOpen(false); nav(`/audits/${a._id}`);
    } catch (x) { toast(errMsg(x), 'err'); }
  };

  return (
    <>
      <header className="page-head"><h1>Audits</h1>{can('admin', 'auditor') && <button className="primary" onClick={() => setOpen(true)}>Schedule audit</button>}</header>
      <div className="tabs">
        {['', 'planned', 'in_progress', 'completed'].map((s) => <button key={s} className={status === s ? 'on' : ''} onClick={() => setStatus(s)}>{s ? label(s) : 'All'}</button>)}
      </div>
      {loading ? <div className="boot">Loading…</div> : !data.items.length ? <Empty>No audits here. Schedule one and the checklist is ready to fill.</Empty> : (
        <table>
          <thead><tr><th>Audit</th><th>Site</th><th>Type</th><th>Scheduled</th><th>Status</th><th>Score</th></tr></thead>
          <tbody>{data.items.map((a) => (
            <tr key={a._id}>
              <td><Link to={`/audits/${a._id}`}><strong>{a.title}</strong></Link><small>{a.auditor?.name}</small></td>
              <td>{a.site?.code}</td><td>{label(a.type)}</td><td>{fmtDate(a.scheduledDate)}</td><td><Badge v={a.status} /></td>
              <td>{a.score != null ? `${a.score}%` : '—'}</td>
            </tr>
          ))}</tbody>
        </table>
      )}
      {open && (
        <Modal title="Schedule audit" onClose={() => setOpen(false)}>
          <form onSubmit={save} className="form">
            <Field label="Title"><input required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
            <Field label="Site"><select required value={f.site} onChange={(e) => setF({ ...f, site: e.target.value })}>
              <option value="">Choose a site</option>{sites.data?.items.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select></Field>
            <Field label="Type"><select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>
              <option value="internal">Internal</option><option value="external">External</option><option value="regulatory">Regulatory</option></select></Field>
            <Field label="Scheduled date"><input type="date" required value={f.scheduledDate} onChange={(e) => setF({ ...f, scheduledDate: e.target.value })} /></Field>
            <label className="check"><input type="checkbox" checked={f.useTemplate} onChange={(e) => setF({ ...f, useTemplate: e.target.checked })} /> Start from the standard environmental checklist</label>
            <button className="primary">Schedule audit</button>
          </form>
        </Modal>
      )}
    </>
  );
}
