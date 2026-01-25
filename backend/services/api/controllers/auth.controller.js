const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Import SECRET_KEY từ middleware (đã sửa ở bước 1)
const { SECRET_KEY } = require("../middleware/auth"); 

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Sai thông tin đăng nhập" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai thông tin đăng nhập" });

    // Lúc này SECRET_KEY đã có giá trị, lệnh sign sẽ thành công
    const token = jwt.sign(
        { id: user._id, username: user.username }, 
        SECRET_KEY, 
        { expiresIn: '1d' }
    );

    res.json({ success: true, token, user: { id: user._id, username: user.username, displayName: user.displayName } });
  } catch (err) {
    console.error("Login Error:", err); // Log lỗi ra terminal để dễ sửa
    res.status(500).json({ error: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ message: "Username hoặc Email đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.json({ success: true, message: "Đăng ký thành công!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email không tồn tại trong hệ thống" });

    const token = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();

    console.log("============================================");
    console.log("LINK RESET PASS CHO USER:", user.email);
    console.log(`http://localhost:4321/reset-password?token=${token}`);
    console.log("============================================");

    res.json({ success: true, message: "Đã gửi hướng dẫn reset mật khẩu vào email của bạn!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    const user = await User.findOne({ 
      resetPasswordToken: token, 
      resetPasswordExpires: { $gt: Date.now() } 
    });

    if (!user) return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Đổi mật khẩu thành công! Hãy đăng nhập lại." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};