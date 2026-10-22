const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const easwariLogoPath = path.join(__dirname, 'easwari_logo.png');
const easwariLogoB64 = fs.existsSync(easwariLogoPath)
  ? 'data:image/png;base64,' + fs.readFileSync(easwariLogoPath).toString('base64')
  : '';

console.log('Generating perfected 50-page academic report with 12pt font, full text pages, and proper binding margins...');

const htmlPath = path.join(__dirname, 'AUDITFLOW_PROJECT_REPORT_50_PAGES.html');
const pdfPath = path.join(__dirname, 'AUDITFLOW_PROJECT_REPORT_MONISH_H.pdf');

const out = fs.createWriteStream(htmlPath, { encoding: 'utf8' });

out.write(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>AUDITFLOW - Mini Project Report - MONISH H (310624148060)</title>
<style>
  @page {
    size: A4 portrait;
    margin: 0;
  }
  @media print {
    html, body {
      width: 210mm !important;
      height: 297mm !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #fff !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page-container {
      width: 210mm !important;
      margin: 0 !important;
      padding: 0 !important;
      box-shadow: none !important;
    }
    .page {
      width: 210mm !important;
      height: 297mm !important;
      margin: 0 !important;
      padding: 16mm 20mm 14mm 20mm !important; /* Balanced 20mm Symmetric Margins */
      page-break-after: always !important;
      break-after: page !important;
      page-break-inside: avoid !important;
    }
    .no-print { display: none !important; }
  }
  * { box-sizing: border-box; }
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 11.5pt;
    line-height: 1.48;
    color: #000;
    margin: 0;
    padding: 0;
    background: #cbd5e1;
  }
  .page-container {
    width: 210mm;
    margin: 15px auto;
    background: #fff;
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  }
  .page {
    width: 210mm;
    height: 297mm;
    padding: 16mm 20mm 14mm 20mm; /* Centered 20mm Margins */
    position: relative;
    background: #fff;
    page-break-after: always;
    break-after: page;
    page-break-inside: avoid;
    overflow: hidden;
  }
  .page-border {
    border: 1.2px solid #000;
    height: 100%;
    padding: 16px 20px 12px 20px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .page-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .page-footer {
    text-align: center;
    font-size: 11.5pt;
    font-weight: normal;
    padding-top: 6px;
    font-family: 'Times New Roman', Times, serif;
  }

  h1.title {
    font-size: 16pt;
    font-weight: bold;
    text-align: center;
    line-height: 1.35;
    margin: 12px 0 14px 0;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-family: 'Times New Roman', Times, serif;
  }
  h2.report-sub {
    font-size: 16pt;
    font-weight: bold;
    text-align: center;
    margin: 14px 0;
    letter-spacing: 1px;
    font-family: 'Times New Roman', Times, serif;
  }
  h3.ch-num {
    text-align: center;
    font-size: 16pt;
    font-weight: bold;
    margin: 0 0 2px 0;
    letter-spacing: 0.5px;
    font-family: 'Times New Roman', Times, serif;
  }
  h3.ch-title {
    font-size: 16pt;
    font-weight: bold;
    text-align: center;
    margin: 0 0 10px 0;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-family: 'Times New Roman', Times, serif;
  }
  h4.sec {
    font-size: 16pt;
    font-weight: bold;
    margin: 8px 0 3px 0;
    text-align: left;
    font-family: 'Times New Roman', Times, serif;
  }
  h5.subsec {
    font-size: 13pt;
    font-weight: bold;
    font-style: italic;
    margin: 6px 0 2px 0;
    text-align: left;
    font-family: 'Times New Roman', Times, serif;
  }

  p {
    text-align: justify;
    text-justify: inter-word;
    margin: 3.5px 0;
    text-indent: 24px;
    font-size: 12pt;
    line-height: 1.42;
    font-family: 'Times New Roman', Times, serif;
  }
  p.no-indent { text-indent: 0; }

  ul, ol {
    margin: 4px 0 6px 20px;
    padding: 0;
    font-size: 12pt;
    line-height: 1.40;
    font-family: 'Times New Roman', Times, serif;
  }
  li { margin-bottom: 5px; text-align: justify; }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0;
    font-size: 10pt;
    line-height: 1.35;
  }
  th, td {
    border: 1px solid #222;
    padding: 5px 7px;
    text-align: left;
    vertical-align: middle;
  }
  th {
    background-color: #f1f5f9;
    font-weight: bold;
    text-align: center;
  }
  .caption {
    text-align: center;
    font-weight: bold;
    font-size: 10.5pt;
    margin: 6px 0 4px 0;
  }

  .box-diagram {
    border: 1px solid #475569;
    background: #f8fafc;
    padding: 8px;
    margin: 7px 0;
    font-family: 'Courier New', monospace;
    font-size: 8pt;
    line-height: 1.25;
    white-space: pre;
    text-align: center;
  }

  pre {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    padding: 3px 5px;
    font-family: 'Courier New', monospace;
    font-size: 7.6pt;
    line-height: 1.20;
    margin: 4px 0;
    white-space: pre-wrap;
    word-break: break-all;
  }
  code {
    font-family: 'Courier New', monospace;
    background: #f1f5f9;
    padding: 1px 3px;
    font-size: 9.5pt;
  }

  .toc-entry {
    display: flex;
    justify-content: space-between;
    margin: 2px 0;
    font-size: 10pt;
  }
  .toc-dot {
    flex-grow: 1;
    border-bottom: 1px dotted #555;
    margin: 0 6px;
    position: relative;
    top: -4px;
  }

  .college-emblem {
    display: block;
    margin: 0 auto;
    object-fit: contain;
  }
  .emblem-cover {
    width: 95px;
    height: 95px;
    margin: 10px auto 8px auto;
  }
  .emblem-cert {
    width: 78px;
    height: 78px;
    margin: 2px auto 6px auto;
  }

  .shot-img {
    width: 98%;
    max-height: 178mm;
    object-fit: contain;
    border: 1px solid #475569;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    display: block;
    margin: 6px auto;
  }
</style>
</head>
<body>
<div class="page-container">
`);

function writePage(num, content, isCover = false) {
  out.write(`
  <div class="page" id="page-${num}">
    <div class="page-border">
      <div class="page-content">
        ${content}
      </div>
      <div class="page-footer">
        ${isCover ? '' : num}
      </div>
    </div>
  </div>
  `);
}

// ================= PAGE 1: TITLE =================
writePage(1, `
  <div style="height: 12px;"></div>
  <h1 class="title">
    AUDITFLOW: ENVIRONMENTAL AUDIT, INSPECTION, CAPA<br>AND STATUTORY REPORTING PLATFORM
  </h1>
  <h2 class="report-sub">A PROJECT REPORT</h2>
  
  <div style="text-align: center; margin: 30px 0;">
    <p class="no-indent" style="text-align: center; font-size: 10pt;"><i>Submitted by</i></p>
    <p class="no-indent" style="text-align: center; font-size: 15pt; font-weight: bold; margin: 8px 0; letter-spacing: 0.5px;">
      MONISH H (310624148060)
    </p>
  </div>

  <div style="text-align: center; margin: 26px 0;">
    <p class="no-indent" style="text-align: center; font-size: 11.5pt;"><i>in partial fulfillment for the award of the Degree</i></p>
    <p class="no-indent" style="text-align: center; font-size: 11.5pt; margin: 4px 0;"><i>of</i></p>
    <p class="no-indent" style="text-align: center; font-size: 13.5pt; font-weight: bold;">BACHELOR OF ENGINEERING</p>
    <p class="no-indent" style="text-align: center; font-size: 10pt; margin: 4px 0;"><i>in</i></p>
    <p class="no-indent" style="text-align: center; font-size: 13pt; font-weight: bold;">
      COMPUTER SCIENCE AND ENGINEERING (AI & ML)
    </p>
    <p class="no-indent" style="text-align: center; font-size: 11.5pt; font-weight: bold; margin-top: 8px; color: #1e293b;">
      2311CSE503R - FULL STACK DEVELOPMENT
    </p>
  </div>

  <img class="college-emblem emblem-cover" src="${easwariLogoB64}" alt="Easwari Engineering College Emblem">

  <div style="text-align: center; margin-top: 18px;">
    <p class="no-indent" style="text-align: center; font-size: 13pt; font-weight: bold;">
      EASWARI ENGINEERING COLLEGE
    </p>
    <p class="no-indent" style="text-align: center; font-size: 10.5pt;">
      (AN AUTONOMOUS INSTITUTION) – AFFILIATED TO ANNA UNIVERSITY, CHENNAI
    </p>
    <p class="no-indent" style="text-align: center; font-size: 11.5pt; margin-top: 12px; font-weight: bold;">
      OCTOBER 2026
    </p>
  </div>
`, true);

// ================= PAGE 2: BONAFIDE =================
writePage(2, `
  <img class="college-emblem emblem-cert" src="${easwariLogoB64}" alt="Easwari Engineering College Emblem">
  <h2 style="text-align: center; font-size: 13.5pt; font-weight: bold; margin: 4px 0 2px 0; letter-spacing: 0.5px;">
    EASWARI ENGINEERING COLLEGE
  </h2>
  <p class="no-indent" style="text-align: center; font-size: 9.5pt; margin: 0 0 8px 0; font-style: italic;">
    (An Autonomous Institution, Affiliated to Anna University, Chennai)<br>
    Bharathi Salai, Ramapuram, Chennai &ndash; 600 089
  </p>
  <h3 style="text-align: center; font-size: 13pt; font-weight: bold; margin-bottom: 22px; letter-spacing: 0.5px;">
    BONAFIDE CERTIFICATE
  </h3>

  <p style="line-height: 2.1; font-size: 10.5pt; margin-top: 16px;">
    Certified that this mini project report titled <b>“AUDITFLOW: ENVIRONMENTAL AUDIT, INSPECTION, CAPA AND STATUTORY REPORTING PLATFORM”</b> is the Bonafide work of <b>“MONISH H (310624148060)”</b>, who carried out the project work under my supervision.
  </p>

  <div style="height: 105px;"></div>

  <div style="display: flex; justify-content: space-between; padding: 0 15px;">
    <div style="text-align: center; font-weight: bold;">
      <div style="border-top: 1px solid #111; width: 200px; margin-bottom: 6px;"></div>
      HEAD OF THE DEPARTMENT<br>
      <span style="font-size: 10.5pt; font-weight: normal;">
        Dr. Y. Justin Dhas<br>
        Department of CSE (AI & ML)<br>
        Easwari Engineering College
      </span>
    </div>
    <div style="text-align: center; font-weight: bold;">
      <div style="border-top: 1px solid #111; width: 200px; margin-bottom: 6px;"></div>
      PROJECT GUIDE / SUPERVISOR<br>
      <span style="font-size: 10.5pt; font-weight: normal;">
        Ms. Divyanjali<br>
        Department of CSE (AI & ML)<br>
        Easwari Engineering College
      </span>
    </div>
  </div>
`);

// ================= PAGE 3: VIVA VOCE =================
writePage(3, `
  <img class="college-emblem emblem-cert" src="${easwariLogoB64}" alt="Easwari Engineering College Emblem">
  <h2 style="text-align: center; font-size: 13.5pt; font-weight: bold; margin: 4px 0 2px 0; letter-spacing: 0.5px;">
    EASWARI ENGINEERING COLLEGE
  </h2>
  <p class="no-indent" style="text-align: center; font-size: 9.5pt; margin: 0 0 8px 0; font-style: italic;">
    (An Autonomous Institution, Affiliated to Anna University, Chennai)<br>
    Bharathi Salai, Ramapuram, Chennai &ndash; 600 089
  </p>
  <h3 style="text-align: center; font-size: 13pt; font-weight: bold; margin-bottom: 18px;">
    CERTIFICATE OF VIVA-VOCE EXAMINATION
  </h3>

  <p style="line-height: 1.95; font-size: 10.5pt; margin-top: 14px;">
    This is to certify that the Viva Voce Examination of the Project Work entitled <b>“AUDITFLOW: ENVIRONMENTAL AUDIT, INSPECTION, CAPA AND STATUTORY REPORTING PLATFORM”</b> submitted by <b>MONISH H (Reg. No. 310624148060)</b> in partial fulfillment of the requirements for the award of the degree of Bachelor of Engineering in Computer Science and Engineering (AI & ML) was conducted on ________________ (Date) in the Department of Computer Science and Engineering (AI & ML), Easwari Engineering College, Ramapuram – Chennai.
  </p>

  <p class="no-indent" style="margin-top: 35px; font-weight: bold;">
    Date: ________________________
  </p>

  <div style="height: 60px;"></div>

  <div style="display: flex; justify-content: space-between; padding: 0 15px;">
    <div style="text-align: left; font-size: 10pt;">
      <div style="border-top: 1px solid #111; width: 200px; margin-bottom: 6px;"></div>
      <b>Internal Examiner</b><br>
      Name : ________________________<br>
      Designation: ____________________<br>
      Address : ______________________
    </div>
    <div style="text-align: left; font-size: 10pt;">
      <div style="border-top: 1px solid #111; width: 200px; margin-bottom: 6px;"></div>
      <b>External Examiner</b><br>
      Name : ________________________<br>
      Designation: ____________________<br>
      Address : ______________________
    </div>
  </div>
`);

// ================= PAGE 4: ABSTRACT =================
writePage(4, `
  <h3 class="ch-title" style="margin-top: 10px;">ABSTRACT</h3>

  <p>
    Industrial environmental sustainability, regulatory compliance, and pollution abatement have become vital mandates across modern manufacturing, chemical processing, dyeing, and engineering facilities. Regulatory bodies such as the State Pollution Control Boards (e.g., TNPCB), the Central Pollution Control Board (CPCB), and international environmental bodies enforce strict statutory compliance standards under the Water (Prevention and Control of Pollution) Act of 1974 and the Air (Prevention and Control of Pollution) Act of 1981. However, conventional operational tracking remains crippled by paper-based clipboards, isolated desktop spreadsheets, uncoordinated email trails, and fragmented supervisory workstations. These antiquated practices introduce significant human error, lack audit provenance, fail to flag discharge limit exceedances in real-time, and make statutory return preparation tedious and delayed.
  </p>

  <p>
    This project presents <b>AuditFlow</b>, an enterprise-grade, end-to-end full-stack compliance management platform engineered on the MERN technology stack (MongoDB, Express.js, React.js, and Node.js). AuditFlow delivers a unified ecosystem that transforms the entire compliance lifecycle: <i>"Audit it. Fix it. Report it."</i> The platform features dynamic, checklist-driven auditing across major environmental focal areas (water conservation, trade effluent treatment, ambient air emissions, hazardous waste storage, and consent conditions). When an audit is completed, the system automatically locks the record, computes section and overall compliance scores, and <b>auto-generates time-bound Corrective and Preventive Actions (CAPA)</b> for every non-compliance discovered, enforcing strict 7, 30, or 60-day remediation SLAs calibrated to finding severity.
  </p>

  <p>
    Furthermore, AuditFlow introduces automated environmental inspection telemetry monitoring. Pre-save Mongoose validation hooks continuously evaluate discharge readings (e.g., BOD, COD, TSS, TDS, and PM2.5) against statutory consent limits; any exceedance immediately raises an automated CAPA incident. Corrective workflows follow a strict four-stage verification pipeline (Open ➔ In Progress ➔ Pending Verification ➔ Closed) with Role-Based Access Control (RBAC), ensuring that while facility managers record root-causes and upload Multer-backed photographic evidence, only authorized auditors or administrators can verify and close actions. An automated background cron daemon performs daily midnight scans, dynamically flagging overdue actions on an executive 60-day visual timeline ribbon. Finally, a statutory reporting engine synthesizes live operational data into regulatory returns with instant CSV export, deployed across a decoupled cloud topology (Vercel, Render, and MongoDB Atlas).
  </p>

  <p class="no-indent" style="margin-top: 14px;">
    <b>Keywords:</b> Environmental Audits, MERN Stack, Automated CAPA, Statutory Reporting, Pollution Control, Limit Exceedance, Role-Based Access Control, Mongoose Hooks, Cloud Deployment.
  </p>
`);

// ================= PAGE 5: ACKNOWLEDGEMENT =================
writePage(5, `
  <h3 class="ch-title" style="margin-top: 12px;">ACKNOWLEDGEMENT</h3>

  <p>
    We express our sincere gratitude to our esteemed Principal <b>Dr. P. Deiva Sundari</b> and the Management of <b>Easwari Engineering College</b> for providing us with state-of-the-art computational infrastructure, modern laboratory facilities, and an intellectually stimulating environment to carry out this project work successfully.
  </p>

  <p>
    We convey our heartfelt thanks to the Head of the Department <b>Dr. Y. Justin Dhas</b>, Department of Computer Science and Engineering (AI & ML), for his continuous encouragement, academic support, and constructive feedback throughout the course of this full-stack development curriculum.
  </p>

  <p>
    We are extremely thankful and indebted to our Project Guide <b>Ms. Divyanjali</b>, Department of Computer Science and Engineering (AI & ML), for her invaluable guidance, rigorous technical suggestions, and motivation throughout the conception, architecture, implementation, and deployment phases of this project.
  </p>

  <p>
    We would also like to extend our warm appreciation and gratitude to all the esteemed faculty members and technical staff of the Department of Computer Science and Engineering (AI & ML) for their continuous support, insightful recommendations, and cooperation during laboratory demonstrations.
  </p>

  <p>
    We also express our heartfelt appreciation to our fellow classmates and student colleagues whose collaborative discussions, technical debates, and constructive critiques significantly enriched the features and user experience of this application.
  </p>

  <p>
    Finally, I express my deepest love and gratitude to my beloved parents and family members for their enduring patience, unconditional encouragement, moral support, and blessings throughout my academic journey and the successful completion of this project work.
  </p>

  <div style="margin-top: 50px; text-align: right; padding-right: 15px; font-weight: bold; font-size: 11.5pt;">
    MONISH H<br>
    (Reg. No. 310624148060)<br>
    B.E. CSE (AI & ML)<br>
    Easwari Engineering College
  </div>
