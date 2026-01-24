const db = require("../db_sqlite");

exports.searchNews = (req, res) => {
  const { limit = 10, keyword } = req.query;
  let sql = "SELECT * FROM articles";
  const params = [];

  if (keyword) {
      sql += " WHERE title LIKE ? OR content LIKE ?";
      params.push(`%${keyword}%`, `%${keyword}%`);
  }

  sql += " ORDER BY published DESC LIMIT ?";
  params.push(limit);

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};