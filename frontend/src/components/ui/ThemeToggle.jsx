import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  // Khi Component mount, đọc trạng thái theme hiện tại (đã được script ở Astro Layout set)
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Cập nhật class trên thẻ HTML
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Lưu vào Local Storage
    localStorage.setItem('theme', newTheme);
  };

  // Tránh lỗi hydration mismatch (giao diện server khác client)
  // Chỉ render icon khi component đã mount xong trên trình duyệt
  if (!theme) return <div className="w-9 h-9"></div>;

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full 
                 bg-slate-100 dark:bg-slate-800 
                 text-slate-600 dark:text-slate-300 
                 hover:bg-slate-200 dark:hover:bg-slate-700 
                 transition-colors cursor-pointer"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}