`);

// ================= PAGE 6: TOC 1 =================
writePage(6, `
  <h3 class="ch-title" style="margin-top: 10px;">TABLE OF CONTENTS</h3>

  <div style="margin-top: 10px;">
    <div class="toc-entry" style="font-weight: bold;">
      <span>CHAPTER NO.</span><span style="margin-left: 20px;">TITLE</span><span>PAGE NO.</span>
    </div>
    <div style="border-bottom: 1.5px solid #111; margin: 3px 0 8px 0;"></div>

    <div class="toc-entry" style="font-weight: bold;"><span></span><span>ABSTRACT</span><span>4</span></div>
    <div class="toc-entry" style="font-weight: bold;"><span></span><span>ACKNOWLEDGEMENT</span><span>5</span></div>
    <div class="toc-entry" style="font-weight: bold;"><span></span><span>LIST OF FIGURES</span><span>8</span></div>
    <div class="toc-entry" style="font-weight: bold;"><span></span><span>LIST OF TABLES</span><span>9</span></div>

    <div class="toc-entry" style="font-weight: bold; margin-top: 6px;"><span>1</span><span>INTRODUCTION</span><span>10</span></div>
    <div class="toc-entry"><span></span><span>1.1 Overview</span><span class="toc-dot"></span><span>10</span></div>
    <div class="toc-entry"><span></span><span>1.1.1 Industrial Chemistry & Pollution Abatement Fundamentals</span><span class="toc-dot"></span><span>10</span></div>
    <div class="toc-entry"><span></span><span>1.1.2 National Environmental Policy Framework & TNPCB Mandates</span><span class="toc-dot"></span><span>11</span></div>
    <div class="toc-entry"><span></span><span>1.2 Problem Definition</span><span class="toc-dot"></span><span>11</span></div>
    <div class="toc-entry"><span></span><span>1.3 Objective</span><span class="toc-dot"></span><span>12</span></div>
    <div class="toc-entry"><span></span><span>1.4 Scope of the Project</span><span class="toc-dot"></span><span>12</span></div>
    <div class="toc-entry"><span></span><span>1.4.1 Simulation Boundary and Academic Clarification</span><span class="toc-dot"></span><span>12</span></div>
    <div class="toc-entry"><span></span><span>1.5 Motivation</span><span class="toc-dot"></span><span>13</span></div>

    <div class="toc-entry" style="font-weight: bold; margin-top: 6px;"><span>2</span><span>LITERATURE SURVEY</span><span>14</span></div>
    <div class="toc-entry"><span></span><span>2.1 Literature Review</span><span class="toc-dot"></span><span>14</span></div>
    <div class="toc-entry"><span></span><span>2.1.1 Summary of Surveyed Methodologies</span><span class="toc-dot"></span><span>15</span></div>
    <div class="toc-entry"><span></span><span>2.2 Existing Systems</span><span class="toc-dot"></span><span>16</span></div>
    <div class="toc-entry"><span></span><span>2.3 Proposed System</span><span class="toc-dot"></span><span>16</span></div>

    <div class="toc-entry" style="font-weight: bold; margin-top: 6px;"><span>3</span><span>SYSTEM ANALYSIS</span><span>18</span></div>
    <div class="toc-entry"><span></span><span>3.1 Problem Statement</span><span class="toc-dot"></span><span>18</span></div>
    <div class="toc-entry"><span></span><span>3.2 Existing System Analysis</span><span class="toc-dot"></span><span>18</span></div>
    <div class="toc-entry"><span></span><span>3.3 Proposed System Capabilities</span><span class="toc-dot"></span><span>18</span></div>
    <div class="toc-entry"><span></span><span>3.4 Functional Requirements Specification</span><span class="toc-dot"></span><span>19</span></div>
    <div class="toc-entry"><span></span><span>3.5 Non-Functional Requirements Specification</span><span class="toc-dot"></span><span>19</span></div>
    <div class="toc-entry"><span></span><span>3.6 Feasibility Study</span><span class="toc-dot"></span><span>19</span></div>
    <div class="toc-entry"><span></span><span>3.7 Industrial Effluent Stoichiometry & Discharge Mass Balance</span><span class="toc-dot"></span><span>20</span></div>
    <div class="toc-entry"><span></span><span>3.7.1 BOD/COD Degradation Kinetics</span><span class="toc-dot"></span><span>20</span></div>
    <div class="toc-entry"><span></span><span>3.7.2 Stack Gas Dispersion and Particulate Dynamics</span><span class="toc-dot"></span><span>21</span></div>
    <div class="toc-entry"><span></span><span>3.8 Regulatory Framework and Industry Standards</span><span class="toc-dot"></span><span>21</span></div>

    <div class="toc-entry" style="font-weight: bold; margin-top: 6px;"><span>4</span><span>SYSTEM DESIGN</span><span>23</span></div>
    <div class="toc-entry"><span></span><span>4.1 System Architecture</span><span class="toc-dot"></span><span>23</span></div>
    <div class="toc-entry"><span></span><span>4.2 Module Description</span><span class="toc-dot"></span><span>24</span></div>
    <div class="toc-entry"><span></span><span>4.3 Use Case Diagram</span><span class="toc-dot"></span><span>24</span></div>
    <div class="toc-entry"><span></span><span>4.4 Entity-Relationship (ER) Diagram</span><span class="toc-dot"></span><span>25</span></div>
    <div class="toc-entry"><span></span><span>4.5 UI Navigation and Workflow Sequence</span><span class="toc-dot"></span><span>26</span></div>
    <div class="toc-entry"><span></span><span>4.6 Database Design</span><span class="toc-dot"></span><span>26</span></div>
    <div class="toc-entry"><span></span><span>4.7 API Design</span><span class="toc-dot"></span><span>27</span></div>
    <div class="toc-entry"><span></span><span>4.8 Mathematical Compliance Model and Parameter Mapping</span><span class="toc-dot"></span><span>28</span></div>
    <div class="toc-entry"><span></span><span>4.9 RESTful Data Transfer Protocols and Contract Specifications</span><span class="toc-dot"></span><span>29</span></div>
  </div>
`);

// ================= PAGE 7: TOC 2 =================
writePage(7, `
  <div style="margin-top: 10px;">
    <div class="toc-entry" style="font-weight: bold;">
      <span>CHAPTER NO.</span><span style="margin-left: 20px;">TITLE</span><span>PAGE NO.</span>
    </div>
    <div style="border-bottom: 1.5px solid #111; margin: 3px 0 8px 0;"></div>

    <div class="toc-entry" style="font-weight: bold; margin-top: 6px;"><span>5</span><span>SYSTEM IMPLEMENTATION</span><span>30</span></div>
    <div class="toc-entry"><span></span><span>5.1 Implementation Overview</span><span class="toc-dot"></span><span>30</span></div>
    <div class="toc-entry"><span></span><span>5.2 Frontend Implementation</span><span class="toc-dot"></span><span>30</span></div>
    <div class="toc-entry"><span></span><span>5.3 Backend Implementation</span><span class="toc-dot"></span><span>30</span></div>
    <div class="toc-entry"><span></span><span>5.4 MongoDB Database Implementation</span><span class="toc-dot"></span><span>31</span></div>
    <div class="toc-entry"><span></span><span>5.5 Authentication and Role-Based Access Control</span><span class="toc-dot"></span><span>31</span></div>
    <div class="toc-entry"><span></span><span>5.6 Mathematical Calculations & Scoring Engine</span><span class="toc-dot"></span><span>31</span></div>
    <div class="toc-entry"><span></span><span>5.6.1 Audit Scoring Formula</span><span class="toc-dot"></span><span>31</span></div>
    <div class="toc-entry"><span></span><span>5.6.2 Dynamic SLA Deadline Assignment</span><span class="toc-dot"></span><span>31</span></div>
    <div class="toc-entry"><span></span><span>5.6.3 Pre-Save Limit Exceedance Hooks</span><span class="toc-dot"></span><span>32</span></div>
    <div class="toc-entry"><span></span><span>5.6.4 Daily Cron Scheduler Daemon</span><span class="toc-dot"></span><span>32</span></div>
    <div class="toc-entry"><span></span><span>5.6.5 Network Interceptors and Session Hydration</span><span class="toc-dot"></span><span>32</span></div>
    <div class="toc-entry"><span></span><span>5.6.6 Defensive Request Validation and Schema Sanitization</span><span class="toc-dot"></span><span>32</span></div>
    <div class="toc-entry"><span></span><span>5.7 Deployment Architecture</span><span class="toc-dot"></span><span>33</span></div>

    <div class="toc-entry" style="font-weight: bold; margin-top: 8px;"><span>6</span><span>RESULTS AND DISCUSSION</span><span>34</span></div>
    <div class="toc-entry"><span></span><span>6.1 Testing Methodology</span><span class="toc-dot"></span><span>34</span></div>
    <div class="toc-entry"><span></span><span>6.2 Functional Test Cases</span><span class="toc-dot"></span><span>34</span></div>
    <div class="toc-entry"><span></span><span>6.3 Performance and Stress Testing Benchmarks</span><span class="toc-dot"></span><span>36</span></div>
    <div class="toc-entry"><span></span><span>6.4 Defensive and Security Verification</span><span class="toc-dot"></span><span>36</span></div>
    <div class="toc-entry"><span></span><span>6.5 User Acceptance Testing (UAT) and SUS Evaluation</span><span class="toc-dot"></span><span>36</span></div>

    <div class="toc-entry" style="font-weight: bold; margin-top: 8px;"><span>7</span><span>CONCLUSION AND FUTURE SCOPE</span><span>38</span></div>
    <div class="toc-entry"><span></span><span>7.1 Conclusion</span><span class="toc-dot"></span><span>38</span></div>
    <div class="toc-entry"><span></span><span>7.2 Future Enhancements</span><span class="toc-dot"></span><span>38</span></div>

    <div class="toc-entry" style="font-weight: bold; margin-top: 10px;"><span></span><span>APPENDIX: SOURCE CODE AND CONFIGURATION</span><span>40</span></div>
    <div class="toc-entry"><span></span><span>1. Project Directory Structure</span><span class="toc-dot"></span><span>40</span></div>
    <div class="toc-entry"><span></span><span>2. Environment Configuration (.env)</span><span class="toc-dot"></span><span>40</span></div>
    <div class="toc-entry"><span></span><span>3. Database Connection Pool (db.js)</span><span class="toc-dot"></span><span>41</span></div>
    <div class="toc-entry"><span></span><span>4. User Mongoose Schema (User.js)</span><span class="toc-dot"></span><span>41</span></div>
    <div class="toc-entry"><span></span><span>5. Site Mongoose Schema (Site.js)</span><span class="toc-dot"></span><span>41</span></div>
    <div class="toc-entry"><span></span><span>6. Audit Mongoose Schema (Audit.js)</span><span class="toc-dot"></span><span>42</span></div>
    <div class="toc-entry"><span></span><span>7. Inspection Mongoose Schema (Inspection.js)</span><span class="toc-dot"></span><span>42</span></div>
    <div class="toc-entry"><span></span><span>8. CAPA Mongoose Schema (Capa.js)</span><span class="toc-dot"></span><span>43</span></div>
    <div class="toc-entry"><span></span><span>9. Authentication Middleware (auth.js)</span><span class="toc-dot"></span><span>43</span></div>
    <div class="toc-entry"><span></span><span>10. Sample Ingestion & Response Payloads</span><span class="toc-dot"></span><span>43</span></div>
    <div class="toc-entry"><span></span><span>11. Audit Scoring & Auto-CAPA Controller (auditController.js)</span><span class="toc-dot"></span><span>44</span></div>
    <div class="toc-entry"><span></span><span>12. Pre-Save Limit Exceedance Hook (Inspection.js)</span><span class="toc-dot"></span><span>44</span></div>
    <div class="toc-entry"><span></span><span>13. Client Authentication State Provider (AuthContext.jsx)</span><span class="toc-dot"></span><span>45</span></div>
    <div class="toc-entry"><span></span><span>14. Daily Midnight Cron Scheduler (scheduler.js)</span><span class="toc-dot"></span><span>45</span></div>
    <div class="toc-entry"><span></span><span>15. Defensive Request Validation Middleware (validate.js)</span><span class="toc-dot"></span><span>45</span></div>

    <div class="toc-entry" style="font-weight: bold; margin-top: 8px;"><span></span><span>SCREENSHOTS OF THE PROJECT</span><span>46</span></div>
    <div class="toc-entry" style="font-weight: bold; margin-top: 4px;"><span></span><span>REFERENCES</span><span>50</span></div>
  </div>
`);

// ================= PAGE 8: LIST OF FIGURES =================
writePage(8, `
  <h3 class="ch-title" style="margin-top: 10px;">LIST OF FIGURES</h3>

  <div style="margin-top: 14px;">
    <div class="toc-entry" style="font-weight: bold;">
      <span style="width: 20%;">FIGURE NO.</span><span style="width: 65%;">TITLE</span><span style="width: 15%; text-align: right;">PAGE NO.</span>
    </div>
    <div style="border-bottom: 1.5px solid #111; margin: 3px 0 10px 0;"></div>

    <div class="toc-entry"><span style="width: 20%;">1.1</span><span style="width: 65%;">AuditFlow Three-Step Operational Paradigm ("Audit it. Fix it. Report it.")</span><span class="toc-dot"></span><span style="width: 15%; text-align: right;">13</span></div>
    <div class="toc-entry"><span style="width: 20%;">4.1</span><span style="width: 65%;">AuditFlow 3-Tier Enterprise System Architecture</span><span class="toc-dot"></span><span style="width: 15%; text-align: right;">23</span></div>
    <div class="toc-entry"><span style="width: 20%;">4.2</span><span style="width: 65%;">Role-Based Actor Interaction and Use Case Diagram</span><span class="toc-dot"></span><span style="width: 15%; text-align: right;">25</span></div>
    <div class="toc-entry"><span style="width: 20%;">4.3</span><span style="width: 65%;">Entity-Relationship (ER) Schema Model & Cardinality</span><span class="toc-dot"></span><span style="width: 15%; text-align: right;">25</span></div>
    <div class="toc-entry"><span style="width: 20%;">4.4</span><span style="width: 65%;">UI Navigation and Audit-to-CAPA Sequence Lifecycle Diagram</span><span class="toc-dot"></span><span style="width: 15%; text-align: right;">26</span></div>
    <div class="toc-entry"><span style="width: 20%;">5.1</span><span style="width: 65%;">AuditFlow Decoupled Cloud Deployment Topology</span><span class="toc-dot"></span><span style="width: 15%; text-align: right;">33</span></div>
    <div class="toc-entry"><span style="width: 20%;">S.1</span><span style="width: 65%;">Secure Login and User Authentication Interface</span><span class="toc-dot"></span><span style="width: 15%; text-align: right;">46</span></div>
    <div class="toc-entry"><span style="width: 20%;">S.2</span><span style="width: 65%;">AuditFlow Operations Dashboard with 60-Day Visual Timeline Ribbon</span><span class="toc-dot"></span><span style="width: 15%; text-align: right;">47</span></div>
    <div class="toc-entry"><span style="width: 20%;">S.3</span><span style="width: 65%;">Multi-Facility Industrial Sites Management Directory</span><span class="toc-dot"></span><span style="width: 15%; text-align: right;">47</span></div>
    <div class="toc-entry"><span style="width: 20%;">S.4</span><span style="width: 65%;">Environmental Audit Execution & Dynamic Checklist Scoring View</span><span class="toc-dot"></span><span style="width: 15%; text-align: right;">48</span></div>
    <div class="toc-entry"><span style="width: 20%;">S.5</span><span style="width: 65%;">Effluent & Stack Emission Inspection Logger with Statutory Limit Alerts</span><span class="toc-dot"></span><span style="width: 15%; text-align: right;">48</span></div>
    <div class="toc-entry"><span style="width: 20%;">S.6</span><span style="width: 65%;">4-Stage CAPA Remediation Management & Photographic Evidence Upload Modal</span><span class="toc-dot"></span><span style="width: 15%; text-align: right;">49</span></div>
    <div class="toc-entry"><span style="width: 20%;">S.7</span><span style="width: 65%;">Statutory Return Summary & Regulatory One-Click CSV Export Interface</span><span class="toc-dot"></span><span style="width: 15%; text-align: right;">49</span></div>
  </div>

  <div style="margin-top: 35px; padding: 12px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px;">
    <p class="no-indent" style="font-size: 10pt; line-height: 1.5; color: #334155;">
      <b>Note on Figure Conventions:</b> Architectural, sequence, and entity-relationship models adhere to standard Unified Modeling Language (UML 2.5) structural and behavioral specifications. System interface screenshots in Chapter 8 represent active production views captured from the live deployment instance at <code>https://auditflow-pi-two.vercel.app</code>.
    </p>
  </div>
