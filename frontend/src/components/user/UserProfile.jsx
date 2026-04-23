import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService';
import {
  RiExternalLinkFill,
  RiKeyFill,
  RiLogoutBoxRFill,
  RiCameraFill,
  RiLoader4Fill,
  RiArrowRightSFill,
} from 'react-icons/ri';
import { uploadService } from '../../services/uploadService';
import Button from '../base-ui/Button';
import TextField from '../base-ui/TextField';
import Avatar from '../base-ui/Avatar';

export default function UserProfile() {
  const [user, setUser] = useState({
    _id: '',
    username: '',
    email: '',
    displayName: '',
    phone: '',
    tagline: '',
    avatar: '',
  });

  const [passData, setPassData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // State cho Avatar
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    authService
      .getProfile()
      .then((res) => {
        setUser(res.data);
        const localUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...localUser, ...res.data }));
      })
      .catch((err) => {
        setFetchError(err.response?.data?.message || err.message || 'Không thể tải thông tin cá nhân');
      });
  }, []);

  // ===== LOGIC UPLOAD AVATAR =====
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.');
      return;
    }

    setUploadingAvatar(true);
    try {
      const uploadRes = await uploadService.uploadImage(file);
      const imageUrl = uploadRes.data.url;

      await authService.updateProfile({ avatar: imageUrl });

      setUser({ ...user, avatar: imageUrl });
      const currentUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...currentUser, avatar: imageUrl }));

      toast.success('Đổi ảnh đại diện thành công!');
    } catch (err) {
      toast.error('Lỗi khi tải ảnh lên!');
      console.log(err);
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ===== LOGIC CẬP NHẬT THÔNG TIN =====
  const handleUpdateInfo = async () => {
    setLoading(true);
    const dataToSend = {
      displayName: user.displayName === '' ? undefined : user.displayName,
      phone: user.phone === '' ? undefined : user.phone,
      tagline: user.tagline === '' ? undefined : user.tagline,
    };

    try {
      const res = await authService.updateProfile(dataToSend);
      toast.success('Cập nhật thông tin thành công!');
      localStorage.setItem('user', JSON.stringify(res.data.user));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  // ===== LOGIC ĐỔI MẬT KHẨU =====
  const handleChangePassword = async () => {
    if (passData.newPassword !== passData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      await authService.changePassword(passData);
      toast.success('Đổi mật khẩu thành công!');
      setPassData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setShowChangePassword(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi đổi mật khẩu');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const showPasswordHint = passData.confirmPassword && passData.newPassword !== passData.confirmPassword;

  // ===== RENDER LỖI & LOADING =====
  if (fetchError) {
    return (
      <div className="text-center max-w-md mx-auto py-20">
        <h3 className="font-bold text-xl mb-2 text-red-600 dark:text-red-400">Có lỗi xảy ra</h3>
        <p className="text-red-700 dark:text-red-300">{fetchError}</p>
        <p className="text-sm text-red-500/80 mt-4">Hãy kiểm tra lại Server API hoặc đăng nhập lại.</p>
      </div>
    );
  }

  if (!user.username && !fetchError)
    return (
      <div className="text-grey-500 animate-pulse font-medium py-20 text-center">
        ⏳ Đang tải thông tin từ Server...
      </div>
    );

  // ===== RENDER GIAO DIỆN CHÍNH =====
  return (
    <div className="space-y-0 divide-y divide-grey-200 dark:divide-grey-800">
      {/* ===== AVATAR & IDENTITY ===== */}
      <section className="flex items-center gap-6 pb-10">
        <div
          onClick={() => !uploadingAvatar && fileInputRef.current?.click()}
          className="relative shrink-0 group cursor-pointer"
        >
          {uploadingAvatar && (
            <div className="absolute inset-0 z-20 bg-black/60 rounded-full flex items-center justify-center">
              <RiLoader4Fill className="animate-spin text-white" size={32} />
            </div>
          )}

          <div className="absolute inset-0 z-10 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 gap-1">
            <RiCameraFill className="text-white" size={24} />
            {/* <span className="text-[10px] text-white font-bold uppercase">Đổi ảnh</span> */}
          </div>

          <Avatar
            src={user.avatar && user.avatar !== '/images/default-avatar.png' ? user.avatar : null}
            alt={user.displayName || user.username || 'User'}
            fallback={user.displayName || user.username || 'U'}
            size="xl"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold text-grey-900 dark:text-grey-50 truncate">
            {user.displayName || user.username}
          </h2>
          <p className="text-sm text-grey-500 dark:text-grey-400 truncate">@{user.username}</p>
          {user.tagline && <p className="text-sm text-grey-600 dark:text-grey-400 mt-1 line-clamp-1">{user.tagline}</p>}
        </div>

        {user._id && (
          <Button render={<a href={`/author/${user._id}`} />} intent="ghost" className="shrink-0">
            <RiExternalLinkFill size={16} /> Xem trang
          </Button>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleAvatarChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
        />
      </section>

      {/* ===== THÔNG TIN CÁ NHÂN ===== */}
      <section className="py-10 space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-grey-700 dark:text-grey-300">
          Thông tin cá nhân
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <TextField label="Tên đăng nhập" disabled value={user.username || ''} />
          <TextField label="Email" disabled value={user.email || ''} />
        </div>

        <TextField
          label="Tên hiển thị"
          value={user.displayName || ''}
          onChange={(e) => setUser({ ...user, displayName: e.target.value })}
        />

        <TextField
          label="Tiểu sử ngắn (Tagline)"
          value={user.tagline || ''}
          onChange={(e) => setUser({ ...user, tagline: e.target.value })}
        />

        <TextField
          label="Số điện thoại"
          value={user.phone || ''}
          onChange={(e) => setUser({ ...user, phone: e.target.value })}
        />

        <Button onClick={handleUpdateInfo} disabled={loading} intent="primary" className="mt-2">
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </section>

      {/* ===== ĐỔI MẬT KHẨU ===== */}
      <section className="py-10">
        <div
          onClick={() => setShowChangePassword(!showChangePassword)}
          className="flex items-center justify-between cursor-pointer group"
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-grey-700 dark:text-grey-300 flex items-center gap-4 group-hover:text-primary-500 transition-colors">
            <RiKeyFill size={20} /> Đổi mật khẩu
          </h3>
          <RiArrowRightSFill
            size={20}
            className={`text-grey-400 transition-transform duration-300 ${showChangePassword ? 'rotate-90' : ''}`}
          />
        </div>

        {showChangePassword && (
          <div className="space-y-4 mt-6">
            <TextField
              label="Mật khẩu cũ"
              type="password"
              value={passData.oldPassword}
              onChange={(e) => setPassData({ ...passData, oldPassword: e.target.value })}
            />
            <TextField
              label="Mật khẩu mới"
              type="password"
              value={passData.newPassword}
              onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
            />
            <TextField
              label="Xác nhận mật khẩu mới"
              type="password"
              value={passData.confirmPassword}
              onChange={(e) =>
                setPassData({
                  ...passData,
                  confirmPassword: e.target.value,
                })
              }
            />

            {showPasswordHint && (
              <p className="text-xs text-red-500 dark:text-red-400 font-medium">Mật khẩu xác nhận chưa khớp!</p>
            )}

            <Button onClick={handleChangePassword} intent="neutral" className="w-full">
              Cập nhật mật khẩu
            </Button>
          </div>
        )}
      </section>

      {/* ===== ĐĂNG XUẤT ===== */}
      <section className="pt-10">
        <Button onClick={handleLogout} intent="danger" className="w-full">
          <RiLogoutBoxRFill size={18} /> Đăng xuất khỏi hệ thống
        </Button>
      </section>
    </div>
  );
}
