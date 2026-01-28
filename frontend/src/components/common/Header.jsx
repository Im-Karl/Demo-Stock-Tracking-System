import React, { useEffect, useState } from "react";

export default function Header() {
  const [user, setUser] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setIsMounted(true);
    setCurrentPath(window.location.pathname);

    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Lỗi parse user", e);
      }
    }
  }, []);

  const getLinkClass = (path, exact = false) => {
    const isActive = exact
      ? currentPath === path
      : currentPath.startsWith(path);

    const base =
      "px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200";

    const active =
      "text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow-md";

    const inactive =
      "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10";

    return `${base} ${isActive ? active : inactive}`;
  };

  if (!isMounted)
    return (
      <header className="h-16 bg-slate-50 dark:bg-[#020617] border-b border-slate-200 dark:border-white/5"></header>
    );

  return (
    <header className="sticky top-0 z-50">
      {/* Background glass */}
      <div
        className="absolute inset-0
                   bg-white/70 dark:bg-[#020617]/80
                   backdrop-blur-xl
                   border-b border-slate-200 dark:border-white/10"
      ></div>

      {/* Ambient light */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 right-0 w-72 h-72 bg-blue-500/20 blur-[100px]" />
        <div className="absolute -top-20 left-0 w-72 h-72 bg-violet-500/20 blur-[100px]" />
      </div>

      <div className="relative container mx-auto px-6 h-16 flex items-center justify-between">
        {/* LOGO */}
        <a
          href="/"
          className="text-2xl font-extrabold tracking-tight
                     text-transparent bg-clip-text
                     bg-gradient-to-r from-blue-600 to-violet-600
                     dark:from-blue-400 dark:to-violet-400"
        >
          StockBank
        </a>

        {/* MENU – chỉ khi login */}
        {user && (
          <nav className="hidden md:flex items-center gap-2">
            <a href="/stock" className={getLinkClass("/stock")}>
              Thị trường
            </a>
            <a href="/news" className={getLinkClass("/news")}>
              Tin tức 24h
            </a>
            <a href="/blog" className={getLinkClass("/blog")}>
              Cộng đồng
            </a>
          </nav>
        )}

        {/* USER AREA */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <a
                href="/profile"
                className="hidden sm:block text-sm
                           text-slate-600 dark:text-slate-300
                           hover:text-slate-900 dark:hover:text-white
                           transition"
              >
                Hi, <b>{user.displayName || user.username}</b>
              </a>

              <a
                href="/blog/create"
                className="px-4 py-2 rounded-lg text-sm font-bold
                           bg-gradient-to-r from-emerald-500 to-teal-500
                           text-white shadow-lg shadow-emerald-500/30
                           hover:scale-105 transition-all"
              >
                Viết bài
              </a>
            </>
          ) : (
            <div className="flex gap-2">
              <a href="/login" className={getLinkClass("/login", true)}>
                Đăng nhập
              </a>
              <a href="/register" className={getLinkClass("/register", true)}>
                Đăng ký
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