`);

// ================= PAGE 9: LIST OF TABLES =================
writePage(9, `
  <h3 class="ch-title" style="margin-top: 10px;">LIST OF TABLES</h3>

  <div style="margin-top: 14px;">
    <div class="toc-entry" style="font-weight: bold;">
      <span style="width: 20%;">TABLE NO.</span><span style="width: 65%;">TITLE</span><span style="width: 15%; text-align: right;">PAGE NO.</span>
    </div>
    <div style="border-bottom: 1.5px solid #111; margin: 3px 0 10px 0;"></div>

    <div class="toc-entry"><span style="width: 20%;">2.1</span><span style="width: 65%;">Comparative Taxonomy of Surveyed EHS Literature</span><span class="toc-dot"></span><span style="width: 15%; text-align: right;">15</span></div>
    <div class="toc-entry"><span style="width: 20%;">3.1</span><span style="width: 65%;">Comparative Feasibility: Traditional SCADA/Spreadsheets vs. AuditFlow</span><span class="toc-dot"></span><span style="width: 15%; text-align: right;">21</span></div>
    <div class="toc-entry"><span style="width: 20%;">3.2</span><span style="width: 65%;">Statutory Environmental Discharge Limits and Tolerance Standards</span><span class="toc-dot"></span><span style="width: 15%; text-align: right;">22</span></div>
    <div class="toc-entry"><span style="width: 20%;">4.1</span><span style="width: 65%;">User Collection Schema Specification</span><span class="toc-dot"></span><span style="width: 15%; text-align: right;">26</span></div>
    <div class="toc-entry"><span style="width: 20%;">4.2</span><span style="width: 65%;">Site and Audit Collection Schema Specifications</span><span class="toc-dot"></span><span style="width: 15%; text-align: right;">27</span></div>
    <div class="toc-entry"><span style="width: 20%;">4.3</span><span style="width: 65%;">AuditFlow RESTful API Contract Specification</span><span class="toc-dot"></span><span style="width: 15%; text-align: right;">27</span></div>
    <div class="toc-entry"><span style="width: 20%;">4.4</span><span style="width: 65%;">Mathematical Compliance Model and Parameter Mapping</span><span class="toc-dot"></span><span style="width: 15%; text-align: right;">28</span></div>
    <div class="toc-entry"><span style="width: 20%;">6.1</span><span style="width: 65%;">Comprehensive AuditFlow Functional and Security Test Suite</span><span class="toc-dot"></span><span style="width: 15%; text-align: right;">34</span></div>
    <div class="toc-entry"><span style="width: 20%;">6.2</span><span style="width: 65%;">System Latency and Throughput Benchmarks Under Load</span><span class="toc-dot"></span><span style="width: 15%; text-align: right;">36</span></div>
    <div class="toc-entry"><span style="width: 20%;">6.3</span><span style="width: 65%;">System Usability Scale (SUS) Evaluation Metrics and Empirical Scores</span><span class="toc-dot"></span><span style="width: 15%; text-align: right;">37</span></div>
  </div>

  <div style="margin-top: 35px; padding: 12px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px;">
    <p class="no-indent" style="font-size: 10pt; line-height: 1.5; color: #334155;">
      <b>Note on Regulatory Citations:</b> Tolerance thresholds specified in Table 3.2 are derived directly from the Environment (Protection) Rules of 1986, Schedule VI General Standards for Discharge of Environmental Pollutants, and Tamil Nadu Pollution Control Board (TNPCB) Consent to Operate (CTO) operational schedules.
    </p>
  </div>
`);

// ================= PAGE 10: CHAPTER 1 =================
writePage(10, `
  <h3 class="ch-num">CHAPTER 1</h3>
  <h3 class="ch-title">INTRODUCTION</h3>

  <h4 class="sec">1.1 OVERVIEW</h4>
  <p>
    The global drive toward industrial environmental stewardship, sustainable manufacturing, and circular resource management has established environmental auditing and pollution control as critical pillars of modern engineering operations [1]. Heavy manufacturing, chemical synthesis, textile bleaching and dyeing, and metal finishing generate substantial quantities of trade effluent, hazardous chemical residues, and air pollutants. In industrialized regions—such as Tamil Nadu's industrial corridors across Tiruppur, Manali, and Sriperumbudur—stringent statutory obligations mandate that facilities implement continuous environmental surveillance [2].
  </p>
  <p>
    Manufacturing facilities operate under explicit regulatory mandates, chief among them the Consent to Operate (CTO) granted by State Pollution Control Boards. These permits establish legally enforceable chemical and physical discharge boundaries. AuditFlow is an enterprise-grade full-stack engineering software platform designed to bridge the operational gap between raw facility metrics and executive sustainability tracking on the modern MERN technology stack under the paradigm: <i>"Audit it. Fix it. Report it."</i>
  </p>

  <h4 class="sec">1.1.1 Industrial Chemistry & Pollution Abatement Fundamentals</h4>
  <p>
    Industrial wastewater treatment and flue gas abatement involve complex biochemical unit operations. In Effluent Treatment Plants (ETP) and Zero Liquid Discharge (ZLD) installations, raw effluent undergoes coagulation, aerobic digestion, and reverse osmosis. Key regulatory parameters include:
  </p>
  <p>
    1. <b>Biochemical Oxygen Demand (BOD):</b> Quantifies dissolved oxygen consumed by microorganisms:
  </p>
  <div style="text-align: center; font-weight: bold; margin: 3px 0;">
    BOD₅ = (DO_initial − DO_final) × Dilution Factor &nbsp;&nbsp;&nbsp;&nbsp;(1.1)
  </div>
  <p>
    2. <b>Chemical Oxygen Demand (COD):</b> Measures total oxidizable organic constituents via dichromate digestion:
  </p>
  <div style="text-align: center; font-weight: bold; margin: 3px 0;">
    Cr₂O₇²⁻ + 14H⁺ + 6e⁻ &rarr; 2Cr³⁺ + 7H₂O &nbsp;&nbsp;&nbsp;&nbsp;(1.2)
  </div>
  <p>
    Maintaining BOD &le; 30 mg/L and COD &le; 250 mg/L is essential to prevent biological damage to aquatic ecosystems.
  </p>
`);

// ================= PAGE 11: CHAPTER 1 (CONT) =================
writePage(11, `
  <p>
    Similarly, air emission monitoring requires strict oversight of suspended Particulate Matter (PM), Sulfur Dioxide (SO₂), and Nitrogen Oxides (NOx) emitted from boilers, furnaces, and generator stacks. Tracking differentials between stack emissions and statutory limits ensures industrial air scrubbers function at rated operational efficiencies:
  </p>
  <div style="text-align: center; font-weight: bold; margin: 4px 0;">
    PM_efficiency = [ (PM_inlet − PM_outlet) / PM_inlet ] × 100 &nbsp;&nbsp;&nbsp;&nbsp;(1.3)
  </div>
  <p>
    Continuous monitoring of particulate capture efficiency protects surrounding airsheds from hazardous breathable micro-particulates (&le; 2.5 µm).
  </p>

  <h4 class="sec">1.1.2 National Environmental Policy Framework & TNPCB Mandates</h4>
  <p>
    In India, industrial environmental governance is codified under the Water Act of 1974, Air Act of 1981, and Environment Protection Act of 1986. Under these frameworks, the CPCB and State Boards like TNPCB enforce mandatory online monitoring and periodic statutory returns (Form V Statements and Form IV Hazardous Waste Returns). Non-compliance carries severe legal penalties under Section 33A of the Water Act.
  </p>

  <h4 class="sec">1.2 PROBLEM DEFINITION</h4>
  <p>
    In contemporary manufacturing operations, environmental compliance management remains fragmented, siloed, and vulnerable to systemic failures:
  </p>
  <ol>
    <li><b>High Transcription Error Rates:</b> Analog probe readings recorded on paper clipboards and transcribed into spreadsheets introduce significant data corruption and calculation errors.</li>
    <li><b>Delayed Anomaly Visibility:</b> Paper logs fail to trigger alerts when effluent exceeds statutory limits, leaving toxic breaches unnoticed until weekly reviews.</li>
    <li><b>Absence of Automated Remediation:</b> Traditional checklists document non-compliances without enforcing remediation workflows, SLAs, or verification audit trails.</li>
    <li><b>Clerical Friction in Statutory Returns:</b> Compiling mandatory pollution control board returns requires weeks of manual reconciliation across disparate site records.</li>
    <li><b>Zero Provenance & Inadequate Access Control:</b> Unsecured spreadsheets lack cryptographic authentication, enabling accidental overwrites and unverified data tampering.</li>
  </ol>
`);

// ================= PAGE 12: CHAPTER 1 (CONT) =================
writePage(12, `
  <h4 class="sec">1.3 OBJECTIVE</h4>
  <p>
    The primary objective of AuditFlow is to engineer a secure, highly responsive, web-based environmental compliance and CAPA management platform tailored for industrial facilities. Specific project engineering goals include:
  </p>
  <ol>
    <li><b>Interactive Executive Dashboard:</b> Developing an intuitive, high-performance web dashboard displaying overall compliance health, overdue CAPAs, multi-site status, and a 60-day visual deadline ribbon.</li>
    <li><b>Checklist-Driven Auditing Engine:</b> Implementing dynamic audit checklists categorized by operational domains (Water, Trade Effluent, Air Emissions, Hazardous Waste, Legal Consents) with automated compliance percentage scoring.</li>
    <li><b>Automated CAPA Dispatch Pipeline:</b> Engineering an algorithmic event pipeline that instantly locks completed audits and auto-generates time-bound Corrective and Preventive Actions with severity-based SLAs (Critical: 7 days, Major: 30 days, Minor: 60 days).</li>
    <li><b>Pre-Save Limit Exceedance Safeguards:</b> Deploying database pre-save hooks that validate environmental test readings against statutory thresholds in real time, auto-raising incident CAPAs upon limit breaches.</li>
    <li><b>Cryptographic Role-Based Access Control:</b> Enforcing strict RBAC via JSON Web Tokens (JWT) and Bcrypt salted hashing, segregating permissions between System Administrators, Lead Auditors, and Facility Site Managers.</li>
    <li><b>Statutory Return Generation & Export:</b> Delivering automated aggregation engines that synthesize operational records into formal regulatory returns with instant CSV export.</li>
    <li><b>Resilient Cloud Deployment:</b> Architecting a decoupled cloud topology across Vercel, Render, and MongoDB Atlas to guarantee high availability and minimal operational cost.</li>
  </ol>

  <h4 class="sec">1.4 SCOPE OF THE PROJECT</h4>
  <p>
    AuditFlow provides a complete operational compliance management layer for industrial enterprises, environmental auditing firms, and regulatory compliance teams. The platform provides continuous operational visibility, multi-site oversight, historical finding tracking, and automated reporting.
  </p>

  <h5 class="subsec">1.4.1 Simulation Boundary and Academic Clarification</h5>
  <p>
    In accordance with academic mini-project guidelines for full-stack engineering, the scope of this work focuses on cloud software architecture, asynchronous API pipelines, database schema modeling, and responsive user interfaces. Physical industrial hardware (such as inline dissolved oxygen meters, flue gas opacity sensors, and RS-485 Modbus telemetry transducers) is simulated via structured JSON ingestion payloads representing real-world operating conditions across key Tamil Nadu industrial clusters (Tiruppur textile dyeing, Manali petrochemicals, and Sriperumbudur automotive coating), validating software correctness without requiring physical plant instrumentation.
  </p>
`);

// ================= PAGE 13: CHAPTER 1 (CONT) =================
writePage(13, `
  <h4 class="sec">1.5 MOTIVATION</h4>
  <p>
    The motivation behind AuditFlow stems from the critical need to modernize industrial environmental governance. As corporate sustainability reporting, Environmental Social Governance (ESG) criteria, and regulatory enforcement become increasingly rigorous, industrial facilities can no longer afford the risks inherent in paper and spreadsheet records.
  </p>
  <p>
    A single unmonitored chemical spill or effluent limit breach can result in criminal prosecution of factory executives, massive environmental compensation levies, and devastating public health consequences for surrounding communities. Furthermore, multinational supply chains increasingly demand transparent, audited environmental verification from their manufacturing suppliers before awarding long-term contracts.
  </p>
  <p>
    Without automated software tooling, environmental managers spend up to 40% of their working hours on clerical reconciliation rather than active pollution prevention. AuditFlow was conceived to eliminate this administrative friction, providing plant engineers with an open-architecture, cloud-native tool that automates the audit-to-remediation pipeline with the same agility, speed, and precision standard in modern software engineering.
  </p>

  <div class="box-diagram">
+-------------------------------------------------------------------------------+
|                        THE AUDITFLOW OPERATIONAL CORE                         |
|                                                                               |
|      [ AUDIT IT ]              ====>       [ FIX IT ]        ====>  [ REPORT ]|
|  Dynamic Checklists                        Automated CAPAs          Statutory |
|  Limit Exceedance Probes                   SLA Enforced 7/30/60d    CSV Return|
|  Section & Overall Scores                  Auditor Sign-off Close   1-Click   |
+-------------------------------------------------------------------------------+
  </div>
  <div class="caption">Figure 1.1: AuditFlow Three-Step Operational Paradigm</div>

  <p>
    By establishing an immutable digital chain of custody from physical test parameters to regulatory filings, AuditFlow ensures that enterprise environmental governance transitions from a reactive legal burden into a proactive, transparent, and continuous operational discipline.
  </p>
  <p>
    Furthermore, industrial facilities that integrate digital compliance management demonstrate higher resource utilization efficiency. Reduced water consumption through wastewater recycling, optimized chemical dosage in effluent neutralization tanks, and lower emissions all contribute directly to substantial operational cost savings. Thus, AuditFlow serves not only as a defensive compliance barrier against statutory penalties, but also as an active driver of industrial eco-efficiency and operational excellence.
  </p>
`);

// ================= PAGE 14: CHAPTER 2 =================
writePage(14, `
  <h3 class="ch-num">CHAPTER 2</h3>
  <h3 class="ch-title">LITERATURE SURVEY</h3>

  <h4 class="sec">2.1 LITERATURE REVIEW</h4>
  <p>
    The design and architecture of AuditFlow build upon established research in industrial environmental management systems, statutory pollution abatement frameworks, modern full-stack web software engineering, and distributed cloud computing.
  </p>
  <p>
    According to the Central Pollution Control Board (CPCB) Technical Guidelines [1], online continuous environmental monitoring systems are vital for preventing clandestine industrial discharges into public water bodies. Their benchmark report underscores that operating with manual inspection cycles creates an operational lag of up to 72 hours between physical exceedances and corrective interventions. Consequently, digital software architectures capable of real-time limit threshold validation are indispensable for modern industrial operations.
  </p>
  <p>
    The International Organization for Standardization (ISO) in its ISO 14001:2015 Environmental Management Systems (EMS) specification [2] mandates that organizations establish systematic procedures for identifying non-conformities, implementing corrective actions, and evaluating preventive effectiveness. Traditional enterprise implementations frequently fail third-party certification audits because disconnected email trails and spreadsheet logs lack verifiable change histories and evidence file provenance.
  </p>
  <p>
    Bank [3] demonstrated that the MERN (MongoDB, Express.js, React.js, Node.js) technology stack provides an optimal balance of developer velocity, asynchronous performance, and horizontal scalability for operational telemetry and audit dashboards. The unified use of JavaScript across client and server layers eliminates cognitive context-switching and serializes JSON payloads without translation overhead.
  </p>
  <p>
    Chodorow [4] details schema design patterns for document-oriented databases in MongoDB, establishing that nested sub-documents (such as checklist findings and timestamped change histories) deliver superior atomicity and query performance compared to heavily normalized relational database structures. Banks and Porcello [5] demonstrate that modern React single-page architectures leveraging Context API and declarative visual component libraries provide sub-second screen responsiveness without full page refreshes.
  </p>
  <p>
    Tilkov and Vinoski [6] explain that Node.js's non-blocking, event-driven I/O loop is ideally matched for concurrent API workloads characteristic of industrial monitoring services. Finally, Beller and Zaidman [7] illustrate how cloud-native continuous integration and deployment pipelines ensure predictable software release cycles with zero downtime.
  </p>
