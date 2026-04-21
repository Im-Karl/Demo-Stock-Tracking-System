const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://127.0.0.1:27017/stock_finance_db';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Finance Service connected to MongoDB');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
