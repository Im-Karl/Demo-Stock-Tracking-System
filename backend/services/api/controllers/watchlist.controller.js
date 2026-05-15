const Watchlist = require('../models/Watchlist');

exports.addToWatchlist = async (req, res) => {
  try {
    const { symbol, lowThreshold, highThreshold, alertEnabled } = req.body;
    const userId = req.userId;

    const watchItem = await Watchlist.findOneAndUpdate(
      { user: userId, symbol },
      { 
        lowThreshold, 
        highThreshold, 
        alertEnabled: alertEnabled !== undefined ? alertEnabled : true 
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: watchItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getWatchlist = async (req, res) => {
  try {
    const userId = req.userId;
    const items = await Watchlist.find({ user: userId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeFromWatchlist = async (req, res) => {
  try {
    const { symbol } = req.params;
    const userId = req.userId;

    await Watchlist.findOneAndDelete({ user: userId, symbol });
    res.json({ success: true, message: 'Đã xóa khỏi danh sách theo dõi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggleAlert = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { alertEnabled } = req.body;
    const userId = req.userId;

    const item = await Watchlist.findOneAndUpdate(
      { user: userId, symbol },
      { alertEnabled },
      { new: true }
    );

    if (!item) return res.status(404).json({ message: 'Không tìm thấy mã trong danh sách' });

    res.json({ success: true, alertEnabled: item.alertEnabled });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
