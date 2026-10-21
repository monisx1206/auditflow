import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext';
import { useFetch } from '../hooks';
import { Badge, Empty, Field, Modal, daysFrom, fmtDate, label, toast } from '../ui';

const NEXT = { open: ['in_progress'], in_progress: ['pending_verification'], pending_verification: ['closed', 'in_progress'], overdue: ['in_progress'], closed: [] };
const VERB = { in_progress: 'Start work', pending_verification: 'Submit for verification', closed: 'Verify and close' };

function Detail({ id, onChanged, onClose }) {
  const { can } = useAuth();
  const { data: c, reload } = useFetch(`/capas/${id}`);
  const users = useFetch('/users');
  const [f, setF] = useState(null);
  const [note, setNote] = useState('');
  useEffect(() => { if (c) setF({ rootCause: c.rootCause || '', correctiveAction: c.correctiveAction || '', preventiveAction: c.preventiveAction || '', assignedTo: c.assignedTo?._id || '', dueDate: c.dueDate?.slice(0, 10) }); }, [c]);
  if (!c || !f) return null;

  const done = () => { reload(); onChanged(); };
  const save = async (status) => {
    try {
      await api.put(`/capas/${id}`, { ...f, assignedTo: f.assignedTo || undefined, ...(status ? { status, note } : {}) });
      toast(status ? `Moved to ${label(status).toLowerCase()}` : 'Saved'); setNote(''); done();
    } catch (e) { toast(errMsg(e), 'err'); }
  };
  const upload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const fd = new FormData(); fd.append('file', file);
    try { await api.post(`/capas/${id}/evidence`, fd); toast('Evidence attached'); done(); } catch (x) { toast(errMsg(x), 'err'); }
  };
  const closed = c.status === 'closed';
  const moves = NEXT[c.status].filter((s) => !(s === 'closed' && !can('admin', 'auditor')));

  return (
    <Modal title={`${c.code} · ${c.title}`} onClose={onClose} wide>
      <p className="sub"><Badge v={c.status} /> <Badge v={c.severity} /> {c.site?.name} · due {fmtDate(c.dueDate)}</p>
      {c.description && <pre className="desc">{c.description}</pre>}
      <div className="form">
        <div className="row">
          <Field label="Assigned to"><select disabled={closed} value={f.assignedTo} onChange={(e) => setF({ ...f, assignedTo: e.target.value })}>
            <option value="">Unassigned</option>{users.data?.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}</select></Field>
          <Field label="Due date"><input type="date" disabled={closed || !can('admin', 'auditor')} value={f.dueDate} onChange={(e) => setF({ ...f, dueDate: e.target.value })} /></Field>
        </div>
        <Field label="Root cause"><textarea rows="2" disabled={closed} value={f.rootCause} onChange={(e) => setF({ ...f, rootCause: e.target.value })} /></Field>
        <Field label="Corrective action (fixes this instance)"><textarea rows="2" disabled={closed} value={f.correctiveAction} onChange={(e) => setF({ ...f, correctiveAction: e.target.value })} /></Field>
        <Field label="Preventive action (stops it recurring)"><textarea rows="2" disabled={closed} value={f.preventiveAction} onChange={(e) => setF({ ...f, preventiveAction: e.target.value })} /></Field>

        <div className="evidence">
          <strong>Evidence</strong>
          {c.evidence.length === 0 && <span className="muted">No files attached.</span>}
          {c.evidence.map((ev, i) => <a key={i} href={ev.path} target="_blank" rel="noreferrer">{ev.filename}</a>)}
          {!closed && <input type="file" onChange={upload} />}
        </div>

        {!closed && (
          <>
            <Field label="Note for the record (optional)"><input value={note} onChange={(e) => setNote(e.target.value)} /></Field>
            <div className="actions"><button onClick={() => save()}>Save changes</button>
              {moves.map((s) => <button key={s} className={s === 'closed' ? 'primary' : ''} onClick={() => save(s)}>{s === 'in_progress' && c.status === 'pending_verification' ? 'Send back' : VERB[s]}</button>)}</div>
          </>
        )}
      </div>
      <h4>History</h4>
      <ul className="history">{[...c.history].reverse().map((h, i) => <li key={i}><time>{fmtDate(h.at)}</time><span>{h.action}{h.note ? ` — ${h.note}` : ''}</span></li>)}</ul>
    </Modal>
  );
}

export default function Capas() {
  const { can } = useAuth();
  const [status, setStatus] = useState('');
  const { data, loading, reload } = useFetch(`/capas${status ? `?status=${status}` : ''}`);
  const sites = useFetch('/sites');
  const [sel, setSel] = useState(null);
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ title: '', site: '', severity: 'minor', dueDate: '', description: '' });

  const create = async (e) => {
    e.preventDefault();
    try { await api.post('/capas', f); toast('Corrective action created'); setOpen(false); reload(); } catch (x) { toast(errMsg(x), 'err'); }
  };

  return (
    <>
      <header className="page-head"><h1>Corrective actions</h1>{can('admin', 'auditor') && <button className="primary" onClick={() => setOpen(true)}>New action</button>}</header>
      <div className="tabs">{['', 'open', 'in_progress', 'pending_verification', 'overdue', 'closed'].map((s) => <button key={s} className={status === s ? 'on' : ''} onClick={() => setStatus(s)}>{s ? label(s) : 'All'}</button>)}</div>
      {loading ? <div className="boot">Loading…</div> : !data.items.length ? <Empty>No corrective actions in this view.</Empty> : (
        <table className="click">
          <thead><tr><th>Action</th><th>Site</th><th>Severity</th><th>Owner</th><th>Due</th><th>Status</th></tr></thead>
          <tbody>{data.items.map((c) => {
            const d = daysFrom(c.dueDate);
            return (
              <tr key={c._id} onClick={() => setSel(c._id)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setSel(c._id)}>
                <td><strong>{c.title}</strong><small>{c.code} · from {c.source}</small></td><td>{c.site?.code}</td><td><Badge v={c.severity} /></td><td>{c.assignedTo?.name || '—'}</td>
                <td>{fmtDate(c.dueDate)}{c.status !== 'closed' && <small className={d < 0 ? 'late' : ''}>{d < 0 ? `${-d} days late` : `${d} days left`}</small>}</td>
                <td><Badge v={c.status} /></td>
              </tr>
            );
          })}</tbody>
        </table>
      )}
      {sel && <Detail id={sel} onChanged={reload} onClose={() => setSel(null)} />}
      {open && (
        <Modal title="New corrective action" onClose={() => setOpen(false)}>
          <form onSubmit={create} className="form">
            <Field label="What needs fixing"><input required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
            <Field label="Site"><select required value={f.site} onChange={(e) => setF({ ...f, site: e.target.value })}><option value="">Choose a site</option>{sites.data?.items.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}</select></Field>
            <div className="row">
              <Field label="Severity"><select value={f.severity} onChange={(e) => setF({ ...f, severity: e.target.value })}><option value="minor">Minor</option><option value="major">Major</option><option value="critical">Critical</option></select></Field>
              <Field label="Due date"><input type="date" required value={f.dueDate} onChange={(e) => setF({ ...f, dueDate: e.target.value })} /></Field>
            </div>
            <Field label="Details"><textarea rows="3" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
            <button className="primary">Create action</button>
          </form>
        </Modal>
      )}
    </>
  );
}
