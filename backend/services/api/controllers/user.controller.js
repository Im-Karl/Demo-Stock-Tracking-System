const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -resetPasswordToken -resetPasswordExpires');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let isFollowing = false;

    if (req.userId) {
      isFollowing = user.followers.some(
        (id) => id.toString() === req.userId.toString()
      );
    }

    res.json({
      user,
      isFollowing
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  console.log("Controller: Getting Profile for ID:", req.userId);
  try {
    const user = await User.findById(req.userId).select(
      "-password -resetPasswordToken -resetPasswordExpires",
    );

    if (!user) {
      console.log("User not found in DB");
      return res.status(404).json({ message: "User not found" });
    }

    console.log(" Found User:", user.username);
    res.json(user);
  } catch (err) {
    console.error(" Controller Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật thông tin (DisplayName, Phone)
exports.updateProfile = async (req, res) => {
  try {
    const { displayName, phone } = req.body;
    const userId = req.userId;

    // Kiểm tra trùng lặp (nếu có nhập)
    if (displayName) {
      const existName = await User.findOne({
        displayName,
        _id: { $ne: userId },
      });
      if (existName)
        return res
          .status(400)
          .json({ message: "Tên hiển thị này đã có người dùng." });
    }
    if (phone) {
      const existPhone = await User.findOne({ phone, _id: { $ne: userId } });
      if (existPhone)
        return res
          .status(400)
          .json({ message: "Số điện thoại này đã có người dùng." });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { displayName, phone },
      { new: true }, // Trả về data mới
    ).select("-password");

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Đổi mật khẩu
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mật khẩu cũ không đúng" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: "Đổi mật khẩu thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggleFollow = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.userId;

    if (targetUserId === currentUserId) {
      return res
        .status(400)
        .json({ message: "Bạn không thể tự theo dõi chính mình" });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    const isFollowing = targetUser.followers.some(
      (id) => id.toString() === currentUserId.toString(),
    );

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
