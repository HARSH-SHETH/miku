const mongoose = require('mongoose');
const _ = require('../globals');

const deleted = require('./models/deleted');

const connectionURL = process.env.MONGODB_URL ?? 'mongodb://localhost:27017/miku';

mongoose.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', () => {
  console.error('MongoDB Connection Error:');
  process.exit(_.CODES.MONGODB_CONNECTION_ERROR);
});

db.on('open', () => { 
  console.log('Successfully connected to mongodb instance') 
  deleted.find({}).then(result => {
    if(result.length > 0){
      _.DELETEDMESSAGE = result[0].messages ?? {};
      _.BLACKLIST = result[0].blacklist ?? {};
      // console.log(_.DELETEDMESSAGE, _.BLACKLIST);
    }
    else{
      deleted.insertMany({messages:{}, blacklist:{}}).then(res => {
        console.log('Created dummy doc', res);
      })
    }
  })
})
