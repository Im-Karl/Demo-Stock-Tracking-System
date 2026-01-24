const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Tạo thư mục data nếu chưa có
const dataDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'news.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      url TEXT UNIQUE,
      image TEXT,
      published TEXT,
      content TEXT,
      source TEXT,
      author TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS articles_world (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      url TEXT UNIQUE,
      image TEXT,
      published TEXT,
      content TEXT,
      source TEXT
    )
  `);
});

module.exports = db;