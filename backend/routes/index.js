const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { protect, allow } = require('../middleware/auth');

const auth = require('../controllers/authController');
const Site = require('../models/Site');
const crudFactory = require('../controllers/crud');
const audit = require('../controllers/auditController');
const insp = require('../controllers/inspectionController');
const capa = require('../controllers/capaController');
const report = require('../controllers/reportController');
const dash = require('../controllers/dashboardController');

const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, '..', 'uploads'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/[^\w.-]/g, '_')}`),
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post('/auth/login', auth.login);
router.use(protect);                            // everything below needs a valid token

router.get('/auth/me', auth.me);
router.get('/users', auth.listUsers);
router.post('/users', allow('admin'), auth.createUser);
router.get('/dashboard', dash.summary);

const sites = crudFactory(Site, { populate: [{ path: 'manager', select: 'name' }], filters: ['active'], sort: 'name' });
router.route('/sites').get(sites.list).post(allow('admin'), sites.create);
router.route('/sites/:id').get(sites.get).put(allow('admin'), sites.update).delete(allow('admin'), sites.remove);

router.route('/audits').get(audit.base.list).post(allow('admin', 'auditor'), audit.base.create);
router.route('/audits/:id').get(audit.base.get).put(allow('admin', 'auditor'), audit.base.update).delete(allow('admin'), audit.base.remove);
router.put('/audits/:id/checklist', allow('admin', 'auditor'), audit.saveChecklist);
router.post('/audits/:id/complete', allow('admin', 'auditor'), audit.complete);

router.route('/inspections').get(insp.base.list).post(allow('admin', 'auditor'), insp.create);
router.route('/inspections/:id').get(insp.base.get).put(allow('admin', 'auditor'), insp.base.update).delete(allow('admin'), insp.base.remove);

router.route('/capas').get(capa.base.list).post(allow('admin', 'auditor'), capa.base.create);
router.route('/capas/:id').get(capa.base.get).put(capa.update).delete(allow('admin'), capa.base.remove);
router.post('/capas/:id/evidence', upload.single('file'), capa.addEvidence);

router.get('/reports/export/csv', report.exportCsv);
router.route('/reports').get(report.base.list).post(allow('admin', 'auditor'), report.base.create);
router.route('/reports/:id').get(report.base.get).put(allow('admin', 'auditor'), report.base.update).delete(allow('admin'), report.base.remove);
router.post('/reports/:id/generate', allow('admin', 'auditor'), report.generate);
router.post('/reports/:id/submit', allow('admin', 'auditor'), report.submit);

module.exports = router;
