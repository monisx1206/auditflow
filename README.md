# AuditFlow — Environmental audit, inspection, CAPA & statutory reporting

> Audit it. Fix it. Report it.

MERN stack. One system where audit findings turn into corrective actions, readings are checked against limits, and statutory returns are built from the records.

```
auditflow/
├── backend/      Express + Mongoose API (JWT auth, roles, cron)
├── frontend/     React (Vite) UI
└── database/     SCHEMA.md — collections, relations, indexes
```

## Run it
Prereqs: Node 18+, MongoDB running locally (or an Atlas URI).

```bash
# 1. API
cd backend
cp .env.example .env          # set MONGO_URI and JWT_SECRET
npm install
npm run seed                  # demo data + 3 logins
npm run dev                   # http://localhost:5000

# 2. UI (new terminal)
cd frontend
npm install
npm run dev                   # http://localhost:5173
```
Demo logins: `admin@auditflow.io / admin123`, `auditor@auditflow.io / audit123`, `manager@auditflow.io / manager123`.

## What makes it more than CRUD
| Feature | Where |
|---|---|
| Completing an audit locks it, scores it, and **auto-raises a CAPA per non-compliance** (due in 7/30/60 days by severity) | `auditController.complete` |
| Saving an inspection **checks every reading against its limits**; an exceedance auto-raises a CAPA | `Inspection` pre-save hook, `inspectionController.create` |
| CAPA workflow: open → in progress → pending verification → closed. Only auditors/admins can verify and close; closing needs a corrective action recorded | `capaController.update` |
| Daily cron marks late CAPAs **overdue** | `utils/scheduler.js` |
| Statutory report summary **generated from real audits, inspections and CAPAs** in the reporting period; CSV export | `reportController` |
| Deadline ribbon: CAPA due dates, report due dates and consent expiry on one 60-day timeline | `pages/Dashboard.jsx` |
| Full audit trail on every CAPA (`history[]`) and evidence file upload | `Capa` model, multer |

## Roles
- **admin** – everything, manages sites and users
- **auditor** – schedules/completes audits, logs inspections, creates reports, verifies and closes CAPAs
- **site_manager** – works assigned CAPAs (root cause, actions, evidence); cannot close them

## API (all under `/api`, Bearer token except login)
```
POST /auth/login            GET /auth/me         GET|POST /users
GET  /dashboard
GET|POST /sites             GET|PUT|DELETE /sites/:id
GET|POST /audits            GET|PUT|DELETE /audits/:id
PUT  /audits/:id/checklist  POST /audits/:id/complete
GET|POST /inspections       GET|PUT|DELETE /inspections/:id
GET|POST /capas             GET|PUT|DELETE /capas/:id      POST /capas/:id/evidence
GET|POST /reports           GET|PUT|DELETE /reports/:id
POST /reports/:id/generate  POST /reports/:id/submit       GET /reports/export/csv
```

## Ideas to extend
PDF export of reports (pdfkit), email/WhatsApp reminders (nodemailer + the existing cron), site-scoped access for managers, charts of parameter trends per area, Docker Compose, Jest + Supertest tests.
