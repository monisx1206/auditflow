require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Site = require('../models/Site');
const Audit = require('../models/Audit');
const Inspection = require('../models/Inspection');
const Capa = require('../models/Capa');
const Report = require('../models/Report');

const d = (days) => new Date(Date.now() + days * 864e5);

const seedDB = async () => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URI);
  }
  await Promise.all([User, Site, Audit, Inspection, Capa, Report].map(m => m.deleteMany({})));


  // Users (Tamil Nadu EHS & Audit team)
  const admin = await User.create({
    name: 'Karthik Sundaram',
    email: 'admin@auditflow.io',
    password: 'admin123',
    role: 'admin',
  });

  const auditor = await User.create({
    name: 'MONISH H',
    email: 'auditor@auditflow.io',
    password: 'audit123',
    role: 'auditor',
  });

  const mgr = await User.create({
    name: 'Senthil Nathan',
    email: 'manager@auditflow.io',
    password: 'manager123',
    role: 'site_manager',
  });

  // Sites across key Tamil Nadu industrial clusters
  const [s1, s2, s3, s4] = await Site.create([
    {
      name: 'Noyyal Eco Dyeing & Processing Unit',
      code: 'TUP-DYE-01',
      industry: 'Textile Processing & Dyeing (ZLD)',
      location: 'SIPCOT Industrial Growth Centre, Perundurai, Tiruppur, Tamil Nadu',
      consentValidTill: d(45),
      manager: mgr._id,
    },
    {
      name: 'Manali Petrochem & Polymers Ltd',
      code: 'CHE-PET-02',
      industry: 'Petrochemicals & Specialty Resins',
      location: 'Manali Industrial Corridor, North Chennai 600068, Tamil Nadu',
      consentValidTill: d(260),
      manager: mgr._id,
    },
    {
      name: 'Sriperumbudur Auto-Coat & Assemblies',
      code: 'SPR-ENG-03',
      industry: 'Automotive Engineering & Surface Coating',
      location: 'SIPCOT Industrial Park Phase-II, Sriperumbudur, Kanchipuram, Tamil Nadu',
      consentValidTill: d(150),
      manager: mgr._id,
    },
    {
      name: 'Ranipet Eco Leather Tannery',
      code: 'RPT-TAN-04',
      industry: 'Leather Processing & Tanning',
      location: 'SIDCO Industrial Estate, Ranipet, Tamil Nadu',
      consentValidTill: d(95),
      manager: mgr._id,
    },
  ]);

  mgr.sites = [s1._id, s2._id, s3._id, s4._id];
  await mgr.save();

  // Completed Audit 1 in Tiruppur (Non-compliances raise CAPAs)
  const audit1 = await Audit.create({
    title: 'TNPCB ZLD & CTO Consent Compliance Audit',
    site: s1._id,
    type: 'internal',
    auditor: auditor._id,
    scheduledDate: d(-20),
    checklist: [
      {
        clause: 'Water & ZLD',
        question: 'Is Zero Liquid Discharge (ZLD) RO recovery maintained above 90% with reject sent to MEE?',
        compliant: false,
        severity: 'critical',
        remarks: 'Multiple Effect Evaporator (MEE) scaling caused 18% reject bypass to holding lagoon against TNPCB ZLD norms.',
      },
      {
        clause: 'Air Emissions',
        question: 'Online Continuous Emission Monitoring System (OCEMS) calibrated and linked to TNPCB Care Air Centre?',
        compliant: true,
      },
      {
        clause: 'Hazardous Waste',
        question: 'ETP chemical sludge stored on impervious concrete under rain shed with Form 10 manifest log?',
        compliant: false,
        severity: 'major',
        remarks: '20 dry ETP sludge bags stacked in open yard near gate 3; rain cover missing.',
      },
      {
        clause: 'Water Conservation',
        question: 'Electromagnetic digital flow meter readings transmitted real-time to Water Quality Watch portal?',
        compliant: true,
      },
      {
        clause: 'Statutory Permits',
        question: 'Valid Consent to Operate (CTO) displayed at factory entrance as per TNPCB directives?',
        compliant: true,
      },
    ],
  });
  audit1.status = 'completed';
  audit1.completedDate = d(-18);
  audit1.score = audit1.computeScore();
  audit1.capasRaised = true;
  await audit1.save();

  // Upcoming Regulatory Audit in Manali
  await Audit.create({
    title: 'TNPCB Regional Office Statutory CTO Pre-Inspection',
    site: s2._id,
    type: 'regulatory',
    auditor: auditor._id,
    scheduledDate: d(14),
    checklist: [
      { clause: 'Air & VOC', question: 'Quarterly LDAR (Leak Detection and Repair) survey completed for volatile hydrocarbon pumps?' },
      { clause: 'Hazardous Waste', question: 'Valid agreement active with Tamil Nadu Waste Management Ltd (TNWML Gummidipoondi) for TSDF disposal?' },
      { clause: 'Safety & Environment', question: 'Onsite emergency disaster management plan submitted to Directorate of Industrial Safety & Health (DISH Tamil Nadu)?' },
    ],
  });

  // Upcoming Tannery External Audit in Ranipet
  await Audit.create({
    title: 'Ranipet Tannery Chromium Recovery & CETP Inflow Audit',
    site: s4._id,
    type: 'external',
    auditor: auditor._id,
    scheduledDate: d(28),
    checklist: [
      { clause: 'Water & Chrome', question: 'Basic Chromium Sulphate (BCS) recovery unit operational with >98% chrome liquor recycled?' },
      { clause: 'Solid Waste', question: 'Chrome-shaving and buffing dust delivered to common hazardous waste facility (TNWML)?' },
      { clause: 'Odor Control', question: 'Bio-filter active for raw hide storage and liming pit area?' },
    ],
  });

  // Inspections: ETP Outlet & Air monitoring over the last 6 months
  for (let m = 5; m >= 0; m--) {
    await Inspection.create({
      site: s1._id,
      inspector: auditor._id,
      area: 'Tiruppur ETP Outlet & RO Permeate',
      date: d(-30 * m - 3),
      readings: [
        { parameter: 'BOD', value: m === 1 ? 38 : 22 + m, unit: 'mg/L', limitMax: 30 },
        { parameter: 'COD', value: m === 1 ? 265 : 180 + m * 8, unit: 'mg/L', limitMax: 250 },
        { parameter: 'TDS', value: m === 1 ? 2300 : 1850 + m * 30, unit: 'mg/L', limitMax: 2100 },
        { parameter: 'pH', value: 7.3, limitMin: 6.5, limitMax: 8.5 },
      ],
      notes: m === 1 ? 'Exceedance logged on BOD and TDS during peak dyeing shift' : 'Parameters within TNPCB discharge standards',
    });
  }

  // Air monitoring at Manali petrochemical facility
  for (let m = 3; m >= 0; m--) {
    await Inspection.create({
      site: s2._id,
      inspector: auditor._id,
      area: 'Manali Ambient Air & Boiler Stack-1',
      date: d(-30 * m - 7),
      readings: [
        { parameter: 'PM10', value: 72 + m * 4, unit: 'ug/m3', limitMax: 100 },
        { parameter: 'SO2', value: 48 + m * 3, unit: 'ug/m3', limitMax: 80 },
        { parameter: 'NOx', value: 52 + m * 2, unit: 'ug/m3', limitMax: 80 },
      ],
      notes: 'Ambient air quality monitored as per CPCB/TNPCB National Ambient Air Quality Standards',
    });
  }

  // CAPAs raised from audits and inspections (Sequential creation to maintain proper numbering)
  const seedCapas = [
    {
      title: 'Water: MEE scaling causing reject bypass against TNPCB ZLD norms',
      description: 'Multiple Effect Evaporator (MEE) calandria stage 2 calcium silicate scale buildup. Reject diverted to holding pond.',
      site: s1._id,
      source: 'audit',
      sourceRef: audit1._id,
      severity: 'critical',
      dueDate: d(6),
      status: 'in_progress',
      assignedTo: mgr._id,
      rootCause: 'Delayed sulfamic acid chemical CIP wash cycle coupled with high silica in borewell feed water.',
      correctiveAction: 'Carry out high-pressure hydro-jetting and sulfamic acid recirculation on MEE stage 2. Resume reject evaporation.',
      preventiveAction: 'Install automated antiscalant dosing pump skid with continuous online conductivity interlock.',
    },
    {
      title: 'Hazardous Waste: ETP sludge stored without rain cover; Form 10 log pending',
      description: '20 dry chemical sludge bags stored in open yard near gate 3; rain cover missing.',
      site: s1._id,
      source: 'audit',
      sourceRef: audit1._id,
      severity: 'major',
      dueDate: d(-4),
      status: 'overdue',
      assignedTo: mgr._id,
      rootCause: 'Covered hazardous waste storage shed reached 100% capacity awaiting quarterly dispatch to TNWML Gummidipoondi.',
      correctiveAction: 'Immediately shift all 20 sludge bags under UV-resistant HDPE tarpaulin on elevated concrete plinth.',
      preventiveAction: 'Contract additional transport vehicle with TNWML for bi-weekly sludge pickup during peak season.',
    },
    {
      title: 'Air: Stack-2 VOC fugitive emissions above 0.5 ppm at Manali solvent pump',
      description: 'Leak detection survey detected volatile organic compound vapor around pump P-204 mechanical seal.',
      site: s2._id,
      source: 'manual',
      severity: 'critical',
      dueDate: d(3),
      status: 'open',
      assignedTo: mgr._id,
    },
    {
      title: 'Water: Secondary cartridge filter differential pressure high at Ranipet',
      description: 'Differential pressure across 5-micron pre-filter reached 1.8 bar, reducing chrome recovery flow rate.',
      site: s4._id,
      source: 'inspection',
      severity: 'minor',
      dueDate: d(20),
      status: 'open',
      assignedTo: mgr._id,
    },
  ];

  for (const c of seedCapas) {
    await Capa.create(c);
  }

  // Statutory Reports submitted to TNPCB / MoEFCC
  await Report.create([
    {
      type: 'annual_environmental_statement',
      title: 'TNPCB Form V — Annual Environmental Statement (FY 2025-26)',
      site: s1._id,
      authority: 'Tamil Nadu Pollution Control Board (TNPCB - Tiruppur South)',
      periodStart: d(-365),
      periodEnd: d(-1),
      dueDate: d(18),
      status: 'draft',
      notes: 'Compilation of water consumption, raw material specific consumption, and hazardous waste generated.',
    },
    {
      type: 'half_yearly_compliance',
      title: 'Half-Yearly EC & CTO Environmental Compliance Report (Apr–Sep 2026)',
      site: s2._id,
      authority: 'TNPCB Regional Office (Ambattur) & MoEFCC Regional Office (Chennai)',
      periodStart: d(-180),
      periodEnd: d(-1),
      dueDate: d(35),
      status: 'draft',
      notes: 'Environmental clearance point-by-point compliance for Manali polymer unit expansion.',
    },
    {
      type: 'hazardous_waste_return',
      title: 'TNPCB Form 4 — Hazardous & Other Waste Annual Return',
      site: s1._id,
      authority: 'Tamil Nadu Pollution Control Board (TNPCB - Guindy Headquarters)',
      dueDate: d(-10),
      status: 'submitted',
      submittedAt: d(-12),
      referenceNo: 'TNPCB/HW/TRY/2026/0491',
      notes: 'Annual return covering Schedule I category 35.3 ETP sludge dispatches to TNWML Gummidipoondi.',
    },
    {
      type: 'consent_renewal',
      title: 'Consent to Operate (CTO) Renewal Application under Water & Air Acts',
      site: s3._id,
      authority: 'Tamil Nadu Pollution Control Board (TNPCB - Sriperumbudur)',
      dueDate: d(60),
      status: 'in_review',
      notes: 'Online renewal application submitted via TNPCB OCMMS portal along with audited balance sheet fee.',
    },
  ]);

  console.log('Seeded with Tamil Nadu industrial and environmental data.\n  admin@auditflow.io / admin123 (Karthik Sundaram - Admin)\n  auditor@auditflow.io / audit123 (MONISH H - Auditor)\n  manager@auditflow.io / manager123 (Senthil Nathan - Site Manager)');
};

if (require.main === module) {
  seedDB().then(() => process.exit(0)).catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
}

module.exports = { seedDB };

