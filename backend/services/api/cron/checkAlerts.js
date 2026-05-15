const axios = require('axios');
const nodemailer = require('nodemailer');
const Watchlist = require('../models/Watchlist');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

const checkAlerts = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:5000/api/stocks/prices');
    const prices = response.data;

    const alerts = await Watchlist.find({ alertEnabled: true }).populate('user');

    for (const alert of alerts) {
      const currentData = prices.find((p) => p.symbol === alert.symbol);
      if (!currentData) continue;

      const currentPrice = currentData.price;
      let trigger = null;

      if (alert.highThreshold && currentPrice >= alert.highThreshold) {
        trigger = `tăng cao hơn ngưỡng ${alert.highThreshold.toLocaleString()} VNĐ`;
      } else if (alert.lowThreshold && currentPrice <= alert.lowThreshold) {
        trigger = `giảm xuống dưới ngưỡng ${alert.lowThreshold.toLocaleString()} VNĐ`;
      }

      if (trigger) {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        if (!alert.lastNotifiedAt || alert.lastNotifiedAt < oneDayAgo) {

          await sendAlertEmail(alert.user, alert.symbol, currentPrice, trigger);

          alert.lastNotifiedAt = new Date();
          await alert.save();
          console.log(`[Alert] Đã gửi mail cho ${alert.user.email} về mã ${alert.symbol}`);
        }
      }
    }
  } catch (err) {
    console.error('[Alert Error]', err.message);
  }
};

async function sendAlertEmail(user, symbol, currentPrice, message) {
  const mailOptions = {
    from: '"FinSavvy Alerts" <no-reply@stockapp.com>',
    to: user.email,
    subject: `[Cảnh báo giá] Mã ${symbol} đã đạt ngưỡng thiết lập`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2>Cảnh báo biến động giá</h2>
        <p>Chào <b>${user.displayName || user.username}</b>,</p>
        <p>Hệ thống FinSavvy thông báo mã chứng khoán <b>${symbol}</b> mà bạn đang theo dõi đã ${message}.</p>
        <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;">Giá hiện tại: <b style="color: #e14581; font-size: 1.2em;">${currentPrice.toLocaleString()} VNĐ</b></p>
        </div>
        <p>Bạn có thể truy cập dashboard để xem chi tiết và điều chỉnh ngưỡng thông báo.</p>
        <hr />
        <p style="font-size: 0.8em; color: #888;">Đây là email tự động, vui lòng không phản hồi. Bạn có thể tắt thông báo này trong mục Danh sách theo dõi.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = () => {
  // Chạy kiểm tra mỗi 1 phút
  setInterval(checkAlerts, 60 * 1000);
  console.log('✅ Alert Checker service started (Interval: 1m)');
};
