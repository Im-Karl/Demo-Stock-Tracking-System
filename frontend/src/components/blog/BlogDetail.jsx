import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Skeleton } from '../ui/Skeleton';

export default function BlogDetail({ slug }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null); // Lưu user đang đăng nhập
  const [isUpdating, setIsUpdating] = useState(false); // Loading khi bấm nút đổi

  useEffect(() => {
    // 1. Lấy thông tin người dùng đang đăng nhập
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }

    // 2. Fetch bài viết
    fetch(`http://localhost:3000/api/blogs/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        setBlog(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  // Hàm xử lý đổi trạng thái Public/Private
  const handleTogglePublic = async () => {
    if (!currentUser) return;
    setIsUpdating(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:3000/api/blogs/${slug}/toggle-public`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`, // Gửi token để xác thực
          'Content-Type': 'application/json'
        }
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Cập nhật lại giao diện ngay lập tức
        setBlog(prev => ({ ...prev, isPublic: data.isPublic }));
        alert(data.message);
      } else {
        alert(data.message || "Lỗi khi cập nhật");
      }
    } catch (error) {
      alert("Lỗi kết nối: " + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return (
    <div className="p-10 max-w-3xl mx-auto">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-64 w-full" />
    </div>
  );
  
  if (!blog) return <div className="text-center py-10">Bài viết không tồn tại.</div>;

  // Kiểm tra xem người xem có phải là tác giả không
  // Lưu ý: blog.author giờ là String (tên username)
  const isAuthor = currentUser && blog.author && (currentUser.username === blog.author.username);

  return (
    <article className="max-w-3xl mx-auto py-10 px-4 bg-white shadow-sm mt-4 rounded-lg relative">
      
      {/* --- PHẦN ĐIỀU KHIỂN DÀNH CHO TÁC GIẢ --- */}
      {isAuthor && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-center">
          <div>
            <span className="font-bold text-blue-800">🛠 Quản lý bài viết:</span>
            <span className={`ml-2 text-sm font-medium px-2 py-1 rounded ${blog.isPublic ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
              {blog.isPublic ? 'Đang Công Khai 🌍' : 'Đang Riêng Tư 🔒'}
            </span>
          </div>
          
          <button 
            onClick={handleTogglePublic}
            disabled={isUpdating}
            className={`cursor-pointer px-4 py-2 rounded text-sm font-bold text-white transition
              ${blog.isPublic 
                ? 'bg-yellow-500 hover:bg-yellow-600'  
                : 'bg-green-600 hover:bg-green-700'   
              } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isUpdating ? 'Đang xử lý...' : (blog.isPublic ? '🔒 Chuyển thành Riêng tư' : '🌍 Công khai ngay')}
          </button>
        </div>
      )}
      {/* ----------------------------------------- */}

      <header className="mb-8 text-center border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">{blog.title}</h1>
        <div className="text-gray-500 text-sm">
          Đăng bởi:  
<span className="font-semibold text-blue-600">
            {blog.author?.displayName || blog.author?.username || "Ẩn danh"}
          </span>          
          {' • '} 
          {blog.publishedDate ? new Date(blog.publishedDate).toLocaleDateString('vi-VN') : 'Chưa xuất bản'}
        </div>
      </header>
      
      <div className="prose prose-lg prose-blue mx-auto">
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </div>
    </article>
  );
}