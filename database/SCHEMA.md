# AuditFlow – Database design (MongoDB)

```
User ──< sites >── Site ──< Audit (embedded checklist[])
                     │──< Inspection (embedded readings[])
                     │──< Capa (embedded history[], evidence[])   ◄── raised from Audit / Inspection (source + sourceRef)
                     └──< Report (embedded summary snapshot)
```

| Collection | Key fields | Notes |
|---|---|---|
| users | name, email(unique), password(hash), role, sites[] | roles: admin, auditor, site_manager |
| sites | name, code(unique), industry, consentValidTill, manager | consent expiry feeds the dashboard |
| audits | site, type, auditor, scheduledDate, status, checklist[], score | completing an audit locks it and raises CAPAs |
| inspections | site, area, date, readings[{parameter,value,limitMin,limitMax,exceeded}], status | exceedance auto-raises a CAPA |
| capas | code, site, source, sourceRef, severity, dueDate, status, history[], evidence[] | workflow + audit trail |
| reports | type, site, periodStart/End, dueDate, status, referenceNo, summary | summary generated from real records |

## Why embedded vs referenced
- **Embedded** (checklist, readings, history, evidence): always read together with the parent, never queried alone, bounded size.
- **Referenced** (site, user): shared across many documents, queried independently.

## Recommended indexes
```js
db.capas.createIndex({ status: 1, dueDate: 1 })      // overdue / due-soon queries
db.capas.createIndex({ site: 1, createdAt: -1 })
db.audits.createIndex({ site: 1, scheduledDate: -1 })
db.inspections.createIndex({ site: 1, date: -1 })
db.reports.createIndex({ status: 1, dueDate: 1 })
```
