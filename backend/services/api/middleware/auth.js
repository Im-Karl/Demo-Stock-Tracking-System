const jwt = require("jsonwebtoken");

// Đặt key bí mật ở đây (hoặc lấy từ biến môi trường)
const SECRET_KEY = "STOCK_APP_SECRET_KEY_123!@#"; 

// --- QUAN TRỌNG: PHẢI EXPORT BIẾN NÀY RA ---
exports.SECRET_KEY = SECRET_KEY; 
// -------------------------------------------

exports.verifyToken = (req, res, next) => {
  const tokenHeader = req.headers["authorization"];
  if (!tokenHeader) return res.status(403).json({ message: "No token provided" });

  const token = tokenHeader.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    
    req.userId = decoded.id; 
    req.username = decoded.username; // Lưu thêm username để dùng cho blog
    next();
  });
};