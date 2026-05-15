const mongoose = require('mongoose');

const WatchlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  lowThreshold: {
    type: Number,
    default: null,
  },
  highThreshold: {
    type: Number,
    default: null,
  },
  alertEnabled: {
    type: Boolean,
    default: true,
  },
  lastNotifiedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Mỗi User chỉ được tạo 1 bản ghi theo dõi cho 1 mã duy nhất
WatchlistSchema.index({ user: 1, symbol: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', WatchlistSchema);