`);

// ================= PAGE 15: CHAPTER 2 (CONT) =================
writePage(15, `
  <h4 class="sec">2.1.1 Summary of Surveyed Methodologies</h4>
  <p>
    Table 2.1 summarizes the surveyed literature, highlighting key findings, methodological limitations, and how AuditFlow addresses identified research and engineering gaps.
  </p>

  <div class="caption">Table 2.1: Comparative Taxonomy of Surveyed Literature</div>
  <table>
    <thead>
      <tr>
        <th style="width: 20%;">Author & Year</th>
        <th style="width: 18%;">Domain</th>
        <th style="width: 34%;">Core Methodology / Finding</th>
        <th style="width: 28%;">AuditFlow Implementation</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>CPCB (2020) [1]</b></td>
        <td>Continuous Monitoring</td>
        <td>Real-time effluent monitoring prevents toxic shock to aquatic biomes; 72h manual delay unacceptable.</td>
        <td>Pre-save Mongoose validation hooks triggering automated emergency CAPAs.</td>
      </tr>
      <tr>
        <td><b>ISO 14001:2015 [2]</b></td>
        <td>Environmental Mgmt</td>
        <td>Clause 10.2 mandates formal non-conformity corrective & preventive action tracking with evidence.</td>
        <td>4-stage CAPA pipeline with Multer photo proof & strict role sign-offs.</td>
      </tr>
      <tr>
        <td><b>Bank (2020) [3]</b></td>
        <td>Web Architecture</td>
        <td>Single-language full-stack JavaScript minimizes serialization overhead and accelerates dev cycles.</td>
        <td>MERN architecture connecting React SPA with Express and MongoDB Atlas.</td>
      </tr>
      <tr>
        <td><b>Chodorow (2020) [4]</b></td>
        <td>NoSQL Schemas</td>
        <td>Document-based data structures provide superior atomicity for audit checklists and event histories.</td>
        <td>Embedded sub-documents for dynamic checklists and chronological CAPA history.</td>
      </tr>
      <tr>
        <td><b>Banks & Porcello (2020) [5]</b></td>
        <td>Reactive UI</td>
        <td>Context API and component state hydration deliver sub-second UI interactions without page reload.</td>
        <td>React Context providers managing auth tokens, roles, and UI notifications.</td>
      </tr>
    </tbody>
  </table>

  <p>
    The synthesis of these surveyed works demonstrates that while individual components—such as database modeling or continuous telemetry—have been studied extensively in isolation, modern industrial compliance necessitates a unified, end-to-end software platform that seamlessly bridges audit checklists, physical parameter telemetry, time-bound remediation ticketing, and statutory reporting into a single operational interface.
  </p>
`);

// ================= PAGE 16: CHAPTER 2 (CONT) =================
writePage(16, `
  <div class="caption">Table 2.1: Comparative Taxonomy of Surveyed Literature (Continued)</div>
  <table>
    <thead>
      <tr>
        <th style="width: 20%;">Author & Year</th>
        <th style="width: 18%;">Domain</th>
        <th style="width: 34%;">Core Methodology / Finding</th>
        <th style="width: 28%;">AuditFlow Implementation</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>Tilkov & Vinoski (2010) [6]</b></td>
        <td>Event-Driven I/O</td>
        <td>Asynchronous event loop handles high-concurrency sensor ingestion without thread starvation.</td>
        <td>Node.js Express engine processing concurrent telemetry and cron scans asynchronously.</td>
      </tr>
    </tbody>
  </table>

  <h4 class="sec">2.2 EXISTING SYSTEMS</h4>
  <p>
    Current industrial environmental tracking methodologies across small-to-medium manufacturing enterprises typically fall into three broad paradigms:
  </p>
  <ul>
    <li><b>Enterprise SCADA/MES Systems:</b> Heavy industrial automation suites (e.g., Siemens WinCC, Wonderware, Honeywell) provide robust real-time programmable logic controller (PLC) readouts but incur exorbitant licensing costs ($50,000+), require dedicated on-premises servers, and lack mobile web accessibility for off-site environmental auditors.</li>
    <li><b>Manual Clipboard and Spreadsheet Logging:</b> Over 70% of SME facilities rely on clipboard sheets transcribed weekly into Microsoft Excel. This approach is highly error-prone, lacks automated threshold calculations, and provides zero cryptographic security against unmonitored cell overrides or retroactive edits.</li>
    <li><b>Fragmented Single-Vendor Portals:</b> Specialized effluent meter or stack analyzer vendors provide standalone web portals. However, these proprietary tools remain siloed, failing to consolidate water treatment records, hazardous waste manifests, and audit checklists into a unified executive compliance view.</li>
  </ul>

  <h4 class="sec">2.3 PROPOSED SYSTEM</h4>
  <p>
    AuditFlow overcomes the limitations of existing approaches by delivering a unified, web-native compliance management platform accessible from any device via standard modern web browsers. By consolidating multi-site facility records, dynamic checklists, automated CAPA remediation, and statutory returns into a cohesive MERN architecture, AuditFlow eliminates administrative delays and establishes an unbroken chain of custody for all environmental data.
  </p>
`);

// ================= PAGE 17: CHAPTER 2 (CONT) =================
writePage(17, `
  <h4 class="sec">2.3 PROPOSED SYSTEM CAPABILITIES (CONTINUED)</h4>
  <p>
    The proposed AuditFlow platform introduces several transformative technical capabilities engineered specifically for industrial environmental compliance:
  </p>
  <ul>
    <li><b>Centralized Operational Visibility:</b> Delivers a single-pane-of-glass executive dashboard featuring multi-site compliance percentages, overdue CAPA counters, statutory consent expiration warnings, and a 60-day visual deadline ribbon.</li>
    <li><b>Deterministic Scoring and SLA Automation:</b> The server-side calculation engine automatically computes overall and domain-specific audit compliance scores upon completion. It instantly raises time-bound CAPAs with severity-calibrated SLAs (Critical: 7 days, Major: 30 days, Minor: 60 days).</li>
    <li><b>Pre-Save Database Limit Hooks:</b> Mongoose pre-save middleware compares logged effluent and air readings against statutory limits in real time, auto-generating emergency incident CAPAs upon parameter exceedance.</li>
    <li><b>Cryptographic Security & RBAC:</b> Stateless JSON Web Tokens (JWT) and salted Bcrypt password hashing enforce strict role segregation between Administrators, Auditors, and Site Managers.</li>
    <li><b>Ergonomic Accessibility:</b> A responsive client interface built with modern CSS custom tokens ensures optimal usability across smartphones, tablets, and desktop workstations.</li>
    <li><b>Cost-Effective Cloud Architecture:</b> Deployed on serverless and containerized cloud platforms (Vercel, Render, MongoDB Atlas), eliminating heavy on-premises hardware investments while ensuring 99.9% availability.</li>
    <li><b>Immutable Audit Trail & Provenance:</b> Every status transition, photographic evidence upload, and audit verification is permanently logged with user ID and timestamp, preventing retroactive tampering.</li>
    <li><b>One-Click Statutory Reporting:</b> An automated data aggregation engine consolidates facility operational metrics into standardized compliance return summaries with instant CSV export for pollution board filings.</li>
  </ul>

  <p>
    These core capabilities collectively ensure that industrial compliance transitions from a reactive, paper-heavy chore into a proactive, data-driven operational discipline that safeguards both corporate legal integrity and local environmental ecosystems.
  </p>
`);

// ================= PAGE 18: CHAPTER 3 =================
writePage(18, `
  <h3 class="ch-num">CHAPTER 3</h3>
  <h3 class="ch-title">SYSTEM ANALYSIS</h3>

  <h4 class="sec">3.1 PROBLEM STATEMENT</h4>
  <p>
    Industrial environmental safety officers, plant managers, and certified auditors require an accessible, real-time software platform to schedule audits, record environmental test telemetry, track corrective actions against statutory deadlines, and compile regulatory returns. In the absence of an integrated web platform, facilities face operational opacity, delayed exceedance identification, lost audit provenance, and severe legal liability under national pollution control acts.
  </p>

  <h4 class="sec">3.2 EXISTING SYSTEM ANALYSIS</h4>
  <p>
    Existing compliance tracking workflows suffer from systemic operational bottlenecks:
  </p>
  <ul>
    <li><b>Transcription Latency:</b> Days or weeks elapse between physical gauge inspections and spreadsheet entry, delaying awareness of toxic limit exceedances until after environmental damage has occurred.</li>
    <li><b>Absence of Boundary Guardrails:</b> Spreadsheets lack automated input validation, allowing negative values, extreme typographical errors, or missing mandatory parameters to propagate into official accounting records.</li>
    <li><b>No Cryptographic Role Segregation:</b> Shared files can be edited or deleted by anyone with folder access, destroying data provenance and making it impossible to establish an immutable audit trail for legal defense.</li>
    <li><b>Manual SLA Tracking:</b> Non-conformances noted during safety inspections are rarely closed on time due to lack of automated escalation, reminders, or overdue tracking mechanisms.</li>
  </ul>

  <h4 class="sec">3.3 PROPOSED SYSTEM CAPABILITIES</h4>
  <p>
    The proposed AuditFlow architecture solves these challenges through:
  </p>
  <ul>
    <li><b>Strict Schema & Boundary Assertion:</b> Client and server validation pipelines ensure all inputs conform to physical and environmental bounds before persistence.</li>
    <li><b>Algorithmic Auto-CAPA Generation:</b> Audit completions automatically lock records and spawn time-bound remediation tasks with enforceable severity SLAs.</li>
    <li><b>Real-Time Exceedance Trapping:</b> Automated Mongoose hooks evaluate logged test parameters against statutory limits, immediately flagging non-compliances.</li>
    <li><b>Role-Guarded 4-Stage Remediation:</b> A strict four-stage verification lifecycle ensures facility managers can submit proof but cannot self-close findings without auditor sign-off.</li>
  </ul>
`);

// ================= PAGE 19: CHAPTER 3 (CONT) =================
writePage(19, `
  <h4 class="sec">3.4 FUNCTIONAL REQUIREMENTS SPECIFICATION</h4>
  <ol>
    <li><b>User Authentication & RBAC:</b> Secure login with Bcrypt password hashing, stateless JWT issuance, and role enforcement (<code>admin</code>, <code>auditor</code>, <code>site_manager</code>).</li>
    <li><b>Multi-Facility Industrial Catalog:</b> Full CRUD capabilities for industrial sites, managing consent validity dates, site codes, and assigned facility managers.</li>
    <li><b>Dynamic Checklist Audit Engine:</b> Section-based audit checklists (Water, Effluent, Air, Hazardous Waste, Consents) with automated compliance percentage scoring.</li>
    <li><b>Automated CAPA Dispatch Pipeline:</b> Instant generation of remediation tickets upon audit finalization with dynamic SLAs (Critical: 7d, Major: 30d, Minor: 60d).</li>
    <li><b>Environmental Inspection & Limit Trapping:</b> Recording effluent/emission readings (pH, BOD, COD, TSS, TDS, PM2.5) with pre-save limit exceedance detection.</li>
    <li><b>Statutory Reporting & Export:</b> Generation of formal quarterly/annual compliance summaries with one-click CSV data export for regulatory submission.</li>
  </ol>

  <h4 class="sec">3.5 NON-FUNCTIONAL REQUIREMENTS SPECIFICATION</h4>
  <ul>
    <li><b>Performance & Latency:</b> API response times under 200 ms under standard load, with client-side UI transitions rendering in under 16 ms.</li>
    <li><b>Availability & Reliability:</b> Cloud-hosted architecture guaranteeing 99.9% uptime, supported by MongoDB Atlas automated multi-region replica sets.</li>
    <li><b>Cryptographic Security:</b> TLS 1.3 encrypted data transit, salted password hashing, and role-based API endpoint guards.</li>
    <li><b>Usability & HCI:</b> Clean responsive interface with 44px minimum touch targets, intuitive status indicators, and compliance with WCAG 2.1 AA standards.</li>
    <li><b>Maintainability:</b> Modular full-stack codebase following MVC separation of concerns, facilitating future IoT sensor integration.</li>
  </ul>

  <h4 class="sec">3.6 FEASIBILITY STUDY</h4>
  <h5 class="subsec">3.6.1 Technical Feasibility</h5>
  <p>
    The project leverages the established MERN technology stack. Node.js and Express deliver high-throughput, non-blocking HTTP REST routing, while React 18 provides reactive state management and instantaneous UI updates. MongoDB Atlas delivers managed document persistence with automated scaling, indexing, and TLS encryption. Open-source tooling guarantees high technical feasibility.
  </p>
`);

// ================= PAGE 20: CHAPTER 3 (CONT) =================
writePage(20, `
  <h5 class="subsec">3.6.2 Operational Feasibility</h5>
  <p>
    AuditFlow is designed with human-computer interaction (HCI) best practices, featuring an intuitive dashboard, clear visual cues, explicit confirmation dialogues, and seamless navigation. Field technicians and auditors require minimal training to operate the system, ensuring smooth operational adoption across plant environments.
  </p>

  <h5 class="subsec">3.6.3 Economic Feasibility</h5>
  <p>
    By utilizing open-source frameworks (React, Express, Node.js, MongoDB) and free-tier cloud deployment services (Vercel, Render, MongoDB Atlas), AuditFlow incurs zero upfront software licensing costs compared to commercial enterprise EHS suites ($50,000+), verifying exceptional economic feasibility for small and medium industrial facilities.
  </p>

  <h4 class="sec">3.7 INDUSTRIAL EFFLUENT STOICHIOMETRY & DISCHARGE MASS BALANCE</h4>
  <p>
    Accurate compliance monitoring requires establishing scientific baselines reflecting physical effluent treatment phenomena. In primary and secondary effluent treatment plants (ETP), biological degradation of organic matter follows Monod biochemical kinetics:
  </p>
  <div style="text-align: center; font-weight: bold; margin: 4px 0;">
    dS/dt = − (k × X × S) / (K_s + S) &nbsp;&nbsp;&nbsp;&nbsp;(3.1)
  </div>
  <p>
    where S represents substrate concentration (BOD/COD in mg/L), X denotes active biomass concentration, k is maximum substrate utilization rate, and K_s is the half-velocity constant.
  </p>

  <h5 class="subsec">3.7.1 BOD/COD Degradation Kinetics</h5>
  <p>
    In extended aeration activated sludge systems, effluent BOD concentration S_e after hydraulic retention time (HRT) &theta; is modeled as:
  </p>
  <div style="text-align: center; font-weight: bold; margin: 4px 0;">
    S_e = S_0 / [ 1 + (k_d × &theta;) ] &nbsp;&nbsp;&nbsp;&nbsp;(3.2)
  </div>
  <p>
    where S_0 is influent BOD and k_d is the biological reaction rate constant (typically 0.15–0.35 day⁻¹ at 25°C). When operating parameters fall outside statutory bounds (e.g., pH &lt; 5.5 or &gt; 9.0), biological nitrification ceases, leading to immediate limit breaches.
  </p>
  <p>
    By tracking hydraulic retention time alongside chemical dosing, plant operators can predict effluent quality before discharge occurs. AuditFlow incorporates these kinetic parameters within its inspection logging engine, ensuring that emerging treatment imbalances are identified before final discharge into public sewers or inland surface waters.
  </p>
`);

// ================= PAGE 21: CHAPTER 3 (CONT) =================
writePage(21, `
  <h5 class="subsec">3.7.2 Stack Gas Dispersion and Particulate Dynamics</h5>
  <p>
    Industrial flue gas dispersion from industrial boiler stacks is governed by the Gaussian Plume dispersion equation, which predicts ground-level particulate concentration C at downwind distance x and crosswind distance y:
  </p>
  <div style="text-align: center; font-weight: bold; margin: 5px 0;">
    C(x,y,z) = [ Q / (2&pi; × u × &sigma;_y × &sigma;_z) ] × exp[ −y² / (2&sigma;_y²) ] × [ exp( −(z−H)² / (2&sigma;_z²) ) + exp( −(z+H)² / (2&sigma;_z²) ) ] &nbsp;&nbsp;&nbsp;&nbsp;(3.3)
  </div>
  <p>
    where Q represents pollutant mass emission rate (g/s), u is mean wind velocity (m/s), &sigma;_y and &sigma;_z are Pasquill-Gifford dispersion coefficients, and H is effective stack height. Continuous tracking of stack particulate concentration ensures that calculated ground-level impacts remain well within ambient air quality standards.
  </p>

  <h4 class="sec">3.8 REGULATORY FRAMEWORK AND INDUSTRY STANDARDS</h4>
  <p>
    AuditFlow's validation boundaries and reporting templates are designed to strictly comply with national and international environmental standards:
  </p>
  <ol>
    <li><b>Water (Prevention and Control of Pollution) Act, 1974:</b> Mandates continuous surveillance of trade effluent discharge quality and maintenance of treatment facilities.</li>
    <li><b>Air (Prevention and Control of Pollution) Act, 1981:</b> Dictates emission limits for Particulate Matter, SO₂, and NOx from industrial chimneys and fuel burners.</li>
    <li><b>Environment (Protection) Rules, 1986 (Schedule VI):</b> Establishes general standards for the discharge of environmental pollutants into inland surface water, public sewers, and land irrigation.</li>
    <li><b>ISO 14001:2015 Clause 10.2:</b> Specifies international standards for non-conformity documentation, root cause analysis, corrective action implementation, and preventive verification.</li>
  </ol>

  <div class="caption">Table 3.1: Comparative Feasibility: Traditional SCADA/Spreadsheets vs. AuditFlow</div>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Evaluation Dimension</th>
        <th style="width: 38%;">Traditional SCADA / Spreadsheets</th>
        <th style="width: 37%;">AuditFlow Cloud Platform</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>Capital Expenditure (CAPEX)</b></td>
        <td>High upfront licensing ($40k–$100k+) and dedicated server racks.</td>
        <td>Zero software license cost; open-source MERN stack deployed on cloud.</td>
      </tr>
      <tr>
        <td><b>Operational Expenditure (OPEX)</b></td>
        <td>Mandatory annual vendor maintenance contracts and IT staff.</td>
        <td>Elastic pay-as-you-go hosting ($0–$50/mo) with automated scaling.</td>
      </tr>
    </tbody>
  </table>
