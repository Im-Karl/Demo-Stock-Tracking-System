import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { authService } from '../../services/authService';
import { User, Mail, Lock } from 'lucide-react';

export default function AuthForm({ type }) {
  const isLogin = type === 'login';

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = isLogin
        ? await authService.login(formData)
        : await authService.register(formData);

      const data = res.data;

      if (isLogin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/';
      } else {
        window.location.href = '/login';
      }
    } catch (err) {
      console.log(err);
    }
  };

  const inputClass = `
    w-full pl-10 pr-4 py-3 rounded-xl
    bg-white dark:bg-slate-900
    text-slate-900 dark:text-slate-100
    placeholder-slate-400 dark:placeholder-slate-500
    caret-slate-600 dark:caret-slate-200
    border border-slate-300 dark:border-slate-700
    focus:outline-none focus:ring-2 focus:ring-[#D5457D]
    transition
  `;

  return (
    <div className="relative min-h-screen flex items-center justify-center
                    bg-slate-50 dark:bg-[#0f172a] overflow-hidden">

      {/* Ambient light */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#D5457D]/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#C93A70]/30 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md p-8 rounded-3xl
                   bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl
                   border border-slate-200 dark:border-slate-700/50
                   shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl text-[#D5457D] dark:text-[#C93A70] font-extrabold mb-2">
            {isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            {isLogin
              ? 'Đăng nhập để tiếp tục theo dõi thị trường'
              : 'Tham gia cộng đồng đầu tư FinSavvy'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-[#D5457D] dark:text-[#C93A70] font-medium mb-1 block">
              Tên đăng nhập
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                required
                type="text"
                className={inputClass}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="text-sm text-[#D5457D] dark:text-[#C93A70] font-medium mb-1 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="email"
                  className={inputClass}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-sm text-[#D5457D] dark:text-[#C93A70] font-medium mb-1 block">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                required
                type="password"
                className={inputClass}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {isLogin && (
            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-sm text-[#D5457D] dark:text-[#C93A70] hover:underline"
              >
                Quên mật khẩu?
              </a>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-white text-lg
                       bg-gradient-to-r from-[#D5457D] to-[#C93A70]
                       hover:from-[#C93A70] hover:to-[#D5457D]
                       transition-all hover:scale-[1.02] cursor-pointer"
          >
            {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}