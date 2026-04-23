import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService';
import { RiUserFill, RiMailFill, RiLockFill } from 'react-icons/ri';
import Button from '../base-ui/Button';
import TextField from '../base-ui/TextField';
import PageLayout from '../base-ui/PageLayout';
import GlassCard from '../base-ui/GlassCard';

export default function AuthForm({ type }) {
  const isLogin = type === 'login';

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = isLogin ? await authService.login(formData) : await authService.register(formData);

      const data = res.data;

      if (isLogin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/';
      } else {
        window.location.href = '/login';
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Đã có lỗi xảy ra vui lòng thử lại!');
    }
  };



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
              {isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
            </h2>
            <p className="text-grey-600 dark:text-grey-400 text-sm">
              {isLogin ? 'Đăng nhập để tiếp tục theo dõi thị trường' : 'Tham gia cộng đồng đầu tư FinSavvy'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <TextField bgTheme="card" label="Tên đăng nhập" icon={RiUserFill} required onChange={(e) => setFormData({ ...formData, username: e.target.value })} />

            {!isLogin && (
              <TextField
                bgTheme="card"
                label="Email"
                icon={RiMailFill}
                type="email"
                required
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            )}

            <TextField
              bgTheme="card"
              label="Mật khẩu"
              icon={RiLockFill}
              type="password"
              required
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            {isLogin && (
              <div className="text-right">
                <a href="/forgot-password" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                  Quên mật khẩu?
                </a>
              </div>
            )}

            <Button type="submit" intent="primary" className="w-full mt-2">
              {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-grey-600 dark:text-grey-400">
            {isLogin ? (
              <>
                Chưa có tài khoản?{' '}
                <a href="/register" className="text-primary-600 dark:text-primary-400 hover:underline font-bold">
                  Đăng ký ngay
                </a>
              </>
            ) : (
              <>
                Đã có tài khoản?{' '}
                <a href="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-bold">
                  Đăng nhập
                </a>
              </>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </PageLayout>
  );
}
