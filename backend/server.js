require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const routes = require('./routes');
const startScheduler = require('./utils/scheduler');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();
app.use(helmet({ crossOriginResourcePolicy: false }));

const allowedOrigins = [process.env.CLIENT_ORIGIN, 'http://localhost:5173', 'http://localhost:5000'].filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    startScheduler();
    app.listen(PORT, () => console.log(`AuditFlow API on :${PORT}`));
  }).catch(err => { console.error('DB connection failed:', err.message); });
}

module.exports = app;