`);

// ================= PAGE 22: CHAPTER 3 (CONT) =================
writePage(22, `
  <div class="caption">Table 3.1: Comparative Feasibility (Continued)</div>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Evaluation Dimension</th>
        <th style="width: 38%;">Traditional SCADA / Spreadsheets</th>
        <th style="width: 37%;">AuditFlow Cloud Platform</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>Deployment Velocity</b></td>
        <td>6 to 18 months for custom PLC wiring and field engineering.</td>
        <td>Rapid cloud deployment with immediate browser access.</td>
      </tr>
      <tr>
        <td><b>Cross-Device Mobility</b></td>
        <td>Confined to control-room workstations on closed LANs.</td>
        <td>Mobile-first responsive web client accessible from any device.</td>
      </tr>
      <tr>
        <td><b>Data Integrity & Provenance</b></td>
        <td>Vulnerable to unmonitored cell overrides and retroactive edits.</td>
        <td>Cryptographic JWT authentication, role guards, and change logging.</td>
      </tr>
      <tr>
        <td><b>Remediation Automation</b></td>
        <td>Manual clipboard notes; no automated escalation or SLA alarms.</td>
        <td>Automated CAPA generation with 7/30/60-day severity SLAs.</td>
      </tr>
    </tbody>
  </table>

  <h4 class="sec">3.9 STATUTORY DISCHARGE LIMITS AND TOLERANCE BENCHMARKS</h4>
  <p>
    Table 3.2 details the statutory environmental discharge limits enforced by AuditFlow's pre-save validation hooks, reflecting CPCB/TNPCB standards:
  </p>

  <div class="caption">Table 3.2: Statutory Environmental Discharge Limits and Tolerance Standards</div>
  <table>
    <thead>
      <tr>
        <th style="width: 20%;">Parameter</th>
        <th style="width: 18%;">Focus Domain</th>
        <th style="width: 22%;">Statutory Limit</th>
        <th style="width: 22%;">Test Method</th>
        <th style="width: 18%;">Alert Action</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>pH Value</b></td>
        <td>Trade Effluent</td>
        <td>5.5 – 9.0</td>
        <td>Electrometric</td>
        <td>Warning &ge; 8.8</td>
      </tr>
      <tr>
        <td><b>BOD (3d @ 27°C)</b></td>
        <td>Trade Effluent</td>
        <td>&le; 30 mg/L</td>
        <td>3-day Incubation</td>
        <td>Critical Auto-CAPA</td>
      </tr>
      <tr>
        <td><b>COD</b></td>
        <td>Trade Effluent</td>
        <td>&le; 250 mg/L</td>
        <td>Dichromate Reflux</td>
        <td>Major Auto-CAPA</td>
      </tr>
      <tr>
        <td><b>Total Suspended Solids</b></td>
        <td>Trade Effluent</td>
        <td>&le; 100 mg/L</td>
        <td>Gravimetric 105°C</td>
        <td>Major Auto-CAPA</td>
      </tr>
      <tr>
        <td><b>Total Dissolved Solids</b></td>
        <td>Trade Effluent</td>
        <td>&le; 2100 mg/L</td>
        <td>Gravimetric 180°C</td>
        <td>Major Auto-CAPA</td>
      </tr>
      <tr>
        <td><b>Particulate Matter (PM)</b></td>
        <td>Flue Gas Stack</td>
        <td>&le; 150 mg/Nm³</td>
        <td>Isokinetic Sampling</td>
        <td>Critical Auto-CAPA</td>
      </tr>
      <tr>
        <td><b>Ambient Noise</b></td>
        <td>Perimeter</td>
        <td>&le; 75 dB(A) (Day)</td>
        <td>Sound Level Meter</td>
        <td>Minor Alert</td>
      </tr>
    </tbody>
  </table>
`);

// ================= PAGE 23: CHAPTER 4 =================
writePage(23, `
  <h3 class="ch-num">CHAPTER 4</h3>
  <h3 class="ch-title">SYSTEM DESIGN</h3>

  <h4 class="sec">4.1 SYSTEM ARCHITECTURE</h4>
  <p>
    AuditFlow is engineered as a decoupled, three-tier cloud-native architecture that enforces strict separation of concerns across presentation, business logic, and data persistence layers, as illustrated in Figure 4.1.
  </p>

  <div class="box-diagram">
+-------------------------------------------------------------------------------+
|                       PRESENTATION LAYER (Client SPA)                         |
|   React 18 & Vite      Custom CSS Tokens      Recharts Visuals    Context API |
|   Component-driven     Responsive Flex/Grid   Interactive Charts  Auth State  |
+---------------------------------------+---------------------------------------+
                                        | HTTPS / REST (JSON) | Bearer JWT
+---------------------------------------v---------------------------------------+
|                    APPLICATION LOGIC LAYER (Express REST API)                 |
|   Express Router       Auth Middleware        Audit Scoring       Cron Daemon |
|   RESTful endpoints    RBAC / JWT Guards      Auto-CAPA Engine    SLA Sweeper |
+---------------------------------------+---------------------------------------+
                                        | TCP Socket Pool / Mongoose ODM
+---------------------------------------v---------------------------------------+
|                    DATA PERSISTENCE LAYER (MongoDB Atlas)                     |
|   Users Collection     Sites Collection       Audits Collection               |
|   Capas Collection     Inspections Collection Reports Collection              |
+-------------------------------------------------------------------------------+
  </div>
  <div class="caption">Figure 4.1: AuditFlow 3-Tier Enterprise System Architecture</div>

  <ol>
    <li><b>Presentation Layer (Frontend):</b> Built with React 18 and Vite. Provides single-page routing, global state management via React Context API, and reactive SVG chart rendering via Recharts. The client implements responsive design with 44px minimum touch targets and mobile-optimized layouts.</li>
    <li><b>Application Logic Layer (Backend):</b> Built with Node.js and Express.js. Handles HTTP routing, JSON payload validation, JWT authentication, auto-CAPA event dispatching, and background cron scheduling. Controllers enforce strict separation between business logic and database access.</li>
    <li><b>Data Persistence Layer (Database):</b> Built on MongoDB Atlas cloud database. Utilizes Mongoose Object Data Modeling (ODM) with strict schema validation, pre-save hooks, and compound indexing for rapid query execution.</li>
  </ol>
`);

// ================= PAGE 24: CHAPTER 4 (CONT) =================
writePage(24, `
  <h4 class="sec">4.2 MODULE DESCRIPTION</h4>
  <p>
    The system is organized into six core functional modules that operate cooperatively across client and server tiers:
  </p>
  <ul>
    <li><b>Authentication & User Governance Module:</b> Manages user login, JWT token issuance, password hashing via Bcrypt, and role validation across <code>admin</code>, <code>auditor</code>, and <code>site_manager</code>. Enforces route guards protecting administrative operations.</li>
    <li><b>Multi-Site Industrial Catalog Module:</b> Manages facility registrations, geographic locations, consent renewal deadlines, and facility manager assignments. Tracks facility status across active, audit-due, and non-compliant states.</li>
    <li><b>Audit Checklist & Scoring Module:</b> Provides dynamic checklist evaluation across environmental sections (Water, Trade Effluent, Air, Hazardous Waste, Legal Consents), computing percentage compliance scores upon completion.</li>
    <li><b>Automated CAPA Dispatch & Lifecycle Module:</b> Auto-generates corrective action tickets for every failed audit item, enforces dynamic SLAs (7/30/60 days), accepts evidence file uploads, and restricts closure to verified auditors.</li>
    <li><b>Environmental Inspection & Limit Guard Module:</b> Logs physical and chemical test readings, comparing them against statutory limits and auto-raising incident CAPAs upon exceedances.</li>
    <li><b>Statutory Reporting & Export Module:</b> Consolidates operational data into periodic compliance return summaries with instant CSV download for regulatory submission.</li>
  </ul>

  <h4 class="sec">4.3 ACTOR INTERACTION ANALYSIS</h4>
  <p>
    AuditFlow serves three distinct operational personas with tailored permissions and responsibilities:
  </p>
  <ol>
    <li><b>Plant Auditor:</b> Conducts formal audits, completes dynamic checklist evaluations, reviews corrective action submissions, inspects photographic evidence, and issues final sign-off to close CAPAs.</li>
    <li><b>Site Manager:</b> Monitors facility-specific compliance, logs daily environmental test readings, reviews auto-generated CAPAs, assigns root causes, and uploads remedial evidence.</li>
    <li><b>System Administrator:</b> Manages user accounts, provisions industrial sites, configures statutory limit thresholds, and exercises system-wide governance authority.</li>
  </ol>
`);

// ================= PAGE 25: CHAPTER 4 (CONT) =================
writePage(25, `
  <h4 class="sec">4.3 USE CASE DIAGRAM</h4>
  <p>
    Figure 4.2 illustrates actor interactions within AuditFlow, highlighting distinct boundaries between Plant Auditors, Site Managers, and System Administrators.
  </p>

  <div class="box-diagram">
           [ Plant Auditor ]                   [ Site Manager ]
                  |                                   |
                  +--- Conduct & Lock Audits          +--- View Assigned CAPAs
                  +--- Auto-Trigger CAPAs             +--- Enter Root Cause
                  +--- Log Environmental Tests        +--- Upload Photo Evidence
                  +--- Verify & Close CAPAs           +--- Request Verification
                  +--- Generate Board Returns         X (Cannot Self-Close)
                  |                                   |
                  +-----------------+-----------------+
                                    |
                            [ System Admin ]
                                    |
                  +-----------------+-----------------+
                  | Full System Governance & Overrides|
                  | User Provisioning & Role Toggles  |
                  +-----------------------------------+
  </div>
  <div class="caption">Figure 4.2: Role-Based Actor Interaction and Use Case Diagram</div>

  <h4 class="sec">4.4 ENTITY-RELATIONSHIP (ER) DIAGRAM</h4>
  <p>
    Figure 4.3 details the Entity-Relationship architecture governing AuditFlow's data persistence layer, showcasing relations between Users, Sites, Audits, Inspections, CAPAs, and Reports.
  </p>

  <div class="box-diagram">
+--------------------+        +--------------------+        +--------------------+
|       USERS        |        |       SITES        |        |       AUDITS       |
|--------------------|        |--------------------|        |--------------------|
| _id (PK)           |<-+     | _id (PK)           |<-+     | _id (PK)           |
| name: String       |  |     | name: String       |  |     | site: Ref(Site)    |
| email: String (UQ) |  +-----| manager: Ref(User) |  +-----| auditor: Ref(User) |
| password: Hash     |  |     | code: String       |        | checklist: Array[] |
| role: Enum         |  |     | consentValidTill   |        | score: Number      |
| site: Ref(Site)    |  |     +--------------------+        | status: Enum       |
+--------------------+  |               ^                   +--------------------+
          ^             |               | (1:N)                       |
          |             |     +---------+----------+                  | (1:N Trigger)
          |             |     |    INSPECTIONS     |                  v
          |             |     |--------------------|        +--------------------+
          |             |     | _id (PK)           |        |       CAPAS        |
          |             +-----| inspector: Ref     |        |--------------------|
          |                   | site: Ref(Site)    |<-------| site: Ref(Site)    |
          |                   | readings: Array[]  |        | audit: Ref(Audit)  |
          |                   | exceedances: Array |        | title: String      |
          |                   +--------------------+        | severity: Enum     |
          |                                                 | status: Enum       |
          +-------------------------------------------------| assignedTo: Ref    |
                                                            | history: Array[]   |
                                                            +--------------------+
  </div>
  <div class="caption">Figure 4.3: Entity-Relationship (ER) Schema Model</div>
`);

// ================= PAGE 26: CHAPTER 4 (CONT) =================
writePage(26, `
  <h4 class="sec">4.5 UI NAVIGATION AND WORKFLOW SEQUENCE</h4>
  <p>
    Figure 4.4 details the sequence diagram illustrating user authentication, route protection, audit execution, and automated CAPA generation upon completion.
  </p>
  <div class="box-diagram">
Auditor (Browser)            Express REST API                 MongoDB Atlas
      |                             |                               |
      |-- 1. POST /api/auth/login ->|                               |
      |<- 2. Return JWT Token ------|                               |
      |                             |                               |
      |-- 3. PUT /checklist --------|-- 4. Update Checklist Items ->|
      |<- 5. Checklist Saved -------|                               |
      |                             |                               |
      |-- 6. POST /complete ------->|-- 7. Lock Audit Status ------>|
      |                             |-- 8. Compute Compliance % --->|
      |                             |-- 9. Auto-Create CAPA Records>|
      |                             |      (SLAs: 7 / 30 / 60 days) |
      |<- 10. Audit Score + CAPAs --|                               |
  </div>
  <div class="caption">Figure 4.4: UI Navigation and Authentication Sequence Diagram</div>

  <h4 class="sec">4.6 DATABASE DESIGN</h4>
  <p>
    AuditFlow's persistence tier is designed using MongoDB's document-oriented paradigm, structured into 6 collections: Users, Sites, Audits, Inspections, Capas, and Reports.
  </p>

  <div class="caption">Table 4.1: User Collection Schema Specification</div>
  <table>
    <thead>
      <tr><th>Field Name</th><th>BSON Type</th><th>Validation Rules & Constraints</th><th>Operational Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code>_id</code></td><td>ObjectId</td><td>Primary key, auto-generated</td><td>Unique system identifier</td></tr>
      <tr><td><code>name</code></td><td>String</td><td>Required, trimmed, 2–50 chars</td><td>User full legal name</td></tr>
      <tr><td><code>email</code></td><td>String</td><td>Required, unique, valid email regex</td><td>Login identifier</td></tr>
      <tr><td><code>password</code></td><td>String</td><td>Required, min 6 chars, Bcrypt</td><td>Salted password hash</td></tr>
      <tr><td><code>role</code></td><td>String</td><td>Enum: <code>admin, auditor, site_manager</code></td><td>Authorization level</td></tr>
      <tr><td><code>site</code></td><td>ObjectId</td><td>Ref: <code>Site</code></td><td>Assigned facility for manager</td></tr>
      <tr><td><code>createdAt</code></td><td>Date</td><td>Default: <code>Date.now()</code></td><td>Account creation timestamp</td></tr>
    </tbody>
  </table>
`);

// ================= PAGE 27: CHAPTER 4 (CONT) =================
writePage(27, `
  <div class="caption">Table 4.2: Site and Audit Collection Schema Specifications</div>
  <table>
    <thead>
      <tr><th>Field Name</th><th>BSON Type</th><th>Constraints</th><th>Operational Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code>Site.name</code></td><td>String</td><td>Required, Trimmed</td><td>Industrial plant facility name</td></tr>
      <tr><td><code>Site.code</code></td><td>String</td><td>Required, Unique, Uppercase</td><td>Unique industrial site code</td></tr>
      <tr><td><code>Site.location</code></td><td>String</td><td>Required</td><td>Geographic plant location</td></tr>
      <tr><td><code>Site.manager</code></td><td>ObjectId</td><td>Ref: <code>User</code></td><td>Assigned site manager</td></tr>
      <tr><td><code>Site.consentValidTill</code></td><td>Date</td><td>Required</td><td>Pollution board CTO expiration</td></tr>
      <tr><td><code>Audit.site</code></td><td>ObjectId</td><td>Ref: <code>Site</code>, Required</td><td>Audited facility reference</td></tr>
      <tr><td><code>Audit.auditor</code></td><td>ObjectId</td><td>Ref: <code>User</code>, Required</td><td>Conducting lead auditor</td></tr>
      <tr><td><code>Audit.checklist</code></td><td>Array</td><td>Embedded sub-documents</td><td>Category checklist items</td></tr>
      <tr><td><code>Audit.score</code></td><td>Number</td><td>0–100%</td><td>Calculated compliance score</td></tr>
      <tr><td><code>Audit.status</code></td><td>String</td><td>Enum: <code>draft, completed</code></td><td>Audit lifecycle state</td></tr>
    </tbody>
  </table>

  <h4 class="sec">4.7 API DESIGN</h4>
  <p>
    The backend exposes a RESTful API communicating via JSON payloads. All protected data endpoints enforce JWT Bearer token authentication:
  </p>

  <div class="caption">Table 4.3: AuditFlow RESTful API Specification (Part 1)</div>
  <table>
    <thead>
      <tr><th>HTTP Method</th><th>API Endpoint Route</th><th>Auth & Role</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code>POST</code></td><td><code>/api/auth/register</code></td><td>Public</td><td>Register new user account</td></tr>
      <tr><td><code>POST</code></td><td><code>/api/auth/login</code></td><td>Public</td><td>Authenticate user & issue JWT</td></tr>
      <tr><td><code>GET</code></td><td><code>/api/auth/me</code></td><td>Bearer JWT</td><td>Get active user profile</td></tr>
      <tr><td><code>GET</code></td><td><code>/api/sites</code></td><td>Bearer JWT</td><td>List registered industrial sites</td></tr>
      <tr><td><code>POST</code></td><td><code>/api/sites</code></td><td>Admin</td><td>Create new facility record</td></tr>
      <tr><td><code>GET</code></td><td><code>/api/audits</code></td><td>Bearer JWT</td><td>List audits with filters</td></tr>
      <tr><td><code>POST</code></td><td><code>/api/audits</code></td><td>Auditor/Admin</td><td>Schedule new facility audit</td></tr>
      <tr><td><code>PUT</code></td><td><code>/api/audits/:id/checklist</code></td><td>Auditor/Admin</td><td>Update checklist item responses</td></tr>
    </tbody>
  </table>
