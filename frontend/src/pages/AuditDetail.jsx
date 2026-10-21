import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext';
import { useFetch } from '../hooks';
import { Badge, fmtDate, label, toast } from '../ui';

export default function AuditDetail() {
  const { id } = useParams();
  const { can } = useAuth();
  const { data: audit, loading, reload } = useFetch(`/audits/${id}`);
  const [list, setList] = useState([]);
  const [newQ, setNewQ] = useState('');

  useEffect(() => { if (audit) setList(audit.checklist.map((c) => ({ ...c }))); }, [audit]);
  if (loading || !audit) return <div className="boot">Loading…</div>;

  const locked = audit.status === 'completed' || !can('admin', 'auditor');
  const set = (i, patch) => setList(list.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  const assessed = list.filter((c) => c.compliant !== null).length;

  const save = async () => {
    try { await api.put(`/audits/${id}/checklist`, { checklist: list }); toast('Checklist saved'); reload(); } catch (e) { toast(errMsg(e), 'err'); }
  };
  const complete = async () => {
    if (!window.confirm('Complete this audit? It will be locked and a corrective action is raised for every non-compliance.')) return;
    try {
      await api.put(`/audits/${id}/checklist`, { checklist: list });
      const { data } = await api.post(`/audits/${id}/complete`);
      toast(`Audit completed — ${data.capasRaised} corrective action${data.capasRaised === 1 ? '' : 's'} raised`); reload();
    } catch (e) { toast(errMsg(e), 'err'); }
  };

  return (
    <>
      <p className="crumb"><Link to="/audits">Audits</Link></p>
      <header className="page-head">
        <div><h1>{audit.title}</h1><p className="sub">{audit.site?.name} · {label(audit.type)} · {fmtDate(audit.scheduledDate)} · <Badge v={audit.status} /></p></div>
        {audit.score != null && <div className="score"><strong>{audit.score}%</strong><span>compliant</span></div>}
      </header>

      <p className="progress">{assessed} of {list.length} items assessed</p>
      <ul className="checklist">
        {list.map((c, i) => (
          <li key={c._id || i} className={c.compliant === false ? 'fail' : c.compliant ? 'pass' : ''}>
            <div className="q"><small>{c.clause}</small>{c.question}</div>
            <div className="ans">
              <div className="seg" role="group" aria-label="Compliance">
                <button disabled={locked} className={c.compliant === true ? 'on yes' : ''} onClick={() => set(i, { compliant: true })}>Compliant</button>
                <button disabled={locked} className={c.compliant === false ? 'on no' : ''} onClick={() => set(i, { compliant: false })}>Non-compliant</button>
              </div>
              {c.compliant === false && (
                <select disabled={locked} value={c.severity} onChange={(e) => set(i, { severity: e.target.value })} aria-label="Severity">
                  <option value="minor">Minor — 60 days</option><option value="major">Major — 30 days</option><option value="critical">Critical — 7 days</option>
                </select>
              )}
              <input disabled={locked} placeholder="Remarks / evidence reference" value={c.remarks || ''} onChange={(e) => set(i, { remarks: e.target.value })} />
            </div>
          </li>
        ))}
      </ul>

      {!locked && (
        <>
          <div className="add-q">
            <input placeholder="Add a checklist question" value={newQ} onChange={(e) => setNewQ(e.target.value)} />
            <button onClick={() => { if (newQ.trim()) { setList([...list, { clause: 'Custom', question: newQ.trim(), compliant: null, severity: 'minor' }]); setNewQ(''); } }}>Add</button>
          </div>
          <div className="actions"><button onClick={save}>Save progress</button><button className="primary" onClick={complete} disabled={assessed < list.length || !list.length}>Complete audit</button></div>
        </>
      )}
    </>
  );
}
