const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const { SECRET_KEY } = require('../middleware/auth');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Sai thông tin đăng nhập' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Sai thông tin đăng nhập' });

    const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: '1d' });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ message: 'Username hoặc Email đã tồn tại' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.json({ success: true, message: 'Đăng ký thành công!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email không tồn tại trong hệ thống' });

    const newPassword = crypto.randomBytes(6).toString('hex');

    user.password = await bcrypt.hash(newPassword, 10);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    const mailOptions = {
      from: '"Stock App Support" <no-reply@stockapp.com>',
      to: user.email,
      subject: 'Cấp lại mật khẩu mới',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h3 style="color: #2563EB;">Mật khẩu mới của bạn</h3>
          <p>Hệ thống đã tự động reset mật khẩu của bạn theo yêu cầu.</p>
          <p>Mật khẩu đăng nhập mới là:</p>
          <div style="background: #f4f4f5; padding: 15px; font-size: 20px; font-weight: bold; letter-spacing: 2px; text-align: center; border-radius: 5px; margin: 20px 0;">
            ${newPassword}
          </div>
          <p style="color: red; font-size: 13px;">* Vui lòng đăng nhập và đổi lại mật khẩu ngay để bảo mật.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Mật khẩu mới đã được gửi vào email của bạn!' });
  } catch (err) {
    console.error('Mail Error:', err);
    res.status(500).json({ error: 'Lỗi khi gửi email: ' + err.message });
  }
};
