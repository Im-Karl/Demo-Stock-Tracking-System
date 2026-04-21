const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -resetPasswordToken -resetPasswordExpires');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let isFollowing = false;
    if (req.userId) {
      isFollowing = user.followers.some((id) => id.toString() === req.userId.toString());
    }

    res.json({ user, isFollowing });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -resetPasswordToken -resetPasswordExpires');

    if (!user) {
      console.log('User not found in DB');
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(' Controller Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    // Thêm avatar vào đây
    const { displayName, phone, tagline, avatar } = req.body;
    const userId = req.userId;

    if (displayName) {
      const existName = await User.findOne({
        displayName,
        _id: { $ne: userId },
      });
      if (existName) return res.status(400).json({ message: 'Tên hiển thị này đã có người dùng.' });
    }

    if (phone) {
      const existPhone = await User.findOne({ phone, _id: { $ne: userId } });
      if (existPhone) return res.status(400).json({ message: 'Số điện thoại này đã có người dùng.' });
    }

    // Đẩy thêm avatar vào cục object cập nhật
    const user = await User.findByIdAndUpdate(userId, { displayName, phone, tagline, avatar }, { new: true }).select(
      '-password',
    );

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggleFollow = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.userId;

    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: 'Bạn không thể tự theo dõi chính mình' });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    const isFollowing = targetUser.followers.some((id) => id.toString() === currentUserId.toString());

    if (isFollowing) {
      targetUser.followers.pull(currentUserId);
      currentUser.following.pull(targetUserId);
    } else {
      targetUser.followers.push(currentUserId);
      currentUser.following.push(targetUserId);
    }

    await targetUser.save();
    await currentUser.save();

    res.json({ success: true, isFollowing: !isFollowing });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate('followers', 'username displayName avatar');

    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    res.json({ success: true, followers: user.followers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate('following', 'username displayName avatar');

    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    res.json({ success: true, following: user.following });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
