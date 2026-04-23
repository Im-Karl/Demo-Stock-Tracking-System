import React, { useState, useEffect } from 'react';
import {
  RiGroupFill,
  RiHeartFill,
  RiFileTextFill,
  RiUserAddFill,
  RiSearchLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCheckFill,
} from 'react-icons/ri';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService';
import FollowModal from './FollowModal';
import BlogCard from '../blog/BlogCard';
import Button from '../base-ui/Button';
import Avatar from '../base-ui/Avatar';
import TextField from '../base-ui/TextField';

import FeatureCard from '../base-ui/FeatureCard';

export default function AuthorPage({ author, blogs = [], stats, initialTotalPages = 1, initialCurrentPage = 1 }) {
  const [isMounted, setIsMounted] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null });
  const [followingCount, setFollowingCount] = useState(author?.following?.length || 0);

  const [displayBlogs, setDisplayBlogs] = useState(blogs);
  const [keyword, setKeyword] = useState('');

  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsMounted(true);
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
    <>
      <main className="relative min-h-screen pt-10 pb-20">
        <div className="relative container mx-auto px-4 max-w-5xl">
          {author && (
            <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-8 mb-14">
              {/* Left Side: Avatar, Name, Desc */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-center sm:text-left flex-1">
                <div className="shrink-0 flex justify-center sm:justify-start">
                  <Avatar
                    src={author.avatar}
                    alt={author.displayName || author.username}
                    className="w-20 h-20 *:text-2xl"
                  />
                </div>
                <div className="flex flex-col">
                  {/* Name and Desc are now exactly h-20 so they perfectly vertically center with the avatar */}
                  <div className="min-h-[5rem] flex flex-col justify-center">
                    <h1 className="text-2xl font-extrabold mb-1 text-grey-900 dark:text-grey-50">
                      {author.displayName || author.username}
                    </h1>
                    <p className="text-grey-500 dark:text-grey-400">{author.tagline || 'Người đam mê viết lách'}</p>
                  </div>

                  {isMounted && !isOwnProfile && (
                    <div className="flex justify-center sm:justify-start mt-4">
                      <Button
                        onClick={handleFollow}
                        disabled={loadingFollow}
                        intent={isFollowing ? 'neutral' : 'primary'}
                      >
                        {isFollowing ? (
                          <>
                            <RiCheckFill size={16} /> Đang theo dõi
                          </>
                        ) : (
                          <>
                            <RiUserAddFill size={16} /> Theo dõi
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Stats */}
              <div className="grid sm:grid-cols-2 gap-2 w-full lg:w-auto shrink-0 *:p-4 flex-1">
                <FeatureCard
                  direction="horizontal"
                  title={stats?.totalBlogs || displayBlogs.length}
                  desc="Bài viết"
                  icon={RiFileTextFill}
                  colorClass="text-grey-800 dark:text-grey-300 bg-primary-100 dark:bg-primary-900/50"
                />

                <FeatureCard
                  direction="horizontal"
                  title={followingCount}
                  desc="Đang theo dõi"
                  icon={RiUserAddFill}
                  colorClass="text-grey-800 dark:text-grey-300 bg-violet-100 dark:bg-violet-900/50"
                  onClick={() => openModal('following')}
                />

                <FeatureCard
                  direction="horizontal"
                  title={followerCount}
                  desc="Người theo dõi"
                  icon={RiGroupFill}
                  colorClass="text-grey-800 dark:text-grey-300 bg-emerald-100 dark:bg-emerald-900/50"
                  onClick={() => openModal('followers')}
                />

                <FeatureCard
                  direction="horizontal"
                  title={stats?.totalLikes || 0}
                  desc="Lượt thích"
                  icon={RiHeartFill}
                  colorClass="text-grey-800 dark:text-grey-300 bg-amber-100 dark:bg-amber-900/50"
                />
              </div>
            </div>
          )}

          <hr className="border-grey-200 dark:border-grey-800 mb-10" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
            <h2 className="text-2xl font-extrabold text-grey-900 dark:text-grey-50">
              Bài viết của {author?.displayName || 'tác giả'}
            </h2>
            <form onSubmit={handleSearchSubmit} className="w-full md:w-96">
              <TextField
                label="Tìm trong bài viết của tác giả..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                icon={RiSearchLine}
              />
            </form>
          </div>

          {isSearching ? (
            <div className="text-center py-20 text-grey-500">Đang tìm kiếm...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayBlogs.map((blog) => (
                  <BlogCard key={blog.slug} blog={blog} />
                ))}
              </div>

              {displayBlogs.length === 0 && (
                <div className="text-center py-16 text-grey-500 bg-grey-50 dark:bg-grey-900/30 rounded-sm border border-grey-200 dark:border-grey-800">
                  Không tìm thấy bài viết nào phù hợp.
                </div>
              )}

              {/*  THANH PHÂN TRANG */}
              {totalPages > 1 && (
                <nav className="flex items-center justify-center gap-2 mt-16" aria-label="Pagination">
                  <Button
                    intent="ghost"
                    size="sm"
                    disabled={currentPage <= 1}
                    className={currentPage <= 1 ? 'opacity-40 pointer-events-none' : ''}
                    onClick={() => fetchAuthorBlogs(keyword, currentPage - 1)}
                  >
                    <RiArrowLeftSLine size={18} /> Trước
                  </Button>
                  <span className="px-4 py-2 text-sm font-bold text-grey-700 dark:text-grey-300">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    intent="ghost"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    className={currentPage >= totalPages ? 'opacity-40 pointer-events-none' : ''}
                    onClick={() => fetchAuthorBlogs(keyword, currentPage + 1)}
                  >
                    Sau <RiArrowRightSLine size={18} />
                  </Button>
                </nav>
              )}
            </>
          )}
        </div>
      </main>

      <FollowModal
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        onClose={() => setModalConfig({ isOpen: false, type: null })}
        authorId={author?._id}
      />
    </>
  );
}