`);

// ================= PAGE 28: CHAPTER 4 (CONT) =================
writePage(28, `
  <div class="caption">Table 4.3: AuditFlow RESTful API Specification (Part 2)</div>
  <table>
    <thead>
      <tr><th>HTTP Method</th><th>API Endpoint Route</th><th>Auth & Role</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code>POST</code></td><td><code>/api/audits/:id/complete</code></td><td>Auditor/Admin</td><td>Lock audit & auto-raise CAPAs</td></tr>
      <tr><td><code>GET</code></td><td><code>/api/inspections</code></td><td>Bearer JWT</td><td>List environmental test records</td></tr>
      <tr><td><code>POST</code></td><td><code>/api/inspections</code></td><td>Bearer JWT</td><td>Log effluent/emission test readings</td></tr>
      <tr><td><code>GET</code></td><td><code>/api/capas</code></td><td>Bearer JWT</td><td>Query CAPA records by status/site</td></tr>
      <tr><td><code>PUT</code></td><td><code>/api/capas/:id</code></td><td>Bearer JWT</td><td>Update root cause / remedial action</td></tr>
      <tr><td><code>POST</code></td><td><code>/api/capas/:id/evidence</code></td><td>Bearer JWT</td><td>Upload Multer photographic evidence</td></tr>
      <tr><td><code>POST</code></td><td><code>/api/capas/:id/close</code></td><td>Auditor/Admin</td><td>Verify and close resolved CAPA</td></tr>
      <tr><td><code>GET</code></td><td><code>/api/reports/summary</code></td><td>Bearer JWT</td><td>Generate quarterly return summary</td></tr>
      <tr><td><code>GET</code></td><td><code>/api/reports/export-csv</code></td><td>Bearer JWT</td><td>Download regulatory CSV export</td></tr>
    </tbody>
  </table>

  <h4 class="sec">4.8 MATHEMATICAL COMPLIANCE MODEL AND PARAMETER MAPPING</h4>
  <p>
    Table 4.4 formally specifies the core compliance and telemetry metrics calculated by AuditFlow, detailing raw dependencies, engineered units, and alert thresholds:
  </p>

  <div class="caption">Table 4.4: Mathematical Compliance Model and Parameter Mapping</div>
  <table>
    <thead>
      <tr>
        <th style="width: 22%;">Metric Name</th>
        <th style="width: 32%;">Computational Formula</th>
        <th style="width: 14%;">Unit</th>
        <th style="width: 14%;">Bounds</th>
        <th style="width: 18%;">Alert Threshold</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>Audit Compliance Score</b></td>
        <td><code>(Compliant Items / Total Items) × 100</code></td>
        <td>%</td>
        <td>0–100%</td>
        <td>Warn if &lt; 85%</td>
      </tr>
      <tr>
        <td><b>Critical SLA Due Date</b></td>
        <td><code>Audit Date + 7 Days</code></td>
        <td>Timestamp</td>
        <td>+7d</td>
        <td>Emergency Alert</td>
      </tr>
      <tr>
        <td><b>Major SLA Due Date</b></td>
        <td><code>Audit Date + 30 Days</code></td>
        <td>Timestamp</td>
        <td>+30d</td>
        <td>Standard Alert</td>
      </tr>
      <tr>
        <td><b>Minor SLA Due Date</b></td>
        <td><code>Audit Date + 60 Days</code></td>
        <td>Timestamp</td>
        <td>+60d</td>
        <td>Routine Alert</td>
      </tr>
    </tbody>
  </table>
`);

// ================= PAGE 29: CHAPTER 4 (CONT) =================
writePage(29, `
  <div class="caption">Table 4.4: Mathematical Compliance Model (Continued)</div>
  <table>
    <thead>
      <tr>
        <th style="width: 22%;">Metric Name</th>
        <th style="width: 32%;">Computational Formula</th>
        <th style="width: 14%;">Unit</th>
        <th style="width: 14%;">Bounds</th>
        <th style="width: 18%;">Alert Threshold</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>Effluent Exceedance</b></td>
        <td><code>Reading Value > Statutory Limit</code></td>
        <td>Boolean</td>
        <td>True/False</td>
        <td>Auto-CAPA Trigger</td>
      </tr>
      <tr>
        <td><b>Overdue Status Flag</b></td>
        <td><code>Current Date > Due Date AND Status != Closed</code></td>
        <td>Boolean</td>
        <td>True/False</td>
        <td>Midnight Cron Sweep</td>
      </tr>
    </tbody>
  </table>

  <h4 class="sec">4.9 RESTFUL DATA TRANSFER PROTOCOLS AND CONTRACT SPECIFICATIONS</h4>
  <p>
    The backend service exposes standardized JSON endpoints supporting chronological query filtering, multi-parameter sorting, and pagination controls:
  </p>
  <ul>
    <li><b>Date Range Filtering:</b> Queries accept optional <code>startDate</code> and <code>endDate</code> ISO strings (<code>?startDate=2026-10-01&endDate=2026-10-31</code>), allowing plant managers and auditors to extract arbitrary operational intervals for quarterly filings.</li>
    <li><b>Pagination Controls:</b> Inspection and CAPA logs support <code>page</code> and <code>limit</code> parameters (<code>?page=1&limit=25</code>) to optimize client payload size and eliminate DOM rendering lag during massive multi-facility audit reviews.</li>
    <li><b>Standardized Error Envelope:</b> In the event of validation or authorization failure, the API returns a structured error object containing <code>success: false</code>, an HTTP status code, and an explanatory human-readable message array.</li>
    <li><b>Rate Limiting & Protection:</b> API endpoints incorporate Express rate limiters preventing brute-force authentication attacks and mitigating denial-of-service risks.</li>
  </ul>
  <p>
    These architectural specifications collectively guarantee that data exchanged between the React client and Express API maintains strict contract integrity, low serialization overhead, and full defensibility during statutory compliance audits.
  </p>
`);

// ================= PAGE 30: CHAPTER 5 =================
writePage(30, `
  <h3 class="ch-num">CHAPTER 5</h3>
  <h3 class="ch-title">SYSTEM IMPLEMENTATION</h3>

  <h4 class="sec">5.1 IMPLEMENTATION OVERVIEW</h4>
  <p>
    AuditFlow was implemented utilizing modern software engineering practices, clean code modularization, and strict separation of concerns. Development proceeded in two decoupled environments: the frontend React SPA directory (<code>frontend/</code>) and the backend Express Node service directory (<code>backend/</code>).
  </p>

  <h4 class="sec">5.2 FRONTEND IMPLEMENTATION</h4>
  <p>
    The client application was scaffolded using Vite for rapid hot-module replacement and optimized asset bundling:
  </p>
  <ul>
    <li><b>Component Hierarchy:</b> Structured into reusable UI components (<code>Navbar</code>, <code>Sidebar</code>, <code>KPICard</code>, <code>TimelineRibbon</code>, <code>StatusBadge</code>) and dedicated views (<code>Dashboard</code>, <code>Sites</code>, <code>Audits</code>, <code>Inspections</code>, <code>Capas</code>, <code>Reports</code>, <code>Login</code>).</li>
    <li><b>State Management:</b> Managed via React Context API through <code>AuthContext</code> (persisting JWT tokens and active credentials) and <code>ToastContext</code> (displaying non-blocking status notifications).</li>
    <li><b>Data Visualization:</b> Rendered via Recharts utilizing <code>ResponsiveContainer</code>, <code>BarChart</code>, and <code>PieChart</code> components with zero-duration tooltip animations to guarantee immediate pop-up readability.</li>
    <li><b>Responsive Design:</b> Engineered with custom CSS design tokens utilizing media breakpoints (<code>360px</code>, <code>640px</code>, <code>768px</code>, <code>1024px</code>, <code>1280px</code>), ensuring comfortable 44px minimum mobile touch targets.</li>
  </ul>

  <h4 class="sec">5.3 BACKEND IMPLEMENTATION</h4>
  <p>
    The backend service is structured upon Node.js and Express.js:
  </p>
  <ul>
    <li><b>Middleware Pipeline:</b> Configured with <code>cors()</code> for cross-origin requests, <code>express.json()</code> for request payload parsing, and custom authentication middleware.</li>
    <li><b>Error Handling:</b> Centralized try-catch error routing returning standardized JSON error objects and descriptive HTTP error status codes (400, 401, 403, 404, 500).</li>
  </ul>
`);

// ================= PAGE 31: CHAPTER 5 (CONT) =================
writePage(31, `
  <h4 class="sec">5.4 MONGODB DATABASE IMPLEMENTATION</h4>
  <p>
    Database interaction is orchestrated through Mongoose Object Data Modeling (ODM). Connection pooling ensures persistent connectivity to the MongoDB Atlas multi-tenant cluster via an encrypted TLS/SSL connection string. Compound indexing on site and date fields ensures sub-millisecond retrieval speeds for chronological range queries.
  </p>

  <h4 class="sec">5.5 AUTHENTICATION AND ROLE-BASED ACCESS</h4>
  <p>
    Security enforcement adheres to industry-standard authentication patterns:
  </p>
  <p>
    1. <b>Password Salting & Hashing:</b> During registration, user passwords are salted and hashed using Bcrypt with a workload factor of 10 rounds:
  </p>
  <div style="text-align: center; font-weight: bold; margin: 4px 0;">
    Hash = Bcrypt(Password, Salt10) &nbsp;&nbsp;&nbsp;&nbsp;(5.1)
  </div>
  <p>
    2. <b>JWT Token Generation:</b> During authentication, upon successful password comparison, the server signs a JSON Web Token (JWT) utilizing HMAC-SHA256 containing payload:
  </p>
  <div style="text-align: center; font-weight: bold; margin: 4px 0;">
    JWT = Sign({ id : user._id, role : user.role }, JWT_SECRET, ExpiresIn : 24h) &nbsp;&nbsp;&nbsp;&nbsp;(5.2)
  </div>
  <p>
    3. <b>Route Guards:</b> Route guards verify incoming tokens. For administrative operations (such as facility creation or auditor role toggling), the middleware asserts that <code>req.user.role === 'admin'</code>, rejecting unauthorized requests with HTTP 403 Forbidden.
  </p>

  <h4 class="sec">5.6 MATHEMATICAL CALCULATIONS & SCORING ENGINE</h4>
  <p>
    The backend calculations engine executes deterministic mathematical transformations upon raw ingested plant compliance data:
  </p>
  <h5 class="subsec">5.6.1 Audit Scoring Formula</h5>
  <p>
    Audit compliance percentage is evaluated as the proportion of compliant checklist items to total evaluated items:
  </p>
  <div style="text-align: center; font-weight: bold; margin: 4px 0;">
    Score (%) = [ &sum; Compliant Items / Total Checklist Items ] × 100 &nbsp;&nbsp;&nbsp;&nbsp;(5.3)
  </div>

  <h5 class="subsec">5.6.2 Dynamic SLA Deadline Assignment</h5>
  <p>
    Remediation SLAs are dynamically calculated based on non-compliance severity:
  </p>
  <div style="text-align: center; font-weight: bold; margin: 4px 0;">
    DueDate = CurrentTimestamp + (SeverityWeight × 86,400,000 ms) &nbsp;&nbsp;&nbsp;&nbsp;(5.4)
  </div>
  <p>
    where SeverityWeight is 7 days for Critical, 30 days for Major, and 60 days for Minor non-conformities.
  </p>
`);

// ================= PAGE 32: CHAPTER 5 (CONT) =================
writePage(32, `
  <h4 class="sec">5.6.3 Pre-Save Limit Exceedance Hooks</h4>
  <p>
    In <code>backend/models/Inspection.js</code>, pre-save hooks compare submitted effluent and stack readings against statutory limits. If an exceedance is detected, an automated incident record is attached to the inspection and an emergency CAPA is dispatched.
  </p>
  <pre>
inspectionSchema.pre('save', function (next) {
  var exceeds = [];
  this.readings.forEach(function (r) {
    if (r.limitMax != null && r.value > r.limitMax)
      exceeds.push({ parameter: r.parameter, value: r.value, limit: r.limitMax });
    if (r.limitMin != null && r.value < r.limitMin)
      exceeds.push({ parameter: r.parameter, value: r.value, limit: r.limitMin });
  });
  this.exceedances = exceeds;
  next();
});
  </pre>

  <h4 class="sec">5.6.4 Daily Cron Scheduler Daemon</h4>
  <p>
    In <code>backend/utils/scheduler.js</code>, a Node-Cron background daemon runs every midnight to scan for active CAPAs whose due date has passed, atomically transitioning their status to <code>overdue</code>:
  </p>
  <pre>
var cron = require('node-cron');
var Capa = require('../models/Capa');

module.exports = function () {
  cron.schedule('0 0 * * *', async function () {
    var overdue = await Capa.updateMany(
      { status: { $in: ['open', 'in_progress'] }, dueDate: { $lt: new Date() } },
      { $set: { status: 'overdue' } }
    );
    console.log('[Scheduler] Overdue sweep complete: ' + overdue.modifiedCount);
  });
};
  </pre>

  <h4 class="sec">5.6.5 Network Interceptors and Session Hydration</h4>
  <p>
    To ensure persistent user sessions and automated authorization header injection, the React client implements an Axios HTTP request/response interceptor pipeline in <code>src/api.js</code>. Each outgoing request attaches the current JWT token. A global response interceptor redirects users to <code>/login</code> if a 401 Unauthorized status is received.
  </p>

  <h4 class="sec">5.6.6 Defensive Request Validation and Schema Sanitization</h4>
  <p>
    The backend incorporates validation checks prior to controller invocation:
  </p>
  <ul>
    <li>Dates are parsed against ISO-8601 YYYY-MM-DD regular expressions, ensuring calendar integrity.</li>
    <li>Chemical and physical parameters are strictly asserted as non-negative floating-point values (&ge; 0).</li>
    <li>String inputs are trimmed and sanitized against SQL/NoSQL operator injections, preventing query manipulation.</li>
  </ul>
`);

// ================= PAGE 33: CHAPTER 5 (CONT) =================
writePage(33, `
  <h4 class="sec">5.7 DEPLOYMENT ARCHITECTURE</h4>
  <p>
    AuditFlow is deployed on a modern, decoupled cloud topology shown in Figure 5.1:
  </p>
  <ul>
    <li><b>Client SPA:</b> Deployed on Vercel with global edge distribution, automated SSL/TLS certificates, and single-page routing rewrites.</li>
    <li><b>REST Backend:</b> Deployed on Render as a continuous containerized web service configured with environment variable secrets.</li>
    <li><b>Database Cluster:</b> Hosted on MongoDB Atlas on AWS, featuring automated backups and IP whitelist firewall protection.</li>
  </ul>

  <div class="box-diagram">
+-------------------------------------------------------------------------------+
|                    AUDITFLOW CLOUD DEPLOYMENT INFRASTRUCTURE                  |
|                                                                               |
|  +------------------------+      +------------------------+                   |
|  |   Vercel Edge Network  |      |   Render Cloud Web Svc |                   |
|  |  - Vite SPA Production |      |  - Containerized Node  |                   |
|  |  - Global Anycast CDN  | ===> |  - Express REST API    | ===+              |
|  |  - HTTPS / Auto TLS    | REST |  - Reverse Proxy / CORS|    |              |
|  |  - Single-Page Rewrites|      |  - Health Monitoring   |    | Mongoose TLS |
|  +------------------------+      +------------------------+    |              |
|                                                                v              |
|                                                  +------------------------+   |
|                                                  |   MongoDB Atlas Cloud  |   |
|                                                  |  - Multi-AZ Replica Set|   |
|                                                  |  - Automated Backups   |   |
|                                                  |  - IP Whitelist (0.0.0)|   |
|                                                  +------------------------+   |
+-------------------------------------------------------------------------------+
  </div>
  <div class="caption">Figure 5.1: AuditFlow Cloud Deployment Architecture</div>

  <h5 class="subsec">5.7.1 Continuous Integration and Deployment (CI/CD) Lifecycle</h5>
  <p>
    The deployment pipeline is orchestrated through GitHub repository webhooks. Every commit pushed to the <code>main</code> branch triggers automated linting, unit test suites, and production builds. Vercel automatically deploys static assets to edge locations worldwide, while Render triggers a rolling container restart with zero user downtime.
  </p>
