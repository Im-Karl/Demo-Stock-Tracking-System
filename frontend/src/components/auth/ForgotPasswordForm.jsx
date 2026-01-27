import React, { useState } from "react";
import { authService } from "../../services/authService";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(""); 
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("loading");
    setMessage("");

    try {
      await authService.forgotPassword(email);
      setStatus("success");
      setMessage(
        " Thành công! Hệ thống đã gửi MẬT KHẨU MỚI vào email của bạn. Hãy dùng nó để đăng nhập."
      );
    } catch (err) {
      setStatus("error");
      
      //  2. SỬA ĐOẠN NÀY: Backend trả về 'error' khi 500, và 'message' khi 404
      const errorMsg = 
        err.response?.data?.message || 
        err.response?.data?.error || // <-- Thêm dòng này để bắt lỗi gửi mail
        " Không tìm thấy email này hoặc lỗi hệ thống.";
        
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };  

  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg border border-green-100 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          🔑
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Đã cấp lại mật khẩu</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <a href="/login" className="inline-block w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
          Quay lại Đăng nhập ngay
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-center mb-4">Cấp lại mật khẩu</h2>

      {message && (
        <div className={`text-center text-sm mb-4 p-2 rounded ${status === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Email đăng ký"
          className="w-full p-2 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <button
          disabled={loading}
          className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-70"
        >
          {/* 👇 3. Sửa text cho đúng logic */}
          {loading ? "Đang xử lý..." : "Lấy mật khẩu mới"}
        </button>
      </form>
    </div>
  );
}