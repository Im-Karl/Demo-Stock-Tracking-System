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

    const resetToken = crypto.randomBytes(32).toString('hex');
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 phút
    await user.save();

    const resetUrl = `${process.env.URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: '"Stock App Support" <no-reply@stockapp.com>',
      to: user.email,
      subject: 'Yêu cầu đặt lại mật khẩu',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; background-color: #f9fafb; color: #1f2937;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #2563eb; padding: 20px; text-align: center;">
              <h2 style="color: #ffffff; margin: 0; font-size: 24px;">Stock App</h2>
            </div>
            <div style="padding: 30px;">
              <h3 style="color: #111827; margin-top: 0;">Chào ${user.displayName || user.username},</h3>
              <p style="line-height: 1.6;">Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
              <p style="line-height: 1.6;">Để đặt lại mật khẩu, vui lòng nhấn vào nút bên dưới (Đường dẫn có hiệu lực trong <b>10 phút</b>):</p>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; transition: background-color 0.2s;">
                  Đặt lại mật khẩu
                </a>
              </div>
              
              <p style="font-size: 14px; color: #6b7280;">Nếu nút trên không hoạt động, bạn có thể copy và dán đường dẫn này vào trình duyệt:</p>
              <p style="font-size: 13px; word-break: break-all; color: #2563eb; background-color: #f3f4f6; padding: 10px; border-radius: 4px;">
                ${resetUrl}
              </p>
            </div>
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
              &copy; 2026 Stock App Team. All rights reserved.
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Đường dẫn đặt lại mật khẩu đã được gửi vào email của bạn!' });
  } catch (err) {
    console.error('Mail Error:', err);
    res.status(500).json({ error: 'Lỗi khi gửi email: ' + err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Đường dẫn không hợp lệ hoặc đã hết hạn' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Mật khẩu của bạn đã được cập nhật thành công!' });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ error: err.message });
  }
};
