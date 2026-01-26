const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");
const db = require("./db");
const { fetchRSS: fetchVn } = require("./fetcher");
const { fetchRSS: fetchWorld } = require("./fetcherWorld");
const rssSources = require("./rssSources");
const rssSourcesWorld = require("./rssSourcesWorld");
const symbolSources = require("./symbol");

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: "*" }));
app.use(express.json());

console.log("🕷️ Crawler Service is starting...");
fetchVn().then(() => console.log("✅ Vietnam RSS initial fetch done."));
fetchWorld().then(() => console.log("✅ World RSS initial fetch done."));

setInterval(fetchVn, 30 * 60 * 1000);
setInterval(fetchWorld, 30 * 60 * 1000);

// 3. WebSocket: Gửi tin mới realtime
const wss = new WebSocket.Server({ server });
wss.on("connection", (ws) => {
  console.log("Client connected to Crawler WebSocket");
});

// Hàm broadcase tin mới (bạn có thể gọi hàm này trong fetcher.js khi có tin mới)
// Hiện tại giả lập gửi tin mới mỗi 30p
setInterval(() => {
  db.all("SELECT title, url, published FROM articles ORDER BY published DESC LIMIT 5", (err, rows) => {
    if (!err && rows.length > 0) {
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'LATEST_NEWS', data: rows }));
        }
      });
    }
  });
}, 30 * 60 * 1000);


// 4. API Endpoint (Logic Search giữ nguyên)
// ... (Insert đoạn code reliabilityMap và symbolMap của bạn vào đây) ...
const reliabilityMap = [...rssSources, ...rssSourcesWorld].reduce((acc, src) => {
    acc[src.source] = src.reliability || 3;
    return acc;
}, {});
const symbolMap = symbolSources.reduce((acc, item) => {
    acc[item.symbol] = { organ_name_vi: item.organ_name_vi };
    return acc;
}, {});

function searchArticles(table, mode, req, res) {
  const { keyword, from, to, page = 1, limit = 15 } = req.query;
  const params = [];
  const whereClauses = [];
  
  // 1. Xử lý cột Author: 
  // - Nếu là bảng VN (articles) -> Lấy cột author.
  // - Nếu là bảng World (articles_world) -> Trả về NULL (để tránh lỗi SQLITE_ERROR).
  const isVnTable = table === 'articles';
  const authorSelect = isVnTable ? "author" : "NULL AS author"; 

  // 2. Filter theo Keyword
  if (keyword) {
    const kw = `%${keyword}%`;
    whereClauses.push(`(title LIKE ? OR content LIKE ?)`);
    params.push(kw, kw);
  }

  // Filter theo ngày
  if (from) { whereClauses.push(`date(published) >= date(?)`); params.push(from); }
  if (to) { whereClauses.push(`date(published) <= date(?)`); params.push(to); }

  // 3. Logic Symbol (Chỉ áp dụng cho VN, World không có symbol)
  const symbols = Object.keys(symbolMap);
  
  if (isVnTable) {
      if (mode === "include") {
         // Lấy bài viết CÓ chứa mã chứng khoán
         const likeCond = symbols.map(() => `(title LIKE ? OR content LIKE ?)`).join(" OR ");
         whereClauses.push(`(${likeCond})`);
         symbols.forEach(sym => params.push(`%${sym}%`, `%${sym}%`));
      } 
      else if (mode === "exclude") {
         // Lấy bài viết KHÔNG chứa mã nào (Tin vĩ mô)
         // Lưu ý: Cách tối ưu hơn là dùng NOT EXISTS hoặc FTS, nhưng với LIKE cơ bản:
         symbols.forEach(sym => {
            whereClauses.push(`(title NOT LIKE ? AND content NOT LIKE ?)`);
            params.push(`%${sym}%`, `%${sym}%`);
         });
      }
  }

  const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";
  const offset = (page - 1) * limit;

  // Sắp xếp
  const reliabilityCase = Object.entries(reliabilityMap)
    .map(([source, rel]) => `WHEN '${source}' THEN ${rel}`).join(" ");

  const sql = `
    SELECT id, title, url, image, published, content, source, ${authorSelect}
    FROM ${table}
    ${whereSQL}
    ORDER BY date(published) DESC, CASE source ${reliabilityCase} ELSE 999 END ASC
    LIMIT ? OFFSET ?
  `;
  params.push(limit, offset);

  db.all(sql, params, (err, rows) => {
    if (err) {
        console.error("Search Error:", err.message);
        return res.status(500).json({ error: err.message });
    }
    
    // Format lại dữ liệu trả về cho đẹp
    const result = rows.map(r => ({
        ...r,
        // Nếu author null (world news) thì để rỗng hoặc "Theo RSS"
        author: r.author || (isVnTable ? "" : ""), 
        // Fallback ảnh nếu không có
        image: r.image || `https://picsum.photos/300/200?random=${Math.floor(Math.random()*1000)}`
    }));

    res.json(result);
  });
}

// 5. Route Definition
app.get("/searchVN", (req, res) => searchArticles("articles", null, req, res));
app.get("/searchWorld", (req, res) => searchArticles("articles_world", null, req, res));
app.get("/searchVN_hasSymbols", (req, res) => searchArticles("articles", "include", req, res));
app.get("/searchVN_noSymbols", (req, res) => searchArticles("articles", "exclude", req, res));

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Crawler Microservice running on port ${PORT}`);
});