const mongoose = require('mongoose');

const StockHistorySchema = new mongoose.Schema({
  symbol: { type: String, required: true, index: true },
  timestamp: { type: Number, required: true },
  open: Number,
  high: Number,
  low: Number,
  close: Number,
  volume: Number,
});

StockHistorySchema.index({ symbol: 1, timestamp: -1 });

module.exports = mongoose.model('StockHistory', StockHistorySchema);
