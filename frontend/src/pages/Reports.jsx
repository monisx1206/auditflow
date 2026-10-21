import { useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext';
import { useFetch } from '../hooks';
import { Badge, Empty, Field, Modal, daysFrom, fmtDate, label, toast } from '../ui';

const TYPES = ['annual_environmental_statement', 'half_yearly_compliance', 'hazardous_waste_return', 'consent_renewal', 'water_cess_return', 'other'];

export default function Reports() {
  const { can } = useAuth();
  const { data, loading, reload } = useFetch('/reports');
  const sites = useFetch('/sites');
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ type: TYPES[0], title: '', site: '', authority: 'Tamil Nadu Pollution Control Board (TNPCB)', periodStart: '', periodEnd: '', dueDate: '' });

  const act = async (fn, msg) => { try { await fn(); toast(msg); reload(); } catch (e) { toast(errMsg(e), 'err'); } };
  const create = async (e) => {
    e.preventDefault();
    await act(async () => { await api.post('/reports', { ...f, periodStart: f.periodStart || undefined, periodEnd: f.periodEnd || undefined }); setOpen(false); }, 'Report created');
  };
  const submit = (r) => {
    const referenceNo = window.prompt('Filing / acknowledgement number (optional)') ?? null;
    if (referenceNo === null) return;
    act(() => api.post(`/reports/${r._id}/submit`, { referenceNo }), 'Marked as submitted');
  };
  const exportCsv = async () => {
    try {
      const res = await api.get('/reports/export/csv', { responseType: 'blob' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(res.data); a.download = 'statutory-reports.csv'; a.click();
    } catch (e) { toast(errMsg(e), 'err'); }
  };

  return (
    <>
      <header className="page-head"><h1>Statutory reports</h1>
        <div className="actions"><button onClick={exportCsv}>Export CSV</button>{can('admin', 'auditor') && <button className="primary" onClick={() => setOpen(true)}>New report</button>}</div></header>
      {loading ? <div className="boot">Loading…</div> : !data.items.length ? <Empty>No statutory reports tracked yet.</Empty> : (
        <table>
          <thead><tr><th>Report</th><th>Site</th><th>Period</th><th>Due</th><th>Status</th><th>Built from records</th><th /></tr></thead>
          <tbody>{data.items.map((r) => {
            const d = daysFrom(r.dueDate); const pending = ['draft', 'in_review'].includes(r.status);
            return (
              <tr key={r._id}>
                <td><strong>{r.title || label(r.type)}</strong><small>{r.authority}{r.referenceNo ? ` · Ref ${r.referenceNo}` : ''}</small></td>
                <td>{r.site?.code}</td><td>{r.periodStart ? `${fmtDate(r.periodStart)} – ${fmtDate(r.periodEnd)}` : '—'}</td>
                <td>{fmtDate(r.dueDate)}{pending && <small className={d < 0 ? 'late' : ''}>{d < 0 ? `${-d} days late` : `${d} days left`}</small>}</td>
                <td><Badge v={r.status} /></td>
                <td className="sum">{r.summary?.audits != null ? `${r.summary.audits} audits · ${r.summary.inspections} inspections · ${r.summary.exceedances} exceedances · ${r.summary.capasClosed}/${r.summary.capasOpened} actions closed` : '—'}</td>
                <td className="row-actions">{can('admin', 'auditor') && pending && (
                  <><button onClick={() => act(() => api.post(`/reports/${r._id}/generate`), 'Summary generated')}>Generate summary</button>
                    <button className="primary" onClick={() => submit(r)}>Mark submitted</button></>)}</td>
              </tr>
            );
          })}</tbody>
        </table>
      )}
      {open && (
        <Modal title="New statutory report" onClose={() => setOpen(false)}>
          <form onSubmit={create} className="form">
            <Field label="Report type"><select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>{TYPES.map((t) => <option key={t} value={t}>{label(t)}</option>)}</select></Field>
            <Field label="Title"><input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Optional — defaults to the type" /></Field>
            <Field label="Site"><select required value={f.site} onChange={(e) => setF({ ...f, site: e.target.value })}><option value="">Choose a site</option>{sites.data?.items.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}</select></Field>
            <Field label="Authority"><input value={f.authority} onChange={(e) => setF({ ...f, authority: e.target.value })} /></Field>
            <div className="row">
              <Field label="Period start"><input type="date" value={f.periodStart} onChange={(e) => setF({ ...f, periodStart: e.target.value })} /></Field>
              <Field label="Period end"><input type="date" value={f.periodEnd} onChange={(e) => setF({ ...f, periodEnd: e.target.value })} /></Field>
            </div>
            <Field label="Due date"><input type="date" required value={f.dueDate} onChange={(e) => setF({ ...f, dueDate: e.target.value })} /></Field>
            <button className="primary">Create report</button>
          </form>
        </Modal>
      )}
    </>
  );
}
