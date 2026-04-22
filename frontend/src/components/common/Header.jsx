import React, { useState } from 'react';
import Button from '../base-ui/Button';
import Tab from '../base-ui/Tab';
import ThemeToggle from '../ui/ThemeToggle';

function getUserFromStorage() {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error('Lỗi parse user', e);
    return null;
  }
}

export default function Header() {
  const [user, setUser] = useState(getUserFromStorage);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-grey-900 shadow-md">
      <div className="relative px-4 h-16 flex items-center">
        <a href="/" className="flex items-center gap-2">
          {/* 1. Mobile */}
          <img
            src="/images/fin_savvy.svg"
            alt="Fin Savvy Icon"
            width={32}
            height={32}
            className="block sm:hidden size-12"
          />

          {/* 2. Desktop/Tablet */}
          <img
            src="/images/fin_savvy_full.svg"
            alt="Fin Savvy Logo"
            width={140}
            height={36}
            className="hidden sm:block w-36 h-9"
          />
        </a>

        {/* MENU – chỉ khi login */}
        {user && (
          <nav className="absolute left-1/2 -translate-x-1/2 hidden lg:flex gap-4 h-full items-center">
            <Tab href="/stock">Thị trường</Tab>
            <Tab href="/news">Tin tức</Tab>
            <Tab href="/blog">Cộng đồng</Tab>
          </nav>
        )}

        {/* USER AREA */}
        <div className="flex items-center gap-3 ml-auto">
          {user ? (
            <>
              <Button render={<a href="/blog/manage" />} intent="primary">
                Bài viết
              </Button>
              <a href="/profile">
                <img
                  src={user.avatar}
                  width={40}
                  height={40}
                  className="border border-grey-200 dark:border-grey-700 object-cover size-10 rounded-full"
                />
              </a>
            </>
          ) : (
            <div className="flex gap-2">
              <Button render={<a href="/login" />} intent="ghost">
                Đăng nhập
              </Button>
              <Button render={<a href="/register" />} intent="primary">
                Đăng ký
              </Button>
            </div>
          )}
          {/* <div className="border-r border-neutral-300 dark:border-neutral-700 h-8"></div> */}
          <ThemeToggle client:load />
        </div>
      </div>
    </header>
  );
}
