import React, { useState, useEffect } from "react";
import { Users, Heart, FileText, UserPlus } from "lucide-react";
import { toast } from "react-hot-toast";
import { authService } from "../../services/authService";
import FollowModal from "./FollowModal";

export default function AuthorPage({ author, blogs = [], stats }) {
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null });
  const [followingCount, setFollowingCount] = useState(
    author?.following?.length || 0,
  );

  const openModal = (type) => {
    setModalConfig({ isOpen: true, type: type });
  };

  const currentUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null;

  const isOwnProfile = Boolean(
    currentUser &&
    author &&
    (String(currentUser._id) === String(author._id) ||
      String(currentUser.id) === String(author._id)),
  );

  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!currentUser || !author?._id) return;

    const checkFollow = async () => {
      try {
        const res = await authService.getAuthorProfile(author._id);
        setIsFollowing(res.data.isFollowing);
      } catch (err) {
        console.error(err);
      }
    };

    checkFollow();
  }, [author, currentUser]);

  const [followerCount, setFollowerCount] = useState(
    author?.followers?.length || 0,
  );

  const [loadingFollow, setLoadingFollow] = useState(false);

  const handleFollow = async () => {
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để theo dõi tác giả!");
      window.location.href = "/login";
      return;
    }

    try {
      setLoadingFollow(true);

      const res = await authService.toggleFollow(author._id);

      const newStatus = res.data.isFollowing;

      setIsFollowing(newStatus);
      setFollowerCount((prev) => (newStatus ? prev + 1 : prev - 1));

      toast.success(newStatus ? "Đã theo dõi!" : "Đã hủy theo dõi");
    } catch (err) {
      toast.error("Lỗi khi theo dõi");
    } finally {
      setLoadingFollow(false);
    }
  };

  return (
    <section className="relative min-h-screen bg-neutral-50 dark:bg-neutral-900 text-slate-800 dark:text-slate-100">
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {author && (
          <div className="text-center mb-14 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-3xl p-10 shadow-lg">
            {/* Avatar */}
            <div className="mx-auto mb-4 w-28 h-28 rounded-full bg-gradient-to-tr from-blue-500 to-violet-500 flex items-center justify-center text-white text-4xl font-extrabold shadow-xl">
              {(author.displayName || author.username)?.charAt(0).toUpperCase()}
            </div>

            {/* Name */}
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
              {author.displayName || author.username}
            </h1>

            {/* Tagline */}
            <p className="text-slate-500 italic mb-6">
              "{author.tagline || "Người đam mê viết lách"}"
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <div className="text-center">
                <FileText size={18} className="mx-auto mb-1 text-slate-400" />
                <div className="text-xl font-bold">{blogs.length}</div>
                <div className="text-xs text-slate-400">Bài viết</div>
              </div>

              <div
                className="text-center cursor-pointer hover:scale-105 transition transform"
                onClick={() => openModal("followers")}
              >
                <Users size={18} className="mx-auto mb-1 text-slate-400" />
                <div className="text-xl font-bold">{followerCount}</div>
                <div className="text-xs text-slate-400 hover:text-blue-500">
                  Người theo dõi
                </div>
              </div>

              <div
                className="text-center cursor-pointer hover:scale-105 transition transform"
                onClick={() => openModal("following")}
              >
                <UserPlus size={18} className="mx-auto mb-1 text-slate-400" />
                <div className="text-xl font-bold">{followingCount}</div>
                <div className="text-xs text-slate-400 hover:text-blue-500">
                  Đang theo dõi
                </div>
              </div>

              <div className="text-center">
                <Heart size={18} className="mx-auto mb-1 text-slate-400" />
                <div className="text-xl font-bold">
                  {stats?.totalLikes || 0}
                </div>
                <div className="text-xs text-slate-400">Lượt thích</div>
              </div>
            </div>

            {/* Follow Button */}
            {!isOwnProfile && (
              <button
                onClick={handleFollow}
                disabled={loadingFollow}
                className={`px-8 py-3 rounded-full font-bold transition
                  ${
                    isFollowing
                      ? "bg-slate-300 dark:bg-slate-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                {isFollowing ? "Đang theo dõi" : "Theo dõi"}
              </button>
            )}
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <a key={blog.slug} href={`/blog/${blog.slug}`}>
              <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 shadow-lg hover:shadow-2xl transition">
                <h2 className="text-xl font-bold mb-3 line-clamp-2">
                  {blog.title}
                </h2>
                <span className="text-xs text-slate-500">
                  {blog.publishedDate
                    ? new Date(blog.publishedDate).toLocaleDateString("vi-VN")
                    : "Nháp"}
                </span>
              </div>
            </a>
          ))}
        </div>
      </main>

      <FollowModal
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        onClose={() => setModalConfig({ isOpen: false, type: null })}
        authorId={author?._id}
      />
    </section>
  );
}
