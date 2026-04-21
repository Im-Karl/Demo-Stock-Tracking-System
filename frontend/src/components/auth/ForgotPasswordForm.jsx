import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, KeyRound } from 'lucide-react';
import { authService } from '../../services/authService';
import Button from '../base-ui/Button';
import PageLayout from '../base-ui/PageLayout';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('loading');
    setMessage('');

    try {
      await authService.forgotPassword(email);
      setStatus('success');
      setMessage('Thành công! Hệ thống đã gửi MẬT KHẨU MỚI vào email của bạn. Hãy dùng nó để đăng nhập.');
    } catch (err) {
      setStatus('error');
      setMessage(
        err.response?.data?.message || err.response?.data?.error || 'Không tìm thấy email này hoặc lỗi hệ thống.',
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `
    w-full pl-10 pr-4 py-3 rounded-xl 
    bg-white dark:bg-neutral-900 
    text-neutral-900 dark:text-neutral-100 
    placeholder-neutral-400 dark:placeholder-neutral-500 
    caret-blue-600 dark:caret-blue-400 
    border border-neutral-300 dark:border-neutral-700 
    focus:outline-none focus:ring-2 focus:ring-blue-500 
    transition
  `;

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full p-8 rounded-3xl bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-emerald-500/40 shadow-2xl text-center"
        >
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            <KeyRound size={32} />
          </div>
          <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">Đã cấp lại mật khẩu</h2>
          <p className="text-neutral-600 dark:text-neutral-300 mb-6">{message}</p>

          <Button render={<a href="/login" />} intent="success" className="w-full">
            Quay lại Đăng nhập
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <PageLayout className="flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md p-8 rounded-3xl bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700/50 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl text-blue-600 dark:text-blue-400 font-extrabold mb-2">Quên mật khẩu</h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">Nhập email để hệ thống cấp lại mật khẩu mới</p>
        </div>

        {message && (
          <div
            className={`text-sm text-center mb-4 p-3 rounded-xl border ${status === 'error' ? 'bg-red-100 dark:bg-red-500/10 text-red-600 border-red-300 dark:border-red-500/30' : 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30'}`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium mb-1 block">
              Email đăng ký
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
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

          <Button type="submit" intent="primary" disabled={loading} className="w-full">
            {loading ? 'Đang xử lý...' : 'Lấy mật khẩu mới'}
          </Button>
        </form>
      </motion.div>
    </PageLayout>
  );
}
