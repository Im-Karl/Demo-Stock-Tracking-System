import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RiLockPasswordFill, RiShieldCheckFill } from 'react-icons/ri';
import { authService } from '../../services/authService';
import Button from '../base-ui/Button';
import PageLayout from '../base-ui/PageLayout';
import GlassCard from '../base-ui/GlassCard';
import TextField from '../base-ui/TextField';

export default function ResetPasswordForm() {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Lấy token từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const t = urlParams.get('token');
    if (t) {
      setToken(t);
    } else {
      setStatus('error');
      setMessage('Đường dẫn không hợp lệ hoặc thiếu mã xác thực.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setStatus('error');
      setMessage('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    setStatus('loading');
    setMessage('');

    try {
      await authService.resetPassword({ token, newPassword });
      setStatus('success');
      setMessage('Mật khẩu của bạn đã được thay đổi thành công! Hãy đăng nhập bằng mật khẩu mới.');
    } catch (err) {
      setStatus('error');
      setMessage(
        err.response?.data?.message || err.response?.data?.error || 'Đã có lỗi xảy ra. Vui lòng yêu cầu cấp lại mã mới.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <PageLayout className="flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md mx-auto">
          <GlassCard className="text-center">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              <RiShieldCheckFill size={32} />
            </div>
            <h2 className="text-2xl font-bold font-heading text-emerald-600 dark:text-emerald-400 mb-2">
              Thành công!
            </h2>
            <p className="text-grey-600 dark:text-grey-300 mb-6">{message}</p>
            <Button render={<a href="/login" />} intent="primary" className="w-full">
              Đăng nhập ngay
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
        transition={{ duration: 0.6 }}
        className="w-full max-w-md mx-auto"
      >
        <GlassCard>
          <div className="text-center mb-8">
            <h2 className="text-3xl text-primary-600 dark:text-primary-400 font-extrabold mb-2 font-heading">
              Đặt lại mật khẩu
            </h2>
            <p className="text-grey-600 dark:text-grey-400 text-sm">Vui lòng nhập mật khẩu mới cho tài khoản của bạn</p>
          </div>

          {message && (
            <div
              className={`text-sm text-center mb-6 p-4 rounded-xl border ${
                status === 'error'
                  ? 'bg-red-50 dark:bg-red-500/10 text-red-600 border-red-200 dark:border-red-500/30'
                  : 'bg-primary-50 text-primary-600 border-primary-200 dark:bg-primary-500/10 dark:text-primary-400 dark:border-primary-500/30'
              }`}
            >
              {message}
            </div>
          )}

          {!token && status === 'error' ? (
             <Button render={<a href="/forgot-password" />} intent="neutral" className="w-full">
                Quay lại trang Quên mật khẩu
             </Button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <TextField
                bgTheme="card"
                label="Mật khẩu mới"
                icon={RiLockPasswordFill}
                type="password"
                required
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <TextField
                bgTheme="card"
                label="Xác nhận mật khẩu"
                icon={RiLockPasswordFill}
                type="password"
                required
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <Button type="submit" intent="primary" disabled={loading || !token} className="w-full mt-2">
                {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
              </Button>
            </form>
          )}
        </GlassCard>
      </motion.div>
    </PageLayout>
  );
}
