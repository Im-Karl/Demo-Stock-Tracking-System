import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RiMailFill, RiKeyFill } from 'react-icons/ri';
import { authService } from '../../services/authService';
import Button from '../base-ui/Button';
import PageLayout from '../base-ui/PageLayout';
import GlassCard from '../base-ui/GlassCard';
import TextField from '../base-ui/TextField';

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

  if (status === 'success') {
    return (
      <PageLayout className="flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto"
        >
          <GlassCard className="text-center border-emerald-500/40 dark:border-emerald-500/30">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              <RiKeyFill size={32} />
            </div>
            <h2 className="text-2xl font-bold font-heading text-emerald-600 dark:text-emerald-400 mb-2">
              Đã cấp lại mật khẩu
            </h2>
            <p className="text-grey-600 dark:text-grey-300 mb-6">{message}</p>

            <Button render={<a href="/login" />} intent="success" className="w-full">
              Quay lại Đăng nhập
            </Button>
          </GlassCard>
        </motion.div>
      </PageLayout>
    );
  }

  return (
    <PageLayout className="flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md mx-auto"
      >
        <GlassCard>
          <div className="text-center mb-8">
            <h2 className="text-3xl text-primary-600 dark:text-primary-400 font-extrabold mb-2 font-heading">
              Quên mật khẩu
            </h2>
            <p className="text-grey-600 dark:text-grey-400 text-sm">Nhập email để hệ thống cấp lại mật khẩu mới</p>
          </div>

          {message && (
            <div
              className={`text-sm text-center mb-6 p-3 rounded-xl border ${
                status === 'error'
                  ? 'bg-red-50 dark:bg-red-500/10 text-red-600 border-red-200 dark:border-red-500/30'
                  : 'bg-primary-50 text-primary-600 border-primary-200 dark:bg-primary-500/10 dark:text-primary-400 dark:border-primary-500/30'
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <TextField
              bgTheme="card"
              label="Email đăng ký"
              icon={RiMailFill}
              type="email"
              required
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button type="submit" intent="primary" disabled={loading} className="w-full mt-2">
              {loading ? 'Đang xử lý...' : 'Lấy mật khẩu mới'}
            </Button>
          </form>
        </GlassCard>
      </motion.div>
    </PageLayout>
  );
}
