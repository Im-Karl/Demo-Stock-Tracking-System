const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dataDir = path.resolve(__dirname, "../../../data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "articles.db");

console.log("📂 Crawler DB Path:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Lỗi kết nối SQLite Crawler:", err.message);
  } else {
    console.log("✅ Kết nối SQLite Crawler thành công.");
  }
});

db.configure("busyTimeout", 10000);

module.exports = db;
