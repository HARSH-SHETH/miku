const mongoose = require('mongoose');
const _ = require('../globals');

const connectionURL = process.env.MONGODB_URL ?? 'mongodb://localhost:27017/miku';

mongoose.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', () => {
  console.error('MongoDB Connection Error:');
  process.exit(_.CODES.MONGODB_CONNECTION_ERROR);
});

db.on('open', () => { console.log('Successfully connected to mongodb instance') })
