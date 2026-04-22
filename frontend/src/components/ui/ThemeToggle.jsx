import React, { useEffect, useState } from 'react';
import { RiSunFill, RiMoonFill } from 'react-icons/ri';
import Switch from '../base-ui/Switch';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const handleCheckedChange = (checked) => {
    const newTheme = checked ? 'dark' : 'light';
    setTheme(newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', newTheme);
  };

  if (!mounted) return <div className="w-[52px] h-8"></div>;

  const isDark = theme === 'dark';

  return (
    <Switch
      checked={isDark}
      onCheckedChange={handleCheckedChange}
      uncheckedIcon={<RiSunFill />}
      checkedIcon={<RiMoonFill />}
      aria-label="Toggle theme"
    />
  );
}
