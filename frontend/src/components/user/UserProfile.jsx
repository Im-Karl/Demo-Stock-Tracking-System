import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { authService } from "../../services/authService";
import ThemeToggle from "../ui/ThemeToggle";
import {
  ExternalLink,
  KeyRound,
  LogOut,
  User as UserIcon,
  Camera,
  Loader2,
} from "lucide-react";
import { uploadService } from "../../services/uploadService";
import PageLayout from "../base-ui/PageLayout";
import GlassCard from "../base-ui/GlassCard";
import Button from "../base-ui/Button";
import Input from "../base-ui/Input";

export default function UserProfile() {
  const [user, setUser] = useState({
    _id: "",
    username: "",
    email: "",
    displayName: "",
    phone: "",
    tagline: "",
    avatar: "", // 👈 Đã có trường avatar
  });

  const [passData, setPassData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
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
        const localUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem(
          "user",
          JSON.stringify({ ...localUser, ...res.data }),
        );
      })
      .catch((err) => {
        setFetchError(
          err.response?.data?.message ||
            err.message ||
            "Không thể tải thông tin cá nhân",
        );
      });
  }, []);

  // ===== LOGIC UPLOAD AVATAR =====
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.");
      return;
    }

    setUploadingAvatar(true);
    try {
      // 1. Up lên Supabase
      const uploadRes = await uploadService.uploadImage(file);
      const imageUrl = uploadRes.data.url;

      // 2. Lưu vào DB của mình
      await authService.updateProfile({ avatar: imageUrl });

      // 3. Cập nhật UI & LocalStorage
      setUser({ ...user, avatar: imageUrl });
      const currentUser = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem(
        "user",
        JSON.stringify({ ...currentUser, avatar: imageUrl }),
      );

      toast.success("Đổi ảnh đại diện thành công!");
    } catch (err) {
      toast.error("Lỗi khi tải ảnh lên!");
      console.log(err);
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ===== LOGIC CẬP NHẬT THÔNG TIN =====
  const handleUpdateInfo = async () => {
    setLoading(true);
    const dataToSend = {
      displayName: user.displayName === "" ? undefined : user.displayName,
      phone: user.phone === "" ? undefined : user.phone,
      tagline: user.tagline === "" ? undefined : user.tagline,
    };

    try {
      const res = await authService.updateProfile(dataToSend);
      toast.success("Cập nhật thông tin thành công!");
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  // ===== LOGIC ĐỔI MẬT KHẨU =====
  const handleChangePassword = async () => {
    if (passData.newPassword !== passData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      await authService.changePassword(passData);
      toast.success("Đổi mật khẩu thành công!");
      setPassData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowChangePassword(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi đổi mật khẩu");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const showPasswordHint =
    passData.confirmPassword &&
    passData.newPassword !== passData.confirmPassword;

  // ===== RENDER LỖI & LOADING =====
  if (fetchError) {
    return (
      <PageLayout
        showAmbient={false}
        className="flex items-center justify-center p-4"
      >
        <GlassCard
          intent="success"
          className="!border-red-500/40 !bg-red-50 dark:!bg-red-900/20 text-center max-w-md p-8"
        >
          <h3 className="font-bold text-xl mb-2 text-red-600 dark:text-red-400">
            Có lỗi xảy ra
          </h3>
          <p className="text-red-700 dark:text-red-300">{fetchError}</p>
          <p className="text-sm text-red-500/80 mt-4">
            Hãy kiểm tra lại Server API hoặc đăng nhập lại.
          </p>
        </GlassCard>
      </PageLayout>
    );
  }

  if (!user.username && !fetchError)
    return (
      <PageLayout
        showAmbient={false}
        className="flex items-center justify-center"
      >
        <div className="text-neutral-500 animate-pulse font-medium">
          ⏳ Đang tải thông tin từ Server...
        </div>
      </PageLayout>
    );

  // ===== RENDER GIAO DIỆN CHÍNH =====
  return (
    <PageLayout showAmbient={false} className="py-16 px-4">
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-white">
              Hồ sơ người dùng
            </h1>
            <span className="block text-lg font-medium text-neutral-500 dark:text-neutral-400 mt-2">
              Quản lý thông tin & bảo mật tài khoản
            </span>
          </div>

          <div className="ml-4">{/* <ThemeToggle client:load /> */}</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ===== CỘT 1: THÔNG TIN CÁ NHÂN ===== */}
          <GlassCard padding="xl">
            {/* AVATAR UPLOAD */}
            <div className="flex flex-col items-center mb-8">
              <div
                onClick={() =>
                  !uploadingAvatar && fileInputRef.current?.click()
                }
                className="relative w-28 h-28 rounded-full group cursor-pointer border-4 border-white dark:border-neutral-800 shadow-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 transition-transform hover:scale-105"
              >
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center">
                    <Loader2 className="animate-spin text-white" size={32} />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/50 z-10 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Camera className="text-white mb-1" size={24} />
                  <span className="text-[10px] text-white font-bold uppercase">
                    Đổi ảnh
                  </span>
                </div>

                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white text-4xl font-extrabold">
                    {(user.displayName || user.username)
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
              />
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1 block">
                  Tên đăng nhập
                </label>
                <Input
                  disabled
                  value={user.username || ""}
                  className="opacity-60 bg-neutral-100 dark:bg-neutral-800"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1 block">
                  Email
                </label>
                <Input
                  disabled
                  value={user.email || ""}
                  className="opacity-60 bg-neutral-100 dark:bg-neutral-800"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-1 block">
                  Tên hiển thị
                </label>
                <Input
                  value={user.displayName || ""}
                  onChange={(e) =>
                    setUser({ ...user, displayName: e.target.value })
                  }
                  placeholder="Nhập tên hiển thị"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-1 block">
                  Tiểu sử ngắn (Tagline)
                </label>
                <Input
                  value={user.tagline || ""}
                  onChange={(e) =>
                    setUser({ ...user, tagline: e.target.value })
                  }
                  placeholder="Ví dụ: Người đam mê viết lách"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-1 block">
                  Số điện thoại
                </label>
                <Input
                  value={user.phone || ""}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <Button
                onClick={handleUpdateInfo}
                disabled={loading}
                intent="primary"
                className="w-full mt-2"
              >
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </GlassCard>

          {/* ===== CỘT 2: BẢO MẬT & MỞ RỘNG ===== */}
          <div className="space-y-8">
            <GlassCard padding="lg">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
                    Trang công khai
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    Nơi người khác có thể tìm hiểu về bạn
                  </p>
                </div>

                {user._id && (
                  <Button
                    render={<a href={`/author/${user._id}`} />}
                    intent="primarySoft"
                    size="sm"
                    className="w-full sm:w-auto flex-shrink-0"
                  >
                    <ExternalLink size={16} /> Xem trang
                  </Button>
                )}
              </div>
            </GlassCard>

            <GlassCard padding="lg">
              <div
                onClick={() => setShowChangePassword(!showChangePassword)}
                className="flex items-center justify-between cursor-pointer group"
              >
                <h3 className="font-bold text-lg text-neutral-900 dark:text-white flex items-center gap-2 group-hover:text-blue-500 transition-colors">
                  <KeyRound className="text-neutral-400 group-hover:text-blue-500" />{" "}
                  Đổi mật khẩu
                </h3>
                <span
                  className={`text-neutral-400 transition-transform duration-300 ${showChangePassword ? "rotate-90" : ""}`}
                >
                  ▶
                </span>
              </div>

              {showChangePassword && (
                <div className="space-y-4 mt-6 animate-in slide-in-from-top-2 duration-200">
                  <Input
                    type="password"
                    placeholder="Mật khẩu cũ"
                    value={passData.oldPassword}
                    onChange={(e) =>
                      setPassData({ ...passData, oldPassword: e.target.value })
                    }
                  />
                  <Input
                    type="password"
                    placeholder="Mật khẩu mới"
                    value={passData.newPassword}
                    onChange={(e) =>
                      setPassData({ ...passData, newPassword: e.target.value })
                    }
                  />
                  <Input
                    type="password"
                    placeholder="Xác nhận mật khẩu mới"
                    value={passData.confirmPassword}
                    onChange={(e) =>
                      setPassData({
                        ...passData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />

                  {showPasswordHint && (
                    <p className="text-xs text-red-500 dark:text-red-400 font-medium">
                      Mật khẩu xác nhận chưa khớp!
                    </p>
                  )}

                  <Button
                    onClick={handleChangePassword}
                    intent="neutral"
                    className="w-full"
                  >
                    Cập nhật mật khẩu
                  </Button>
                </div>
              )}
            </GlassCard>

            <Button
              onClick={handleLogout}
              intent="dangerSoft"
              className="w-full h-14"
            >
              <LogOut size={18} /> Đăng xuất khỏi hệ thống
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