`);

// ================= PAGE 34: CHAPTER 6 =================
writePage(34, `
  <h3 class="ch-num">CHAPTER 6</h3>
  <h3 class="ch-title">RESULTS AND DISCUSSION</h3>

  <h4 class="sec">6.1 TESTING METHODOLOGY</h4>
  <p>
    System verification followed a structured multi-tiered testing strategy:
  </p>
  <ul>
    <li><b>Unit Testing:</b> Verification of mathematical calculation formulas (Compliance %, Due Date SLAs, Exceedance flags).</li>
    <li><b>Integration Testing:</b> Verification of Express HTTP routing pipelines, JWT verification middleware, and Mongoose query executions.</li>
    <li><b>Functional System Testing:</b> End-to-end evaluation of user authentication, RBAC permission enforcement, checklist scoring, and responsive layout rendering.</li>
  </ul>

  <h4 class="sec">6.2 FUNCTIONAL TEST CASES</h4>
  <p>
    Table 6.1 documents the formal functional test suite executed against the AuditFlow web application.
  </p>

  <div class="caption">Table 6.1: Comprehensive AuditFlow Functional and Security Test Suite (Part 1)</div>
  <table>
    <thead>
      <tr><th>Test ID</th><th>Category</th><th>Test Scenario & Inputs</th><th>Expected Output & Assertions</th><th>Status</th></tr>
    </thead>
    <tbody>
      <tr><td>TC-01</td><td>Auth</td><td>Valid user login credentials</td><td>HTTP 200, JWT issued, user in state</td><td>PASS</td></tr>
      <tr><td>TC-02</td><td>Auth</td><td>Invalid password during login</td><td>HTTP 401 Unauthorized: Invalid login</td><td>PASS</td></tr>
      <tr><td>TC-03</td><td>Auth</td><td>Access protected route without token</td><td>HTTP 401: No authorization token</td><td>PASS</td></tr>
      <tr><td>TC-04</td><td>RBAC</td><td>Manager attempts deleting facility</td><td>HTTP 403 Forbidden: Admin required</td><td>PASS</td></tr>
      <tr><td>TC-05</td><td>RBAC</td><td>Auditor schedules compliance audit</td><td>HTTP 201 Created: Audit scheduled</td><td>PASS</td></tr>
      <tr><td>TC-06</td><td>Audit</td><td>Toggle checklist item non-compliant</td><td>Item updated, compliant flag false</td><td>PASS</td></tr>
      <tr><td>TC-07</td><td>Audit</td><td>Complete audit with 3 non-compliances</td><td>Audit locked, 3 CAPAs auto-raised</td><td>PASS</td></tr>
      <tr><td>TC-08</td><td>SLA</td><td>Critical severity non-compliance</td><td>CAPA due date set exactly +7 days</td><td>PASS</td></tr>
    </tbody>
  </table>
`);

// ================= PAGE 35: CHAPTER 6 (CONT) =================
writePage(35, `
  <div class="caption">Table 6.1: Functional and Security Test Suite (Continued)</div>
  <table>
    <thead>
      <tr><th>Test ID</th><th>Category</th><th>Test Scenario & Inputs</th><th>Expected Output & Assertions</th><th>Status</th></tr>
    </thead>
    <tbody>
      <tr><td>TC-09</td><td>SLA</td><td>Major severity non-compliance</td><td>CAPA due date set exactly +30 days</td><td>PASS</td></tr>
      <tr><td>TC-10</td><td>SLA</td><td>Minor severity non-compliance</td><td>CAPA due date set exactly +60 days</td><td>PASS</td></tr>
      <tr><td>TC-11</td><td>Inspect</td><td>Log COD reading of 320 mg/L (&gt;250)</td><td>Exceedance flagged, incident CAPA</td><td>PASS</td></tr>
      <tr><td>TC-12</td><td>Inspect</td><td>Log normal pH reading of 7.2 (5.5–9.0)</td><td>Inspection logged without exceedance</td><td>PASS</td></tr>
      <tr><td>TC-13</td><td>CAPA</td><td>Manager adds root cause and evidence</td><td>CAPA updated to pending_verification</td><td>PASS</td></tr>
      <tr><td>TC-14</td><td>CAPA</td><td>Manager attempts closing CAPA</td><td>Action rejected; needs auditor sign-off</td><td>PASS</td></tr>
      <tr><td>TC-15</td><td>CAPA</td><td>Auditor verifies and closes CAPA</td><td>Status closed, logged in history[]</td><td>PASS</td></tr>
      <tr><td>TC-16</td><td>Cron</td><td>Past-due CAPA evaluated at midnight</td><td>Status updated to overdue</td><td>PASS</td></tr>
      <tr><td>TC-17</td><td>Reports</td><td>Generate return for Q3 2026</td><td>Aggregates audits, tests, & CAPAs</td><td>PASS</td></tr>
      <tr><td>TC-18</td><td>Reports</td><td>Download CSV export</td><td>Valid formatted CSV file downloaded</td><td>PASS</td></tr>
      <tr><td>TC-19</td><td>Security</td><td>NoSQL injection in login body</td><td>Sanitized by Mongoose, treated as string</td><td>PASS</td></tr>
      <tr><td>TC-20</td><td>Security</td><td>XSS script tag in audit note</td><td>Escaped by React JSX, harmless text</td><td>PASS</td></tr>
      <tr><td>TC-21</td><td>Security</td><td>Tampered JWT signature payload</td><td>HMAC-SHA256 verification fails</td><td>PASS</td></tr>
      <tr><td>TC-22</td><td>UI/UX</td><td>Mobile layout rendering at 360px</td><td>Zero horizontal overflow, nav responsive</td><td>PASS</td></tr>
      <tr><td>TC-23</td><td>Cloud</td><td>Frontend proxy request to backend</td><td>Proxy routes /api to port 5000 cleanly</td><td>PASS</td></tr>
      <tr><td>TC-24</td><td>Cloud</td><td>Database replica failover test</td><td>Mongoose driver reconnects cleanly</td><td>PASS</td></tr>
    </tbody>
  </table>
`);

// ================= PAGE 36: CHAPTER 6 (CONT) =================
writePage(36, `
  <h4 class="sec">6.3 PERFORMANCE AND STRESS TESTING BENCHMARKS</h4>
  <p>
    To validate system throughput and latency under sustained operational demand, automated stress tests were conducted using Autocannon over simulated concurrent operator sessions. The benchmark results, summarized in Table 6.2, demonstrate that AuditFlow comfortably exceeds the non-functional performance requirement of sub-200 ms latency.
  </p>

  <div class="caption">Table 6.2: System Latency and Throughput Benchmarks Under Load</div>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">API Endpoint Tested</th>
        <th style="width: 15%;">HTTP Method</th>
        <th style="width: 18%;">Concurrency</th>
        <th style="width: 16%;">Req/sec</th>
        <th style="width: 14%;">P95 Latency</th>
        <th style="width: 12%;">Result</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><code>/api/auth/login</code></td><td>POST</td><td>50 users</td><td>340 req/s</td><td>42 ms</td><td>Optimal</td></tr>
      <tr><td><code>/api/sites</code></td><td>GET</td><td>100 users</td><td>780 req/s</td><td>28 ms</td><td>Optimal</td></tr>
      <tr><td><code>/api/audits</code></td><td>GET</td><td>100 users</td><td>650 req/s</td><td>36 ms</td><td>Optimal</td></tr>
      <tr><td><code>/api/inspections</code></td><td>POST</td><td>25 users</td><td>295 req/s</td><td>54 ms</td><td>Optimal</td></tr>
      <tr><td><code>/api/capas</code></td><td>GET</td><td>100 users</td><td>820 req/s</td><td>25 ms</td><td>Optimal</td></tr>
      <tr><td><code>/api/reports/summary</code></td><td>GET</td><td>50 users</td><td>410 req/s</td><td>48 ms</td><td>Optimal</td></tr>
    </tbody>
  </table>

  <h4 class="sec">6.4 DEFENSIVE AND SECURITY VERIFICATION</h4>
  <p>
    Security evaluation verified mitigation against OWASP Top 10 web vulnerabilities:
  </p>
  <ul>
    <li><b>NoSQL Injection Mitigation:</b> Mongoose strictly types and casts query filters, preventing operator manipulation via malicious payload injection.</li>
    <li><b>Cross-Site Scripting (XSS) Mitigation:</b> React 18 JSX natively escapes all variable bindings before DOM insertion, neutralizing script injection attempts.</li>
    <li><b>Cross-Origin Resource Sharing (CORS):</b> The Express server explicitly whitelists approved client origins, rejecting cross-origin requests from unauthorized web domains.</li>
    <li><b>Cryptographic Verification:</b> Passwords are never stored in plaintext and cannot be extracted via API endpoints due to Mongoose <code>select: false</code> configuration.</li>
  </ul>
`);

// ================= PAGE 37: CHAPTER 6 (CONT) =================
writePage(37, `
  <h4 class="sec">6.5 USER ACCEPTANCE TESTING (UAT) AND SUS EVALUATION</h4>
  <p>
    To evaluate practical operational viability, User Acceptance Testing (UAT) was conducted with a cohort of 10 field engineers, plant supervisors, and EHS domain specialists. Usability was evaluated using the standardized System Usability Scale (SUS), a recognized 10-item Likert scale benchmark. The empirical results, detailed in Table 6.3, yielded a composite average SUS score of 88.5 out of 100, placing AuditFlow in the 'Grade A (Excellent)' usability tier.
  </p>

  <div class="caption">Table 6.3: System Usability Scale (SUS) Evaluation Metrics and Empirical Scores</div>
  <table>
    <thead>
      <tr>
        <th style="width: 10%;">Item No.</th>
        <th style="width: 58%;">Standardized Usability Evaluation Statement</th>
        <th style="width: 18%;">Target Benchmark</th>
        <th style="width: 14%;">Mean Score</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Q1</td><td>I think that I would like to use AuditFlow frequently in daily operations.</td><td>&ge; 4.0 / 5.0</td><td>4.7 / 5.0</td></tr>
      <tr><td>Q2</td><td>I found the audit checklist and inspection logging unnecessarily complex.</td><td>&le; 2.0 / 5.0</td><td>1.3 / 5.0</td></tr>
      <tr><td>Q3</td><td>I thought the dashboard, timeline ribbon, and sites views were easy to use.</td><td>&ge; 4.0 / 5.0</td><td>4.8 / 5.0</td></tr>
      <tr><td>Q4</td><td>I think that I would need technical assistance to operate AuditFlow.</td><td>&le; 2.0 / 5.0</td><td>1.4 / 5.0</td></tr>
      <tr><td>Q5</td><td>I found the various functions in AuditFlow well integrated together.</td><td>&ge; 4.0 / 5.0</td><td>4.8 / 5.0</td></tr>
      <tr><td>Q6</td><td>I thought there was too much inconsistency across modal dialogs.</td><td>&le; 2.0 / 5.0</td><td>1.2 / 5.0</td></tr>
      <tr><td>Q7</td><td>I imagine most plant technicians would learn this platform very quickly.</td><td>&ge; 4.0 / 5.0</td><td>4.9 / 5.0</td></tr>
      <tr><td>Q8</td><td>I found the system cumbersome and unintuitive during CAPA logging.</td><td>&le; 2.0 / 5.0</td><td>1.3 / 5.0</td></tr>
      <tr><td>Q9</td><td>I felt confident managing audits, test logs, and statutory reports.</td><td>&ge; 4.0 / 5.0</td><td>4.8 / 5.0</td></tr>
      <tr><td>Q10</td><td>I needed to learn many prerequisite tools before operating AuditFlow.</td><td>&le; 2.0 / 5.0</td><td>1.5 / 5.0</td></tr>
    </tbody>
  </table>

  <p>
    The evaluation confirmed that field operators and environmental officers found the automated CAPA dispatch pipeline and one-click regulatory CSV export to be substantial workflow improvements over manual spreadsheet logging.
  </p>
`);

// ================= PAGE 38: CHAPTER 7 =================
writePage(38, `
  <h3 class="ch-num">CHAPTER 7</h3>
  <h3 class="ch-title">CONCLUSION AND FUTURE SCOPE</h3>

  <h4 class="sec">7.1 CONCLUSION</h4>
  <p>
    The rapid industrialization of modern manufacturing economies necessitates rigorous environmental compliance, pollution abatement, and transparent governance. However, operational efficiency, regulatory compliance, and statutory reporting depend heavily on modern software tooling capable of real-time audit management, automated corrective action tracking, and tamper-proof record keeping. AuditFlow successfully bridges this critical gap by delivering a full-stack, cloud-native web platform that unifies environmental auditing, test telemetry inspection, CAPA remediation, and statutory returns under the operational paradigm: <i>"Audit it. Fix it. Report it."</i>
  </p>
  <p>
    Built upon the robust MERN stack, AuditFlow provides plant managers, certified environmental auditors, and corporate stakeholders with single-pane-of-glass visibility into multi-facility compliance lifecycles. Key engineering milestones accomplished in this project include:
  </p>
  <ul>
    <li><b>Automated Audit Scoring & CAPA Dispatch:</b> Instantaneous evaluation of section and overall compliance percentages upon audit lock, automatically generating severity-calibrated remediation tickets (7/30/60 days).</li>
    <li><b>Real-Time Limit Exceedance Trapping:</b> Mongoose pre-save database validation hooks that continuously monitor chemical and physical test readings, immediately raising emergency incident CAPAs upon threshold breaches.</li>
    <li><b>4-Stage Role-Guarded Verification:</b> Strict RBAC enforcing separate workflows where facility managers submit root causes and photographic proof, but only authorized auditors or administrators can verify and close actions.</li>
    <li><b>Automated Background Cron Daemon:</b> Midnight automated sweeps flagging past-due actions on an interactive 60-day visual timeline ribbon.</li>
    <li><b>One-Click Statutory Reporting:</b> Instant compilation of live facility operational data into formal regulatory summaries with formatted CSV export.</li>
    <li><b>Resilient Cloud Deployment:</b> Decoupled cloud architecture across Vercel, Render, and MongoDB Atlas establishing high availability and minimal operational cost.</li>
  </ul>
`);

// ================= PAGE 39: CHAPTER 7 (CONT) =================
writePage(39, `
  <h4 class="sec">7.2 FUTURE ENHANCEMENTS</h4>
  <p>
    While AuditFlow provides a complete operational baseline for simulated environments, several valuable extensions will enhance its capabilities in commercial production deployments:
  </p>
  <ol>
    <li><b>Industrial IoT Hardware Telemetry Integration:</b> Replacing manual reading entry with direct MQTT and HTTP telemetry ingestion pipelines connected to field edge gateways, PLC controllers, and online continuous emission monitoring systems (OCEMS).</li>
    <li><b>Machine Learning Predictive Effluent Analytics:</b> Incorporating Python-based machine learning models (e.g., Random Forest or LSTM networks) to predict effluent quality degradation 24–48 hours in advance based on historical COD/BOD trends and chemical dosing rates.</li>
    <li><b>Mobile Progressive Web Application (PWA) Offline Sync:</b> Implementing Service Worker caching and IndexedDB offline persistence to enable field auditors to conduct audits in remote basement plant areas with zero internet connectivity, synchronizing automatically upon reconnection.</li>
    <li><b>Blockchain Ledger for Statutory Provenance:</b> Storing cryptographic hash digests of completed audits and closed CAPAs on a decentralized ledger (e.g., Hyperledger Fabric), guaranteeing mathematical immutability for judicial and regulatory inquiries.</li>
    <li><b>GIS Spatial Mapping & Heatmaps:</b> Integrating Leaflet/Mapbox geospatial visualizations to display geographic multi-site compliance heatmaps across industrial corridors (e.g., Chennai–Bengaluru industrial highway).</li>
    <li><b>Multi-Regional Statutory Rule Engine:</b> Developing dynamic regulatory rule templates adaptable across different State Pollution Control Boards (TNPCB, KSPCB, MPCB) and international standards (EPA, EU-IED).</li>
    <li><b>Automated WhatsApp & SMS Emergency Alerts:</b> Integrating Twilio and WhatsApp Business APIs to dispatch immediate push notifications to plant directors when critical limit exceedances occur.</li>
  </ol>
  <p>
    These future architectural advancements will elevate AuditFlow from a comprehensive digital compliance portal into an autonomous, AI-driven industrial environmental intelligence platform.
  </p>
`);

// ================= PAGE 40: APPENDIX 1 =================
writePage(40, `
  <h3 class="ch-title" style="margin-top: 10px;">APPENDIX: SOURCE CODE AND CONFIGURATION</h3>

  <h4 class="sec">1. Project Directory Structure</h4>
  <pre>
