const db = require("../db_sqlite");

exports.searchNews = (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // Đảm bảo limit là số

  // Log ra để biết Frontend có gọi tới đây không
  console.log(`📡 API Request: Lấy ${limit} tin tức...`);

  const sql = "SELECT * FROM articles ORDER BY published DESC LIMIT ?";

  db.all(sql, [limit], (err, rows) => {
    if (err) {
      console.error("❌ Lỗi truy vấn SQL:", err.message);
      return res.status(500).json({ error: err.message });
    }

    // Log số lượng tìm thấy
    console.log(`✅ Tìm thấy ${rows ? rows.length : 0} bài viết.`);

    // Trả về mảng rỗng nếu không có tin (thay vì null)
    res.json(rows || []);
  });
};
