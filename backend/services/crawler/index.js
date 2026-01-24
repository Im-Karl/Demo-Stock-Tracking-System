// services/crawler/index.js
const { fetchRSS: fetchVn } = require("./fetcher");
const { fetchRSS: fetchWorld } = require("./fetcherWorld");

console.log("🤖 Crawler Service đang khởi động...");

// Chạy ngay lập tức khi khởi động
const runCrawler = async () => {
  console.log("--- Bắt đầu chu kỳ quét ---");
  await Promise.all([
      fetchVn().then(() => console.log("✅ VN RSS fetched")),
    //   fetchWorld().then(() => console.log("✅ World RSS fetched"))
  ]);
  console.log("--- Kết thúc chu kỳ quét ---");
};

runCrawler();

// Hẹn giờ chạy (Ví dụ: 30 phút một lần)
setInterval(runCrawler, 30 * 60 * 1000);

// Giữ process sống
process.on('SIGINT', () => {
  console.log("🛑 Crawler dừng lại.");
  process.exit();
});