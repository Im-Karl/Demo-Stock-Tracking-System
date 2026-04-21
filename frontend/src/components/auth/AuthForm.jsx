import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { authService } from '../../services/authService';
import { User, Mail, Lock } from 'lucide-react';
import Button from '../base-ui/Button';
import Input from '../base-ui/Input';
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
      console.log(err);
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
            <h2 className="text-3xl text-blue-600 dark:text-blue-400 font-extrabold mb-2">
              {isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              {isLogin ? 'Đăng nhập để tiếp tục theo dõi thị trường' : 'Tham gia cộng đồng đầu tư FinSavvy'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium mb-1 block">
                Tên đăng nhập
              </label>
              <Input icon={User} required onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
            </div>

            {!isLogin && (
              <div>
                <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium mb-1 block">Email</label>
                <Input
                  icon={Mail}
                  type="email"
                  required
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            )}

            <div>
              <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium mb-1 block">Mật khẩu</label>
              <Input
                icon={Lock}
                type="password"
                required
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {isLogin && (
              <div className="text-right">
                <a href="/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  Quên mật khẩu?
                </a>
              </div>
            )}

            <Button type="submit" intent="primary" className="w-full">
              {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
            </Button>
          </form>
        </GlassCard>
      </motion.div>
    </PageLayout>
  );
}
