import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService';

export default function UserProfile() {
  const [user, setUser] = useState({ username: '', email: '', displayName: '', phone: '' });
  const [passData, setPassData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null); // Thêm state lỗi
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => { 
    authService.getProfile()
      .then(res => {
        console.log("✅ Dữ liệu Profile:", res.data);
        setUser(res.data);
      })
      .catch(err => {
        console.error("❌ Lỗi lấy Profile:", err);
        // Hiển thị lỗi ra màn hình thay vì treo loading
        setFetchError(err.response?.data?.message || err.message || "Không thể tải thông tin cá nhân");
      });
  }, []);

  const handleUpdateInfo = async () => {
    setLoading(true);
    // Xử lý chuỗi rỗng trước khi gửi
    const dataToSend = {
        displayName: user.displayName === "" ? undefined : user.displayName,
        phone: user.phone === "" ? undefined : user.phone
    };

    console.log("Gửi đi:", dataToSend);

    try {
      const res = await authService.updateProfile(dataToSend);
      toast.success("Cập nhật thông tin thành công!");
      localStorage.setItem('user', JSON.stringify(res.data.user));
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
      setPassData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi đổi mật khẩu");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const showPasswordHint =
  passData.confirmPassword &&
  passData.newPassword !== passData.confirmPassword;

  // 🔴 NẾU CÓ LỖI -> HIỆN LỖI (Thay vì treo Loading)
  if (fetchError) {
      return (
          <div className="p-10 text-center text-red-600 bg-red-50 border border-red-200 rounded">
              <h3 className="font-bold text-xl mb-2">⚠️ Có lỗi xảy ra</h3>
              <p>{fetchError}</p>
              <p className="text-sm text-gray-500 mt-2">Hãy kiểm tra lại Server API hoặc đăng nhập lại.</p>
          </div>
      );
  }

  // Nếu đang tải lần đầu
  if (!user.username && !fetchError) return <div className="p-10 text-center text-blue-600">⏳ Đang tải thông tin từ Server...</div>;

  return (
  <div className="relative min-h-screen bg-slate-50 dark:bg-[#0f172a] py-16 px-4
                  text-slate-800 dark:text-slate-100">

    {/* Ambient */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-500/20 blur-[120px] rounded-full" />
    </div>

    <div className="relative z-10 max-w-5xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-10">
        Hồ sơ người dùng
        <span className="block text-lg font-medium text-slate-600 dark:text-slate-400 mt-2">
          Quản lý thông tin & bảo mật tài khoản
        </span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* ===== PROFILE ===== */}
        <div className="rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl
                        border border-slate-200 dark:border-slate-700 shadow-xl p-8">

          <h2 className="text-xl font-bold mb-6">
            Thông tin cá nhân
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-500 dark:text-slate-400">
                Tên đăng nhập
              </label>
              <input
                disabled
                value={user.username || ''}
                className="w-full mt-1 p-3 rounded-lg
                           bg-slate-100 dark:bg-slate-700
                           border border-slate-200 dark:border-slate-600
                           text-slate-500 dark:text-slate-400
                           cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-sm text-slate-500 dark:text-slate-400">
                Email
              </label>
              <input
                disabled
                value={user.email || ''}
                className="w-full mt-1 p-3 rounded-lg
                           bg-slate-100 dark:bg-slate-700
                           border border-slate-200 dark:border-slate-600
                           text-slate-500 dark:text-slate-400
                           cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Tên hiển thị
              </label>
              <input
                value={user.displayName || ''}
                onChange={e => setUser({ ...user, displayName: e.target.value })}
                className="w-full mt-1 p-3 rounded-lg
                           bg-white dark:bg-slate-900
                           border border-slate-300 dark:border-slate-600
                           text-slate-900 dark:text-slate-100
                           placeholder:text-slate-400
                           focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Số điện thoại
              </label>
              <input
                value={user.phone || ''}
                onChange={e => setUser({ ...user, phone: e.target.value })}
                className="w-full mt-1 p-3 rounded-lg
                           bg-white dark:bg-slate-900
                           border border-slate-300 dark:border-slate-600
                           text-slate-900 dark:text-slate-100
                           placeholder:text-slate-400
                           focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <button
              onClick={handleUpdateInfo}
              disabled={loading}
              className={`w-full mt-4 py-3 rounded-xl font-bold text-white transition cursor-pointer
                ${loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90"
                }`}
            >
              {loading ? " Đang lưu..." : " Lưu thay đổi"}
            </button>
          </div>
        </div>

        {/* ===== SECURITY ===== */}
        <div className="rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl
                        border border-slate-200 dark:border-slate-700 shadow-xl p-8 h-fit">

          <button
            onClick={() => setShowChangePassword(!showChangePassword)}
            className="w-full flex items-center justify-between text-xl font-bold
                       text-slate-800 dark:text-slate-100 cursor-pointer"
          >
            <span>Đổi mật khẩu</span>
            <span className={`transition-transform ${showChangePassword ? "rotate-90" : ""}`}>
              ▶
            </span>
          </button>

          {showChangePassword && (
            <div className="space-y-4 mt-6">
              {["oldPassword", "newPassword", "confirmPassword"].map((field, i) => (
                <input
                  key={i}
                  type="password"
                  placeholder={
                    field === "oldPassword"
                      ? "Mật khẩu cũ"
                      : field === "newPassword"
                      ? "Mật khẩu mới"
                      : "Xác nhận mật khẩu mới"
                  }
                  value={passData[field] || ""}
                  onChange={e => setPassData({ ...passData, [field]: e.target.value })}
                  className="w-full p-3 rounded-lg
                             bg-white dark:bg-slate-900
                             border border-slate-300 dark:border-slate-600
                             text-slate-900 dark:text-slate-100
                             placeholder:text-slate-400"
                />
              ))}

              {showPasswordHint && (
                <p className="text-xs text-red-500 italic">
                  Mật khẩu xác nhận chưa trùng
                </p>
              )}

              <button
                onClick={handleChangePassword}
                className="w-full py-3 rounded-xl font-bold text-white
                           bg-slate-900 hover:bg-black transition"
              >
                Đổi mật khẩu
              </button>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={handleLogout}
              className="w-full py-2 rounded-lg text-sm font-semibold
                         text-red-600 dark:text-red-400
                         bg-red-50 dark:bg-red-500/10
                         hover:bg-red-100 dark:hover:bg-red-500/20 transition cursor-pointer"
            >
               Đăng xuất
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
);
}