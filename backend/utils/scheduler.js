const cron = require('node-cron');
const Capa = require('../models/Capa');

// Daily 00:05 — flag CAPAs that slipped past their due date
module.exports = () => cron.schedule('5 0 * * *', async () => {
  const r = await Capa.updateMany(
    { status: { $in: ['open', 'in_progress'] }, dueDate: { $lt: new Date() } },
    { $set: { status: 'overdue' }, $push: { history: { action: 'status: → overdue', note: 'Marked automatically (past due date)' } } }
  );
  if (r.modifiedCount) console.log(`[cron] ${r.modifiedCount} CAPA(s) marked overdue`);
});
