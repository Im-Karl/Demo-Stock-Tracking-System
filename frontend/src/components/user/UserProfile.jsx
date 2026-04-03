import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { authService } from "../../services/authService";
import ThemeToggle from "../ui/ThemeToggle";
import { ExternalLink, KeyRound, LogOut, User as UserIcon } from "lucide-react";
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
  });
  const [passData, setPassData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    authService
      .getProfile()
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        setFetchError(
          err.response?.data?.message ||
            err.message ||
            "Không thể tải thông tin cá nhân",
        );
      });
  }, []);

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

  if (fetchError) {
    return (
      <PageLayout showAmbient={false} className="flex items-center justify-center p-4">
        <GlassCard intent="success" className="!border-red-500/40 !bg-red-50 dark:!bg-red-900/20 text-center max-w-md p-8">
          <h3 className="font-bold text-xl mb-2 text-red-600 dark:text-red-400">Có lỗi xảy ra</h3>
          <p className="text-red-700 dark:text-red-300">{fetchError}</p>
          <p className="text-sm text-red-500/80 mt-4">Hãy kiểm tra lại Server API hoặc đăng nhập lại.</p>
        </GlassCard>
      </PageLayout>
    );
  }

  if (!user.username && !fetchError)
    return (
      <PageLayout showAmbient={false} className="flex items-center justify-center">
        <div className="text-neutral-500 animate-pulse font-medium">⏳ Đang tải thông tin từ Server...</div>
      </PageLayout>
    );

  return (
    <PageLayout showAmbient={false} className="py-16 px-4">
      <div className="relative z-10 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-white">Hồ sơ người dùng</h1>
            <span className="block text-lg font-medium text-neutral-500 dark:text-neutral-400 mt-2">
              Quản lý thông tin & bảo mật tài khoản
            </span>
          </div>

          <div className="ml-4">
            <ThemeToggle client:load />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* ===== COLUMN 1: THÔNG TIN CÁ NHÂN ===== */}
          <GlassCard padding="xl">
            <h2 className="text-xl font-bold mb-6 text-neutral-900 dark:text-white flex items-center gap-2">
              <UserIcon className="text-blue-500" /> Thông tin cá nhân
            </h2>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1 block">Tên đăng nhập</label>
                <Input disabled value={user.username || ""} className="opacity-60 bg-neutral-100 dark:bg-neutral-800" />
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1 block">Email</label>
                <Input disabled value={user.email || ""} className="opacity-60 bg-neutral-100 dark:bg-neutral-800" />
              </div>

              <div>
                <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-1 block">Tên hiển thị</label>
                <Input value={user.displayName || ""} onChange={(e) => setUser({ ...user, displayName: e.target.value })} placeholder="Nhập tên hiển thị" />
              </div>

              <div>
                <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-1 block">Tiểu sử ngắn (Tagline)</label>
                <Input value={user.tagline || ""} onChange={(e) => setUser({ ...user, tagline: e.target.value })} placeholder="Ví dụ: Người đam mê viết lách" />
              </div>

              <div>
                <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-1 block">Số điện thoại</label>
                <Input value={user.phone || ""} onChange={(e) => setUser({ ...user, phone: e.target.value })} placeholder="Nhập số điện thoại" />
              </div>

              <Button onClick={handleUpdateInfo} disabled={loading} intent="primary" className="w-full mt-2">
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </GlassCard>

          {/* ===== COLUMN 2: BẢO MẬT & MỞ RỘNG ===== */}
          <div className="space-y-8">
            
            <GlassCard padding="lg">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Trang công khai</h3>
                  <p className="text-sm text-neutral-500 mt-1">Nơi người khác có thể tìm hiểu về bạn</p>
                </div>
                
                {user._id && (
                  <Button render={<a href={`/author/${user._id}`} />} intent="primarySoft" size="sm" className="w-full sm:w-auto flex-shrink-0">
                    <ExternalLink size={16} /> Xem trang
                  </Button>
                )}
              </div>
            </GlassCard>

            {/* ĐỔI MẬT KHẨU */}
            <GlassCard padding="lg">
              <div 
                onClick={() => setShowChangePassword(!showChangePassword)}
                className="flex items-center justify-between cursor-pointer group"
              >
                <h3 className="font-bold text-lg text-neutral-900 dark:text-white flex items-center gap-2 group-hover:text-blue-500 transition-colors">
                  <KeyRound className="text-neutral-400 group-hover:text-blue-500" /> Đổi mật khẩu
                </h3>
                <span className={`text-neutral-400 transition-transform duration-300 ${showChangePassword ? "rotate-90" : ""}`}>
                  ▶
                </span>
              </div>

              {showChangePassword && (
                <div className="space-y-4 mt-6 animate-in slide-in-from-top-2 duration-200">
                  <Input type="password" placeholder="Mật khẩu cũ" value={passData.oldPassword} onChange={(e) => setPassData({ ...passData, oldPassword: e.target.value })} />
                  <Input type="password" placeholder="Mật khẩu mới" value={passData.newPassword} onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })} />
                  <Input type="password" placeholder="Xác nhận mật khẩu mới" value={passData.confirmPassword} onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })} />
                  
                  {showPasswordHint && (
                    <p className="text-xs text-red-500 dark:text-red-400 font-medium">Mật khẩu xác nhận chưa khớp!</p>
                  )}

                  <Button onClick={handleChangePassword} intent="neutral" className="w-full">
                    Cập nhật mật khẩu
                  </Button>
                </div>
              )}
            </GlassCard>

            {/* ĐĂNG XUẤT */}
            <Button onClick={handleLogout} intent="dangerSoft" className="w-full h-14">
              <LogOut size={18} /> Đăng xuất khỏi hệ thống
            </Button>
            
          </div>
        </div>

      </div>
    </PageLayout>
  );
}