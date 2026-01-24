import React, { useState } from 'react';

export default function AuthForm({ type }) { // type = 'login' hoặc 'register'
  const isLogin = type === 'login';
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? 'http://localhost:3000/api/login' : 'http://localhost:3000/api/register';
    
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          // QUAN TRỌNG: Lưu token vào trình duyệt
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          alert("Đăng nhập thành công!");
          window.location.href = '/'; // Về trang chủ
        } else {
          alert("Đăng ký thành công! Hãy đăng nhập.");
          window.location.href = '/login';
        }
      } else {
        alert(data.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? "Đăng Nhập" : "Đăng Ký"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Tên đăng nhập</label>
          <input 
            type="text" required 
            className="w-full p-2 border rounded"
            onChange={e => setFormData({...formData, username: e.target.value})}
          />
        </div>
        
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input 
              type="email" required 
              className="w-full p-2 border rounded"
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">Mật khẩu</label>
          <input 
            type="password" required 
            className="w-full p-2 border rounded"
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {isLogin ? "Đăng Nhập" : "Đăng Ký"}
        </button>
      </form>
    </div>
  );
}