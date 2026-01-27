import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';

export default function UserProfile() {
  const [user, setUser] = useState({ username: '', email: '', displayName: '', phone: '' });
  const [passData, setPassData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null); // Thêm state lỗi
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    // Gọi API lấy thông tin
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

    console.log("📦 Gửi đi:", dataToSend);

    try {
      const res = await authService.updateProfile(dataToSend);
      alert("Cập nhật thành công!");
      localStorage.setItem('user', JSON.stringify(res.data.user));
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      await authService.changePassword(passData);
      alert("Đổi mật khẩu thành công!");
      setPassData({ oldPassword: '', newPassword: '' });
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi đổi mật khẩu");
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
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Cột 1: Thông tin chung */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Thông tin cá nhân</h2>
        <div className="space-y-4">
           {/* Username & Email (Read-only) */}
           <div>
             <label className="block text-sm font-medium text-gray-500">Tên đăng nhập</label>
             <input disabled value={user.username || ''} className="w-full p-2 bg-gray-100 rounded border mt-1 cursor-not-allowed" />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-500">Email</label>
             <input disabled value={user.email || ''} className="w-full p-2 bg-gray-100 rounded border mt-1 cursor-not-allowed" />
           </div>
           
           {/* Display Name */}
           <div>
             <label className="block text-sm font-medium">Tên hiển thị (Tác giả)</label>
             <input 
                value={user.displayName || ''} 
                onChange={e => setUser({...user, displayName: e.target.value})}
                placeholder="Nhập tên hiển thị..."
                className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
             />
           </div>

           {/* Phone */}
           <div>
             <label className="block text-sm font-medium">Số điện thoại</label>
             <input 
                value={user.phone || ''} 
                onChange={e => setUser({...user, phone: e.target.value})}
                placeholder="Nhập số điện thoại..."
                className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
             />
           </div>

           {/* Nút bấm */}
           <button 
             onClick={handleUpdateInfo} 
             disabled={loading} 
             className={`cursor-pointer px-4 py-2 rounded text-white font-bold transition
                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
             `}
           >
             {loading ? "⏳ Đang lưu..." : "💾 Lưu thay đổi"}
           </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow h-fit flex-col">
  <button
    onClick={() => setShowChangePassword(!showChangePassword)}
    className="cursor-pointer w-full flex items-center justify-between text-xl font-bold mb-2"
  >
    <span>Đổi mật khẩu</span>
    <span
      className={`transform transition-transform duration-200 ${
        showChangePassword ? "rotate-90" : ""
      }`}
    >
      ▶
    </span>
  </button>

  {/* Nội dung ẩn / hiện */}
  {showChangePassword && (
    <div className="space-y-4 mt-4">
      <input 
        type="password"
        placeholder="Mật khẩu cũ"
        className="w-full p-2 border rounded"
        value={passData.oldPassword}
        onChange={e =>
          setPassData({ ...passData, oldPassword: e.target.value })
        }
      />

      <input 
        type="password"
        placeholder="Mật khẩu mới"
        className="w-full p-2 border rounded"
        value={passData.newPassword}
        onChange={e =>
          setPassData({ ...passData, newPassword: e.target.value })
        }
      />

      <input 
        type="password"
        placeholder="Xác nhận mật khẩu mới"
        className="w-full p-2 border rounded"
        value={passData.confirmPassword}
        onChange={e =>
          setPassData({ ...passData, confirmPassword: e.target.value })
        }
      />

      {showPasswordHint && (
        <p className="text-xs text-red-500 italic">
          Mật khẩu xác nhận hiện chưa trùng
        </p>
      )}

      <button 
        onClick={handleChangePassword} 
        className="cursor-pointer bg-gray-800 text-white px-4 py-2 rounded hover:bg-black w-full"
      >
        Đổi mật khẩu
      </button>
    </div>
  )}
  <div className="mt-8 pt-4 border-t border-gray-200">
  <button
    onClick={handleLogout}
    className="cursor-pointer ml-auto block bg-gray-100 text-red-600 text-sm font-semibold
               hover:bg-red-100 px-4 py-2 rounded transition"
  >
     Thoát
  </button>
</div>
</div>
    </div>
  );
}