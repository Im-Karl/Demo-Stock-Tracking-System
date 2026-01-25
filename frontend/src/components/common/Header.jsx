import React, { useEffect, useState } from 'react';

export default function Header() {
  const [user, setUser] = useState(null);
  const [isMounted, setIsMounted] = useState(false); // Dùng để tránh lỗi hydrate
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setIsMounted(true);
    setCurrentPath(window.location.pathname);
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            setUser(JSON.parse(userStr));
        } catch (e) {
            console.error("Lỗi parse user", e);
        }
    }
  }, []);

  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('user');
  //   window.location.href = '/login';
  // };

  const getLinkClass = (path) => {
    const isActive = 
        path === '/' ? currentPath === '/' : currentPath.startsWith(path);

    const baseClass = "px-3 py-2 rounded-lg transition-all duration-200";
    const activeClass = "text-blue-700 font-bold bg-blue-50"; // Style khi đang chọn
    const inactiveClass = "text-gray-600 font-medium hover:text-blue-600 hover:bg-gray-50"; 

    return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
  };

  // Nếu chưa load xong client thì render khung rỗng để tránh lệch layout
  if (!isMounted) return <header className="h-16 bg-white border-b"></header>;

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href={user ? "/" : "/login"} className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          📊 StockBank
        </a>

        {/* --- CHỈ HIỆN MENU NẾU ĐÃ ĐĂNG NHẬP --- */}
        {user && (
            <nav className="hidden md:flex items-center gap-2">
                <a href="/" className={getLinkClass('/')}>
                    Thị trường
                </a>
                <a href="/news" className={getLinkClass('/news')}>
                    Tin tức 24h
                </a>
                <a href="/blog" className={getLinkClass('/blog')}>
                    Cộng đồng
                </a>
            </nav>
        )}
        {/* -------------------------------------- */}

        {/* Khu vực User */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <a href="/profile" className="text-sm hidden sm:block text-gray-700 hover:text-blue-600 transition">
    Hi, <b>{user.displayName || user.username}</b>
</a>
              {/* Nút Viết bài chỉ hiện khi đã đăng nhập (đương nhiên) */}
              <a 
                href="/blog/create" 
                className="bg-green-600 text-white px-3 py-1.5 rounded text-sm font-bold hover:bg-green-700 transition"
              >
                Viết bài
              </a>
              
              {/* <button 
                onClick={handleLogout}
                className="text-red-500 text-sm font-semibold hover:bg-red-50 px-3 py-1.5 rounded transition"
              >
                Thoát
              </button> */}
            </>
          ) : (
            <div className="flex gap-3">
              <a href="/login" className={getLinkClass('/login')}>Đăng nhập</a>
              <a href="/register" className={getLinkClass('/register') + ""}>
                Đăng ký
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}