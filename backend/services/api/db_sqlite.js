const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Trỏ vào file DB do Crawler tạo ra
const dbPath = path.resolve(__dirname, '../../data/news.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) console.error('❌ Không tìm thấy news.db. Hãy chạy Crawler trước!');
  else {
    console.log('✅ Đã kết nối SQLite (Chế độ đọc tin tức)');
  }
});

module.exports = db;
