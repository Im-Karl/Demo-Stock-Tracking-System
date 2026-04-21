import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import Button from '../base-ui/Button';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('theme', newTheme);
  };

  if (!theme) return <div className="w-10 h-10"></div>;

  return (
    <Button onClick={toggleTheme} className="px-2!">
      {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
    </Button>
  );
}
