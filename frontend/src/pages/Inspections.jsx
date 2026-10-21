import { useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext';
import { useFetch } from '../hooks';
import { Badge, Empty, Field, Modal, fmtDate, toast } from '../ui';

const PRESETS = {
  'Effluent (ETP outlet)': [
    { parameter: 'pH', unit: '', limitMin: 5.5, limitMax: 9 }, { parameter: 'BOD', unit: 'mg/L', limitMax: 30 }, { parameter: 'COD', unit: 'mg/L', limitMax: 250 }],
  'Stack emission': [{ parameter: 'PM', unit: 'mg/Nm³', limitMax: 150 }, { parameter: 'SO₂', unit: 'ppm', limitMax: 100 }],
  'Ambient noise': [{ parameter: 'Noise (day)', unit: 'dB(A)', limitMax: 75 }],
};
const blank = { site: '', area: '', notes: '', readings: [] };

export default function Inspections() {
  const { can } = useAuth();
  const [status, setStatus] = useState('');
  const { data, loading, reload } = useFetch(`/inspections${status ? `?status=${status}` : ''}`);
  const sites = useFetch('/sites');
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(blank);

  const setR = (i, patch) => setF({ ...f, readings: f.readings.map((r, j) => (j === i ? { ...r, ...patch } : r)) });
  const preset = (k) => setF({ ...f, area: f.area || k, readings: PRESETS[k].map((r) => ({ ...r, value: '' })) });

  const save = async (e) => {
    e.preventDefault();
    if (!f.readings.length) return toast('Add at least one reading', 'err');
    const num = (v) => (v === '' || v == null ? undefined : Number(v));
    try {
      const { data: res } = await api.post('/inspections', {
        ...f, readings: f.readings.map((r) => ({ ...r, value: Number(r.value), limitMin: num(r.limitMin), limitMax: num(r.limitMax) })),
      });
      toast(res.capasRaised ? 'Saved — limit exceeded, a corrective action was raised' : 'Inspection saved', res.capasRaised ? 'err' : 'ok');
      setOpen(false); setF(blank); reload();
    } catch (x) { toast(errMsg(x), 'err'); }
  };

  return (
    <>
      <header className="page-head"><h1>Inspections</h1>{can('admin', 'auditor') && <button className="primary" onClick={() => setOpen(true)}>Log inspection</button>}</header>
      <div className="tabs">{[['', 'All'], ['exceedance', 'Exceedances'], ['ok', 'Within limits']].map(([v, t]) => <button key={v} className={status === v ? 'on' : ''} onClick={() => setStatus(v)}>{t}</button>)}</div>
      {loading ? <div className="boot">Loading…</div> : !data.items.length ? <Empty>No inspections logged. Record a reading and limits are checked automatically.</Empty> : (
        <table>
          <thead><tr><th>Date</th><th>Site</th><th>Area</th><th>Readings</th><th>Result</th></tr></thead>
          <tbody>{data.items.map((i) => (
            <tr key={i._id}>
              <td>{fmtDate(i.date)}</td><td>{i.site?.code}</td><td><strong>{i.area}</strong><small>{i.inspector?.name}</small></td>
              <td className="readings">{i.readings.map((r) => <span key={r._id} className={r.exceeded ? 'over' : ''}>{r.parameter} {r.value}{r.unit ? ` ${r.unit}` : ''}</span>)}</td>
              <td><Badge v={i.status} /></td>
            </tr>
          ))}</tbody>
        </table>
      )}
      {open && (
        <Modal title="Log inspection" onClose={() => setOpen(false)} wide>
          <form onSubmit={save} className="form">
            <div className="row">
              <Field label="Site"><select required value={f.site} onChange={(e) => setF({ ...f, site: e.target.value })}>
                <option value="">Choose a site</option>{sites.data?.items.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}</select></Field>
              <Field label="Area"><input required value={f.area} onChange={(e) => setF({ ...f, area: e.target.value })} placeholder="ETP outlet, Stack-2…" /></Field>
            </div>
            <div className="presets"><span>Start from</span>{Object.keys(PRESETS).map((k) => <button type="button" key={k} onClick={() => preset(k)}>{k}</button>)}
              <button type="button" onClick={() => setF({ ...f, readings: [...f.readings, { parameter: '', value: '', unit: '' }] })}>Blank reading</button></div>
            {f.readings.map((r, i) => (
              <div className="reading" key={i}>
                <input placeholder="Parameter" required value={r.parameter} onChange={(e) => setR(i, { parameter: e.target.value })} />
                <input placeholder="Value" type="number" step="any" required value={r.value} onChange={(e) => setR(i, { value: e.target.value })} />
                <input placeholder="Unit" value={r.unit || ''} onChange={(e) => setR(i, { unit: e.target.value })} />
                <input placeholder="Min" type="number" step="any" value={r.limitMin ?? ''} onChange={(e) => setR(i, { limitMin: e.target.value })} />
                <input placeholder="Max" type="number" step="any" value={r.limitMax ?? ''} onChange={(e) => setR(i, { limitMax: e.target.value })} />
                <button type="button" className="ghost" onClick={() => setF({ ...f, readings: f.readings.filter((_, j) => j !== i) })} aria-label="Remove reading">✕</button>
              </div>
            ))}
            <Field label="Notes"><textarea rows="2" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></Field>
            <button className="primary">Save inspection</button>
          </form>
        </Modal>
      )}
    </>
  );
}