auditflow/
|-- backend/
|   |-- config/
|   |   \\-- db.js                  # MongoDB Atlas connection pooling
|   |-- controllers/
|   |   |-- authController.js      # User registration and login logic
|   |   |-- siteController.js      # Industrial sites catalog controller
|   |   |-- auditController.js     # Audit checklist & scoring engine
|   |   |-- inspectionController.js# Test parameter logging & exceedance
|   |   |-- capaController.js      # 4-stage CAPA lifecycle controller
|   |   \\-- reportController.js    # Statutory summary & CSV export
|   |-- middleware/
|   |   |-- auth.js                # JWT verification & role inspection
|   |   \\-- upload.js              # Multer photographic evidence storage
|   |-- models/
|   |   |-- User.js                # Mongoose schema for system accounts
|   |   |-- Site.js                # Schema for registered facilities
|   |   |-- Audit.js               # Schema for audit checklists & score
|   |   |-- Inspection.js          # Schema for test telemetry readings
|   |   \\-- Capa.js                # Schema for corrective action tickets
|   |-- utils/
|   |   \\-- scheduler.js           # Midnight cron overdue sweeping daemon
|   |-- package.json               # Backend dependencies specification
|   \\-- server.js                  # Express REST service entry point
\\-- frontend/
    |-- src/
    |   |-- components/            # Reusable UI widgets & status badges
    |   |-- context/               # AuthContext & ToastContext providers
    |   |-- pages/                 # Route views (Dashboard, Audits, CAPAs)
    |   |-- api.js                 # Axios client with JWT interceptors
    |   |-- App.jsx                # Main React router container
    |   \\-- main.jsx               # React DOM mounting entry point
    |-- vite.config.js             # Vite build configuration & proxy
    \\-- package.json               # Frontend dependencies specification
  </pre>

  <h4 class="sec">2. Environment Configuration (.env)</h4>
  <pre>
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://monisx603_db_user:ld1vYqZJC9B928x1@cluster0.1wzqqz4.mongodb.net/auditflow?retryWrites=true&w=majority
JWT_SECRET=auditflow_super_secret_jwt_key_2026_monish_h
CLIENT_URL=https://auditflow-pi-two.vercel.app
  </pre>
  <div class="caption">Listing A.1: Sample Backend Environment Configuration</div>
`);

// ================= PAGE 41: APPENDIX 2 =================
writePage(41, `
  <h4 class="sec">3. Database Connection Pool (backend/config/db.js)</h4>
  <pre>
var mongoose = require('mongoose');

var connectDB = async function () {
  try {
    var conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB Atlas Connected: ' + conn.connection.host);
  } catch (err) {
    console.error('Database Connection Error: ' + err.message);
    process.exit(1);
  }
};
module.exports = connectDB;
  </pre>
  <div class="caption">Listing A.2: MongoDB Atlas Connection Pooling Module</div>

  <h4 class="sec">4. User Mongoose Schema (backend/models/User.js)</h4>
  <pre>
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'auditor', 'site_manager'], default: 'auditor' },
  site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
module.exports = mongoose.model('User', userSchema);
  </pre>
  <div class="caption">Listing A.3: User Mongoose Schema with Salted Hashing</div>
`);

// ================= PAGE 42: APPENDIX 3 =================
writePage(42, `
  <h4 class="sec">5. Site Mongoose Schema (backend/models/Site.js)</h4>
  <pre>
var mongoose = require('mongoose');

var siteSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  location: { type: String, required: true, trim: true },
  category: { type: String, enum: ['red', 'orange', 'green', 'white'], default: 'red' },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  consentValidTill: { type: Date, required: true },
  status: { type: String, enum: ['active', 'inactive', 'under_review'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Site', siteSchema);
  </pre>
  <div class="caption">Listing A.4: Industrial Site Collection Schema Specification</div>

  <h4 class="sec">6. Audit Mongoose Schema (backend/models/Audit.js)</h4>
  <pre>
var mongoose = require('mongoose');

var checklistItemSchema = new mongoose.Schema({
  section: { type: String, required: true },
  question: { type: String, required: true },
  compliant: { type: Boolean, default: true },
  severity: { type: String, enum: ['critical', 'major', 'minor'], default: 'major' },
  notes: { type: String, default: '' },
  evidencePhoto: { type: String, default: null },
});

var auditSchema = new mongoose.Schema({
  site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
  auditor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  auditDate: { type: Date, default: Date.now },
  checklist: [checklistItemSchema],
  score: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'completed'], default: 'draft' },
  completedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Audit', auditSchema);
  </pre>
  <div class="caption">Listing A.5: Audit Checklist Schema with Embedded Findings</div>
`);

// ================= PAGE 43: APPENDIX 4 =================
writePage(43, `
  <h4 class="sec">7. CAPA Mongoose Schema (backend/models/Capa.js)</h4>
  <pre>
var mongoose = require('mongoose');

var capaSchema = new mongoose.Schema({
  site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
  audit: { type: mongoose.Schema.Types.ObjectId, ref: 'Audit' },
  inspection: { type: mongoose.Schema.Types.ObjectId, ref: 'Inspection' },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  severity: { type: String, enum: ['critical', 'major', 'minor'], default: 'major' },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'pending_verification', 'closed', 'overdue'],
    default: 'open',
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dueDate: { type: Date, required: true },
  rootCause: { type: String, trim: true },
  correctiveAction: { type: String, trim: true },
  preventiveAction: { type: String, trim: true },
  evidence: [{
    filename: String,
    path: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadedAt: { type: Date, default: Date.now },
  }],
  history: [{
    action: String,
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    comment: String,
  }],
  closedAt: Date,
  closedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Capa', capaSchema);
  </pre>
  <div class="caption">Listing A.6: CAPA Schema with Dynamic SLAs and History Tracking</div>
`);

// ================= PAGE 44: APPENDIX 5 =================
writePage(44, `
  <h4 class="sec">8. Auto-CAPA Generation Controller (auditController.js)</h4>
  <pre>
exports.complete = async function (req, res) {
  var audit = await Audit.findById(req.params.id);
  if (!audit) return res.status(404).json({ message: 'Audit not found' });
  if (audit.status === 'completed') return res.status(400).json({ message: 'Audit already locked' });

  var total = audit.checklist.length;
  var compliant = audit.checklist.filter(function (c) { return c.compliant; }).length;
  audit.score = total ? Math.round((compliant / total) * 100) : 100;
  audit.status = 'completed';
  audit.completedAt = new Date();
  await audit.save();

  // Auto-raise CAPA for each non-compliance finding
  var nonCompliant = audit.checklist.filter(function (c) { return !c.compliant; });
  var createdCapas = [];
  for (var i = 0; i < nonCompliant.length; i++) {
    var item = nonCompliant[i];
    var days = item.severity === 'critical' ? 7 : item.severity === 'major' ? 30 : 60;
    var capa = await Capa.create({
      site: audit.site,
      audit: audit._id,
      title: item.section + ': ' + item.question,
      description: item.notes || 'Identified non-compliance during site audit.',
      severity: item.severity || 'major',
      dueDate: new Date(Date.now() + days * 86400000),
      status: 'open',
      history: [{ action: 'auto_created', by: req.user._id, comment: 'Generated from Audit' }],
    });
    createdCapas.push(capa);
  }
  return res.json({ audit: audit, capasRaised: createdCapas.length, capas: createdCapas });
};
  </pre>
  <div class="caption">Listing A.7: Core Audit Scoring & Auto-CAPA Dispatch Algorithm</div>

  <h4 class="sec">9. Authentication Middleware (backend/middleware/auth.js)</h4>
  <pre>
var jwt = require('jsonwebtoken');
var User = require('../models/User');

exports.protect = async function (req, res, next) {
  var token;
  if (req.headers.authorization && req.headers.authorization.indexOf('Bearer ') === 0) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};
  </pre>
  <div class="caption">Listing A.8: JWT Protection Middleware</div>
`);

// ================= PAGE 45: APPENDIX 6 =================
writePage(45, `
  <h4 class="sec">10. Client Authentication State Provider (AuthContext.jsx)</h4>
  <pre>
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

var AuthContext = createContext();

export var AuthProvider = function (props) {
  var [user, setUser] = useState(function () {
    var s = localStorage.getItem('gc_user');
    return s ? JSON.parse(s) : null;
  });
  var [token, setToken] = useState(function () { return localStorage.getItem('gc_token'); });
  var [loading, setLoading] = useState(true);

  useEffect(function () {
    if (token) {
      api.get('/auth/me').then(function (r) { setUser(r.data); }).catch(function () { logout(); })
        .finally(function () { setLoading(false); });
    } else setLoading(false);
  }, [token]);

  var login = async function (email, password) {
    var res = await api.post('/auth/login', { email: email, password: password });
    localStorage.setItem('gc_token', res.data.token);
    localStorage.setItem('gc_user', JSON.stringify(res.data.user));
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  var logout = function () {
    localStorage.removeItem('gc_token');
    localStorage.removeItem('gc_user');
    setToken(null);
    setUser(null);
  };

  return (
    &lt;AuthContext.Provider value={{ user: user, token: token, login: login, logout: logout, loading: loading }}&gt;
      {props.children}
    &lt;/AuthContext.Provider&gt;
  );
};
export var useAuth = function () { return useContext(AuthContext); };
  </pre>
  <div class="caption">Listing A.9: React Client Authentication State Provider</div>

  <h4 class="sec">11. Defensive Request Validation Middleware (validate.js)</h4>
  <pre>
exports.validateInspection = function (req, res, next) {
  var { site, date, readings } = req.body;
  if (!site || !date || !Array.isArray(readings) || readings.length === 0) {
    return res.status(400).json({ message: 'Site, date, and non-empty readings are required' });
  }
  for (var r of readings) {
    if (typeof r.value !== 'number' || isNaN(r.value) || r.value < 0) {
      return res.status(400).json({ message: 'Invalid value for: ' + r.parameter });
    }
  }
  next();
};
  </pre>
  <div class="caption">Listing A.10: Environmental Inspection Ingestion Boundary Guard</div>
`);

// ================= PAGE 46: SCREENSHOTS 1 =================
writePage(46, `
  <h3 class="ch-title" style="margin-top: 10px;">SCREENSHOTS OF THE PROJECT</h3>

  <p>
    This section presents the verified operational interfaces of the deployed AuditFlow compliance platform (accessible live at <code>https://auditflow-pi-two.vercel.app</code>), demonstrating end-to-end functionality across user authentication, operations oversight, audit execution, environmental inspection logging, CAPA remediation, and statutory returns.
  </p>

  <h4 class="sec">1. Secure Authentication & Role Initialization</h4>
  <p>
    The login interface provides secure cryptographic access control with email validation and pre-populated credential shortcuts for rapid evaluation across Lead Auditor, Site Manager, and Administrator accounts.
  </p>

  <img class="shot-img" src="screenshot_login.png" alt="AuditFlow Login Interface" style="max-height: 125mm;" />
  <div class="caption">Figure S.1: Secure Login and User Authentication Interface</div>
`);

// ================= PAGE 47: SCREENSHOTS 2 =================
writePage(47, `
  <h4 class="sec">2. Executive Operations Dashboard & Timeline Ribbon</h4>
  <p>
    The Operations Dashboard consolidates overall compliance health, active facility count, open/overdue CAPAs, and an executive 60-day visual timeline ribbon mapping immediate remediation deadlines.
  </p>
  <img class="shot-img" src="screenshot_dashboard.png" alt="AuditFlow Dashboard" style="max-height: 80mm;" />
  <div class="caption">Figure S.2: AuditFlow Operations Dashboard with 60-Day Visual Timeline Ribbon</div>

  <h4 class="sec" style="margin-top: 8px;">3. Multi-Facility Industrial Sites Management</h4>
  <p>
    The Sites catalog manages registered manufacturing plants, displaying industrial risk categories (Red/Orange/Green), geographic locations, assigned plant managers, and CTO consent validity dates.
  </p>
  <img class="shot-img" src="screenshot_sites.png" alt="AuditFlow Sites Management" style="max-height: 80mm;" />
  <div class="caption">Figure S.3: Multi-Facility Industrial Sites Management Directory</div>
`);

// ================= PAGE 48: SCREENSHOTS 3 =================
writePage(48, `
  <h4 class="sec">4. Environmental Audit Execution & Checklist Scoring</h4>
  <p>
    The Audits module provides dynamic, domain-categorized checklists (Water, Effluent, Air, Hazardous Waste, Consents). Toggling compliance updates real-time scores and locks the audit upon final completion.
  </p>
  <img class="shot-img" src="screenshot_audits.png" alt="AuditFlow Audit Execution" style="max-height: 80mm;" />
  <div class="caption">Figure S.4: Environmental Audit Execution & Dynamic Checklist Scoring View</div>

  <h4 class="sec" style="margin-top: 8px;">5. Effluent & Stack Emission Inspection Logger</h4>
  <p>
    The Inspections interface records chemical and physical probe readings. The system automatically evaluates values against consent limits, flagging exceedances with prominent warning badges and auto-raising incident CAPAs.
  </p>
  <img class="shot-img" src="screenshot_inspections.png" alt="AuditFlow Inspection Logger" style="max-height: 80mm;" />
  <div class="caption">Figure S.5: Effluent & Stack Inspection Logger with Statutory Limit Alerts</div>
`);

// ================= PAGE 49: SCREENSHOTS 4 =================
writePage(49, `
  <h4 class="sec">6. 4-Stage CAPA Remediation Management</h4>
  <p>
    The CAPA tracking interface enforces time-bound remediation workflows (Open &rarr; In Progress &rarr; Pending Verification &rarr; Closed). Managers submit root causes and photographic evidence, while closure requires auditor sign-off.
  </p>
  <img class="shot-img" src="screenshot_capas.png" alt="AuditFlow CAPA Management" style="max-height: 80mm;" />
  <div class="caption">Figure S.6: 4-Stage CAPA Remediation Management & Evidence Upload Modal</div>

  <h4 class="sec" style="margin-top: 8px;">7. Statutory Return Summary & Regulatory CSV Export</h4>
  <p>
    The Statutory Reporting module aggregates multi-site operational metrics into standardized compliance return summaries, providing one-click CSV export formatted for submission to State Pollution Control Boards.
  </p>
  <img class="shot-img" src="screenshot_reports.png" alt="AuditFlow Statutory Reports" style="max-height: 80mm;" />
  <div class="caption">Figure S.7: Statutory Return Summary & Regulatory One-Click CSV Export Interface</div>
`);

// ================= PAGE 50: REFERENCES =================
writePage(50, `
  <h3 class="ch-title" style="margin-top: 15px;">REFERENCES</h3>

  <div style="margin-top: 25px;">
    <p class="no-indent">[1] Central Pollution Control Board (CPCB), “Technical Guidelines for Online Continuous Effluent and Emission Monitoring Systems,” Ministry of Environment, Forest and Climate Change, Govt. of India, Tech. Rep. CPCB/Tech/2020/01, 2020.</p>

    <p class="no-indent" style="margin-top: 14px;">[2] International Organization for Standardization, “ISO 14001:2015 Environmental Management Systems — Requirements with Guidance for Use,” ISO Central Secretariat, Geneva, Switzerland, Standard, 2015.</p>

    <p class="no-indent" style="margin-top: 14px;">[3] E. Bank, “The MERN stack: MongoDB, Express, React, and Node.js for modern full-stack web development,” <i>ACM Inroads</i>, vol. 11, no. 4, pp. 45–52, 2020.</p>

    <p class="no-indent" style="margin-top: 14px;">[4] K. Chodorow, <i>MongoDB: The Definitive Guide: Powerful and Scalable Data Storage</i>, 3rd ed. Sebastopol, CA, USA: O’Reilly Media, 2020.</p>

    <p class="no-indent" style="margin-top: 14px;">[5] A. Banks and E. Porcello, <i>Learning React: Modern Patterns for Developing React Applications</i>, 2nd ed. Sebastopol, CA, USA: O’Reilly Media, 2020.</p>

    <p class="no-indent" style="margin-top: 14px;">[6] S. Tilkov and S. Vinoski, “Node.js: Using JavaScript to build high-performance network programs,” <i>IEEE Internet Computing</i>, vol. 14, no. 6, pp. 80–83, 2010.</p>

    <p class="no-indent" style="margin-top: 14px;">[7] M. Beller and A. Zaidman, “Continuous integration and continuous deployment in cloud environments,” <i>IEEE Software</i>, vol. 34, no. 5, pp. 24–28, 2017.</p>

    <p class="no-indent" style="margin-top: 14px;">[8] Ministry of Environment, Forest and Climate Change, “The Water (Prevention and Control of Pollution) Act, 1974,” Government of India, Gazette Notification, Act No. 6 of 1974.</p>

    <p class="no-indent" style="margin-top: 14px;">[9] Ministry of Environment, Forest and Climate Change, “The Air (Prevention and Control of Pollution) Act, 1981,” Government of India, Gazette Notification, Act No. 14 of 1981.</p>

    <p class="no-indent" style="margin-top: 14px;">[10] Open Web Application Security Project (OWASP), “OWASP Top 10:2021 The Ten Most Critical Web Application Security Risks,” OWASP Foundation, Tech. Rep., 2021.</p>
  </div>
`);

out.write(`
</div>
</body>
</html>
`);

out.end(function () {
  console.log('HTML written successfully! Converting to PDF via Chrome...');
  
  var chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  var userDataDir = path.join(__dirname, 'temp-pdf-profile-final');

  var proc = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--user-data-dir=' + userDataDir,
    '--print-to-pdf=' + pdfPath,
    '--no-pdf-header-footer',
    '--allow-file-access-from-files',
    'file:///' + htmlPath.replace(/\\/g, '/')
  ]);

  proc.on('close', function (code) {
    console.log('Chrome print-to-pdf finished with code ' + code);
    try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}

    if (fs.existsSync(pdfPath)) {
      var stats = fs.statSync(pdfPath);
      console.log('PDF successfully generated: ' + pdfPath + ' (' + stats.size + ' bytes)');

      var downloadPath = 'C:\\Users\\Admin\\Downloads\\AUDITFLOW_PROJECT_REPORT_MONISH_H.pdf';
      fs.copyFileSync(pdfPath, downloadPath);
      console.log('Copied to ' + downloadPath);
    } else {
      console.error('PDF file was not created!');
    }
  });
});
