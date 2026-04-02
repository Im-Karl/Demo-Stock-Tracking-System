import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { authService } from "../../services/authService";
import { toast } from "react-hot-toast";

export default function FollowModal({ isOpen, onClose, authorId, type }) {
  // State chứa danh sách người dùng sẽ render ra UI
  const [userList, setUserList] = useState([]);

  // State chứa danh sách các ID mà BẠN (currentUser) đang follow
  const [myFollowing, setMyFollowing] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy thông tin user hiện tại (để check xem nút Follow hiện chữ gì)
  const currentUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null;

  useEffect(() => {
    // Chỉ gọi API khi Modal được bật lên VÀ có đủ dữ liệu đầu vào
    if (isOpen && authorId && type) {
      setLoading(true);
      setUserList([]); // Xóa danh sách cũ tránh chớp hình

      // 1. Quyết định xem mình đang cần gọi API lấy list nào (followers hay following)
      const fetchList =
        type === "followers"
          ? authService.getFollowers(authorId)
          : authService.getFollowing(authorId);

      // 2. Gom các API cần gọi vào một mảng để chạy song song (nhanh hơn)
      const fetchPromises = [fetchList];

      // Nếu đã đăng nhập, gọi thêm API lấy hồ sơ của chính mình để biết mình đang follow ai
      if (currentUser) {
        fetchPromises.push(authService.getProfile());
      }

      Promise.all(fetchPromises)
        .then((responses) => {
          const listData =
            type === "followers"
              ? responses[0].data.followers
              : responses[0].data.following;
          setUserList(listData);

          if (responses[1]) {
            const myFollowingIds = responses[1].data.following.map((id) =>
              String(id),
            );
            setMyFollowing(myFollowingIds);
          }
        })
        .catch(() => toast.error("Không thể tải danh sách"))
        .finally(() => setLoading(false));
    }
  }, [isOpen, authorId, type]);

  // Hàm xử lý khi bấm cái nút "Theo dõi" ở một hàng bất kỳ
  const handleFollowClick = async (targetUserId) => {
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để thực hiện chức năng này");
      return;
    }

    try {
      const res = await authService.toggleFollow(targetUserId);
      const targetIdStr = String(targetUserId);

      if (res.data.isFollowing) {
        setMyFollowing((prev) => [...prev, targetIdStr]);
        toast.success("Đã theo dõi!");
      } else {
        setMyFollowing((prev) => prev.filter((id) => id !== targetIdStr));
        toast.success("Đã hủy theo dõi");
      }
    } catch (err) {
      toast.error("Lỗi khi tương tác");
    }
  };

  if (!isOpen) return null;

  const modalTitle = type === "followers" ? "Người theo dõi" : "Đang theo dõi";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm transition-opacity">
      {/* Modal Container */}
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-200">
        {/* Header (Tiêu đề + Nút tắt) */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
            {modalTitle}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Body (Danh sách cuộn được) */}
        <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
          {loading ? (
            <div className="text-center py-10">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-slate-500 text-sm">Đang tải dữ liệu...</p>
            </div>
          ) : userList.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              Không có dữ liệu hiển thị.
            </div>
          ) : (
            <div className="flex flex-col">
              {userList.map((user) => {
                const myId = currentUser?._id || currentUser?.id;
                const rowUserId = user?._id || user?.id;
                const isMe = Boolean(
                  myId && rowUserId && String(myId) === String(rowUserId),
                );

                const amIFollowing = myFollowing.includes(String(user._id));

                return (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <a
                      href={`/author/${user._id}`}
                      className="flex items-center gap-3 flex-1 group"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center font-bold text-blue-700 dark:text-blue-400 text-lg shadow-inner">
                        {(user.displayName || user.username)
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[15px] text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {user.displayName || user.username}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          @{user.username}
                        </p>
                      </div>
                    </a>

                    {/* Nút Follow hiển thị động (Ẩn nếu đó là chính mình) */}
                    {!isMe && (
                      <button
                        onClick={() => handleFollowClick(user._id)}
                        className={`ml-4 px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200 active:scale-95 border
                                  ${
                                    amIFollowing
                                      ? // Đã follow -> Style Xám nhạt
                                        "bg-slate-100 border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:text-red-400 dark:hover:bg-red-500/10 dark:hover:border-red-500/30"
                                      : // Chưa follow -> Style Xanh nổi bật
                                        "bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 shadow-sm"
                                  }`}
                      >
                        {amIFollowing ? "Đang theo dõi" : "Theo dõi"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
