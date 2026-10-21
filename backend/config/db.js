const mongoose = require('mongoose');

let isConnected = false;

module.exports = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }
  const db = await mongoose.connect(process.env.MONGO_URI);
  isConnected = db.connections[0].readyState === 1;
  console.log('MongoDB connected:', mongoose.connection.host);
};

