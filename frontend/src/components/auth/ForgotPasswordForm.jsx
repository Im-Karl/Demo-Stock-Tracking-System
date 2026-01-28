import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
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
        "Thành công! Hệ thống đã gửi MẬT KHẨU MỚI vào email của bạn. Hãy dùng nó để đăng nhập."
      );
    } catch (err) {
      setStatus("error");

      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Không tìm thấy email này hoặc lỗi hệ thống.";

      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `
    w-full pl-10 pr-4 py-3 rounded-xl
    bg-white dark:bg-slate-900
    text-slate-900 dark:text-slate-100
    placeholder-slate-400 dark:placeholder-slate-500
    caret-slate-600 dark:caret-slate-200
    border border-slate-300 dark:border-slate-700
    focus:outline-none focus:ring-2 focus:ring-blue-500
    transition
  `;

  /* ===== SUCCESS STATE ===== */
  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center
                      bg-slate-50 dark:bg-[#0f172a]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full p-8 rounded-3xl
                     bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl
                     border border-green-300 dark:border-green-500/30
                     shadow-2xl text-center"
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20
                          text-green-600 dark:text-green-400
                          rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            🔑
          </div>

          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
            Đã cấp lại mật khẩu
          </h2>

          <p className="text-slate-600 dark:text-slate-300 mb-6">
            {message}
          </p>

          <a
            href="/login"
            className="inline-block w-full py-3 rounded-xl font-bold text-white
                       bg-gradient-to-r from-blue-600 to-violet-600
                       hover:from-blue-500 hover:to-violet-500
                       transition"
          >
            Quay lại Đăng nhập
          </a>
        </motion.div>
      </div>
    );
  }

  /* ===== FORM STATE ===== */
  return (
    <div className="relative min-h-screen flex items-center justify-center
                    bg-slate-50 dark:bg-[#0f172a] overflow-hidden">
      {/* Ambient light */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px]
                        bg-blue-500/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px]
                        bg-violet-500/30 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 rounded-3xl
                   bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl
                   border border-slate-200 dark:border-slate-700/50
                   shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl text-orange-600 dark:text-orange-500 font-extrabold mb-2">
            Quên mật khẩu
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Nhập email để hệ thống cấp lại mật khẩu mới
          </p>
        </div>

        {message && (
          <div
            className={`text-sm text-center mb-4 p-3 rounded-xl border
              ${
                status === "error"
                  ? "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-300 dark:border-red-500/30"
                  : "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-300 dark:border-green-500/30"
              }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-orange-600 dark:text-orange-500 font-medium mb-1 block">
              Email đăng ký
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="email"
                required
                placeholder="example@email.com"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white text-lg
                       bg-gradient-to-r from-blue-600 to-violet-600
                       hover:from-blue-500 hover:to-violet-500
                       shadow-lg shadow-blue-500/30
                       transition-all hover:scale-[1.02]
                       disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Đang xử lý..." : "Lấy mật khẩu mới"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
