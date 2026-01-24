const jwt = require('jsonwebtoken');

const SECRET_KEY = "bi_mat_cua_du_an_nay"; // Trong thực tế nên để trong .env

const verifyToken = (req, res, next) => {
  const tokenHeader = req.headers['authorization'];
  
  // Token thường gửi dạng: "Bearer <token>"
  const token = tokenHeader && tokenHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: "Bạn cần đăng nhập để thực hiện việc này!" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn." });
    }
    // Lưu thông tin user đã giải mã vào request để dùng ở bước sau
    req.userId = decoded.id;
    req.username = decoded.username;
    next();
  });
};

module.exports = { verifyToken, SECRET_KEY };