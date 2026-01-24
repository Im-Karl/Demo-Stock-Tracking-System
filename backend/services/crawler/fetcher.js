const Parser = require("rss-parser");
const db = require("./db");
const rssSources = require("./rssSources");
const { decode } = require("html-entities");

const parser = new Parser();

async function fetchRSS() {
  console.log(">>> Bắt đầu quét tin tức RSS...");
  
  for (const sourceItem of rssSources) {
    for (const url of sourceItem.urls) {
      try {
        const feed = await parser.parseURL(url);
        
        feed.items.forEach(item => {
          const title = decode(item.title || "").trim();
          const link = item.link;
          const pubDate = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();
          const content = decode(item.contentSnippet || item.content || "").trim();
          
          // Thử lấy ảnh từ enclosure (nếu có)
          const image = item.enclosure?.url || null;

          // Lưu vào SQLite
          const sql = `INSERT OR IGNORE INTO articles (title, url, image, published, content, source) VALUES (?, ?, ?, ?, ?, ?)`;
          db.run(sql, [title, link, image, pubDate, content, sourceItem.source], (err) => {
             // Bỏ qua lỗi duplicate
          });
        });
        console.log(`   Đã quét xong: ${sourceItem.source}`);
      } catch (err) {
        console.error(`   Lỗi quét ${url}:`, err.message);
      }
    }
  }
  console.log(">>> Hoàn tất quét tin.");
}

module.exports = { fetchRSS };