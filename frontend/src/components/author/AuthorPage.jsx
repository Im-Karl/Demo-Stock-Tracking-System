import React, { useState, useEffect } from 'react';
import { Users, Heart, FileText, UserPlus, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService';
import FollowModal from './FollowModal';
import BlogCard from '../blog/BlogCard';
import PageLayout from '../base-ui/PageLayout';
import GlassCard from '../base-ui/GlassCard';
import Button from '../base-ui/Button';

export default function AuthorPage({ author, blogs = [], stats, initialTotalPages = 1, initialCurrentPage = 1 }) {
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null });
  const [followingCount, setFollowingCount] = useState(author?.following?.length || 0);

  const [displayBlogs, setDisplayBlogs] = useState(blogs);
  const [keyword, setKeyword] = useState('');

  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setDisplayBlogs(blogs);
    setTotalPages(initialTotalPages);
    setCurrentPage(initialCurrentPage);
  }, [blogs, initialTotalPages, initialCurrentPage]);

  const openModal = (type) => setModalConfig({ isOpen: true, type: type });
  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;
  const isOwnProfile = Boolean(
    currentUser &&
    author &&
    (String(currentUser._id) === String(author._id) || String(currentUser.id) === String(author._id)),
  );
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(author?.followers?.length || 0);
  const [loadingFollow, setLoadingFollow] = useState(false);

  useEffect(() => {
    if (!currentUser || !author?._id) return;
    authService
      .getAuthorProfile(author._id)
      .then((res) => setIsFollowing(res.data.isFollowing))
      .catch(console.error);
  }, [author, currentUser]);

  const handleFollow = async () => {
    if (!currentUser) return toast.error('Vui lòng đăng nhập!');
    try {
      setLoadingFollow(true);
      const res = await authService.toggleFollow(author._id);
      setIsFollowing(res.data.isFollowing);
      setFollowerCount((prev) => (res.data.isFollowing ? prev + 1 : prev - 1));
      toast.success(res.data.isFollowing ? 'Đã theo dõi!' : 'Đã hủy theo dõi');
    } catch (err) {
      toast.error('Lỗi khi theo dõi');
    } finally {
      setLoadingFollow(false);
    }
  };

  const fetchAuthorBlogs = async (searchKw, pageNum) => {
    setIsSearching(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/blogs/author/${author._id}?keyword=${encodeURIComponent(searchKw)}&page=${pageNum}&limit=6`,
      );
      const data = await res.json();
      setDisplayBlogs(data.blogs);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);

      // Cuộn lên chỗ danh sách bài viết cho mượt
      window.scrollTo({ top: 500, behavior: 'smooth' });
    } catch (err) {
      toast.error('Lỗi tải danh sách bài viết');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAuthorBlogs(keyword, 1);
  };

  return (
    <PageLayout showAmbient={false}>
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {author && (
          <GlassCard padding="xl" className="text-center mb-14">
            <div className="mx-auto mb-4 w-28 h-28 rounded-full overflow-hidden shadow-xl border-4 border-white dark:border-neutral-800 bg-neutral-200 flex items-center justify-center">
              {author.avatar ? (
                <img src={author.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-blue-500 to-violet-500 flex items-center justify-center text-white text-4xl font-extrabold">
                  {(author.displayName || author.username)?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-neutral-900 dark:text-white">
              {author.displayName || author.username}
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 italic mb-6">
              "{author.tagline || 'Người đam mê viết lách'}"
            </p>

            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <div className="text-center">
                <FileText size={18} className="mx-auto mb-1 text-neutral-400" />
                {/* Lấy tổng bài trên DB chứ không phải số bài đang hiển thị */}
                <div className="text-xl font-bold">{stats?.totalBlogs || displayBlogs.length}</div>
                <div className="text-xs text-neutral-400">Bài viết</div>
              </div>
              <div
                className="text-center cursor-pointer hover:scale-105 transition transform group"
                onClick={() => openModal('followers')}
              >
                <Users size={18} className="mx-auto mb-1 text-neutral-400 group-hover:text-blue-500" />
                <div className="text-xl font-bold">{followerCount}</div>
                <div className="text-xs text-neutral-400 group-hover:text-blue-500">Người theo dõi</div>
              </div>
              <div
                className="text-center cursor-pointer hover:scale-105 transition transform group"
                onClick={() => openModal('following')}
              >
                <UserPlus size={18} className="mx-auto mb-1 text-neutral-400 group-hover:text-violet-500" />
                <div className="text-xl font-bold">{followingCount}</div>
                <div className="text-xs text-neutral-400 group-hover:text-violet-500">Đang theo dõi</div>
              </div>
              <div className="text-center">
                <Heart size={18} className="mx-auto mb-1 text-neutral-400" />
                <div className="text-xl font-bold">{stats?.totalLikes || 0}</div>
                <div className="text-xs text-neutral-400">Lượt thích</div>
              </div>
            </div>

            {!isOwnProfile && (
              <div className="flex justify-center">
                <Button
                  onClick={handleFollow}
                  disabled={loadingFollow}
                  intent={isFollowing ? 'neutral' : 'primary'}
                  className="!rounded-full px-8"
                >
                  {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                </Button>
              </div>
            )}
          </GlassCard>
        )}

        <hr className="border-neutral-200 dark:border-neutral-800 mb-10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Bài viết của {author?.displayName || 'tác giả'}
          </h2>
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96 group">
            <input
              type="text"
              placeholder="Tìm trong bài viết của tác giả..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full py-3 pl-5 pr-12 rounded-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-neutral-900 dark:text-neutral-100 transition-all text-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-neutral-400 group-hover:text-blue-500 transition-colors"
            >
              <Search size={18} />
            </button>
          </form>
        </div>

        {isSearching ? (
          <div className="text-center py-20 text-neutral-500">Đang tìm kiếm...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayBlogs.map((blog) => (
                <BlogCard key={blog.slug} blog={blog} />
              ))}
            </div>

            {displayBlogs.length === 0 && (
              <div className="text-center py-16 text-neutral-500 bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                Không tìm thấy bài viết nào phù hợp.
              </div>
            )}

            {/*  THANH PHÂN TRANG */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-16">
                <Button
                  intent="neutral"
                  disabled={currentPage <= 1}
                  onClick={() => fetchAuthorBlogs(keyword, currentPage - 1)}
                >
                  Trang trước
                </Button>
                <span className="font-bold text-neutral-700 dark:text-neutral-300">
                  Trang {currentPage} / {totalPages}
                </span>
                <Button
                  intent="neutral"
                  disabled={currentPage >= totalPages}
                  onClick={() => fetchAuthorBlogs(keyword, currentPage + 1)}
                >
                  Trang sau
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <FollowModal
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        onClose={() => setModalConfig({ isOpen: false, type: null })}
        authorId={author?._id}
      />
    </PageLayout>
  );
}
