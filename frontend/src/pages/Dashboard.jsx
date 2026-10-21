import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useFetch } from '../hooks';
import { Empty, daysFrom, fmtDate, label } from '../ui';

const SPAN_BACK = 14, SPAN_FWD = 60;

function DeadlineRibbon({ items }) {
  const nav = useNavigate();
  const total = SPAN_BACK + SPAN_FWD;
  const pos = (days) => `${((Math.max(-SPAN_BACK, Math.min(SPAN_FWD, days)) + SPAN_BACK) / total) * 100}%`;
  const urgency = (d) => (d < 0 ? 'late' : d <= 7 ? 'soon' : 'ok');
  const sorted = [...items].sort((a, b) => a.days - b.days);

  return (
    <section className="ribbon-wrap" aria-label="Upcoming deadlines">
      <div className="ribbon-head">
        <h2>Next 60 days</h2>
        <p>{sorted.filter((i) => i.days < 0).length} overdue · {sorted.filter((i) => i.days >= 0 && i.days <= 7).length} due this week</p>
      </div>
      <div className="ribbon" style={{ height: 96 }}>
        <div className="ribbon-track" />
        <div className="ribbon-today" style={{ left: pos(0) }}><span>Today</span></div>
        {sorted.map((it, i) => (
          <button key={it.key} className={`tick ${it.kind} ${urgency(it.days)}`} style={{ left: pos(it.days), top: 14 + (i % 3) * 22 }}
            title={`${it.title} — ${fmtDate(it.date)}`} onClick={() => nav(it.to)} aria-label={`${it.title}, ${fmtDate(it.date)}`} />
        ))}
      </div>
      <div className="legend">
        <span><i className="tick capa ok" /> Corrective action</span>
        <span><i className="tick report ok" /> Statutory report</span>
        <span><i className="tick consent ok" /> Consent expiry</span>
      </div>
      {sorted.length === 0 ? <Empty>Nothing due in the next 60 days.</Empty> : (
        <ol className="due-list">
          {sorted.slice(0, 6).map((it) => (
            <li key={it.key} onClick={() => nav(it.to)}>
              <span className={`when ${it.days < 0 ? 'late' : it.days <= 7 ? 'soon' : ''}`}>{it.days < 0 ? `${-it.days}d late` : it.days === 0 ? 'Today' : `in ${it.days}d`}</span>
              <span className="what">{it.title}</span>
              <span className="where">{it.site}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export default function Dashboard() {
  const { data, loading, error } = useFetch('/dashboard');
  if (loading) return <div className="boot">Loading overview…</div>;
  if (error) return <p className="err">{error}</p>;

  const c = data.capaByStatus, a = data.auditByStatus;
  const openCapas = (c.open || 0) + (c.in_progress || 0) + (c.pending_verification || 0) + (c.overdue || 0);
  const items = [
    ...data.deadlines.capas.map((x) => ({ key: x._id, kind: 'capa', title: `${x.code} · ${x.title}`, date: x.dueDate, days: daysFrom(x.dueDate), site: x.site?.code, to: '/capa' })),
    ...data.deadlines.reports.map((x) => ({ key: x._id, kind: 'report', title: x.title || label(x.type), date: x.dueDate, days: daysFrom(x.dueDate), site: x.site?.code, to: '/reports' })),
    ...data.deadlines.consents.map((x) => ({ key: x._id, kind: 'consent', title: `Consent expires — ${x.name}`, date: x.consentValidTill, days: daysFrom(x.consentValidTill), site: x.code, to: '/sites' })),
  ];

  return (
    <>
      <header className="page-head"><h1>Overview</h1></header>

      <div className="strip">
        <div><strong>{openCapas}</strong><span>open corrective actions</span></div>
        <div className={data.overdueCount ? 'bad' : ''}><strong>{data.overdueCount}</strong><span>overdue</span></div>
        <div><strong>{(a.planned || 0) + (a.in_progress || 0)}</strong><span>audits in progress or planned</span></div>
        <div><strong>{a.completed || 0}</strong><span>audits completed</span></div>
      </div>

      <DeadlineRibbon items={items} />

      <div className="two-col">
        <section className="panel">
          <h3>Inspections and limit exceedances by month</h3>
          {data.exceedTrend.length === 0 ? <Empty>No inspections logged yet.</Empty> : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.exceedTrend} margin={{ left: -18 }}>
                <CartesianGrid vertical={false} stroke="#dfe5e0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip cursor={{ fill: '#eef2ee' }} />
                <Legend />
                <Bar dataKey="inspections" name="Inspections" fill="#0e6b6b" radius={[3, 3, 0, 0]} />
                <Bar dataKey="exceedances" name="Exceedances" fill="#b4321f" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>

        <section className="panel">
          <h3>Average audit score by site</h3>
          {data.siteScores.length === 0 ? <Empty>Complete an audit to see scores.</Empty> : (
            <ul className="scores">
              {data.siteScores.map((s) => (
                <li key={s.code}>
                  <div><strong>{s.site}</strong><span>{s.audits} audit{s.audits > 1 ? 's' : ''}</span></div>
                  <div className="bar"><i style={{ width: `${s.avgScore}%` }} className={s.avgScore >= 85 ? 'good' : s.avgScore >= 60 ? 'mid' : 'low'} /></div>
                  <b>{s.avgScore}%</b>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
