import React, { useEffect, useState } from 'react';
import { authService } from '../../services/authService';
import { toast } from 'react-hot-toast';
import Modal from '../base-ui/Modal';
import Avatar from '../base-ui/Avatar';
import Button from '../base-ui/Button';

export default function FollowModal({ isOpen, onClose, authorId, type }) {
  const [userList, setUserList] = useState([]);
  const [myFollowing, setMyFollowing] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;

  useEffect(() => {
    if (isOpen && authorId && type) {
      setLoading(true);
      setUserList([]);

      const fetchList = type === 'followers' ? authService.getFollowers(authorId) : authService.getFollowing(authorId);

      const fetchPromises = [fetchList];

      if (currentUser) {
        fetchPromises.push(authService.getProfile());
      }

      Promise.all(fetchPromises)
        .then((responses) => {
          const listData = type === 'followers' ? responses[0].data.followers : responses[0].data.following;
          setUserList(listData);

          if (responses[1]) {
            const myFollowingIds = responses[1].data.following.map((id) => String(id));
            setMyFollowing(myFollowingIds);
          }
        })
        .catch(() => toast.error('Không thể tải danh sách'))
        .finally(() => setLoading(false));
    }
  }, [isOpen, authorId, type]);

  const handleFollowClick = async (targetUserId) => {
    if (!currentUser) {
      toast.error('Vui lòng đăng nhập để thực hiện chức năng này');
      return;
    }

    try {
      const res = await authService.toggleFollow(targetUserId);
      const targetIdStr = String(targetUserId);

      if (res.data.isFollowing) {
        setMyFollowing((prev) => [...prev, targetIdStr]);
        toast.success('Đã theo dõi!');
      } else {
        setMyFollowing((prev) => prev.filter((id) => id !== targetIdStr));
        toast.success('Đã hủy theo dõi');
      }
    } catch (err) {
      toast.error('Lỗi khi tương tác');
    }
  };


  const modalTitle = type === 'followers' ? 'Người theo dõi' : 'Đang theo dõi';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} maxWidth="max-w-md">
      <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
        {loading ? (
          <div className="text-center py-10">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-grey-500 text-sm">Đang tải dữ liệu...</p>
          </div>
        ) : userList.length === 0 ? (
          <div className="text-center py-12 text-grey-500 text-sm">Không có dữ liệu hiển thị.</div>
        ) : (
          <div className="flex flex-col">
            {userList.map((user) => {
              const myId = currentUser?._id || currentUser?.id;
              const rowUserId = user?._id || user?.id;
              const isMe = Boolean(myId && rowUserId && String(myId) === String(rowUserId));

              const amIFollowing = myFollowing.includes(String(user._id));

              return (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-grey-50 dark:hover:bg-grey-800/50 transition-colors"
                >
                  <a href={`/author/${user._id}`} className="flex items-center gap-3 flex-1 group">
                    <Avatar
                      src={user.avatar}
                      alt={user.displayName || user.username}
                      size="lg"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[15px] text-grey-900 dark:text-grey-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                        {user.displayName || user.username}
                      </h4>
                      <p className="text-xs text-grey-500 dark:text-grey-400 truncate">@{user.username}</p>
                    </div>
                  </a>

                  {!isMe && (
                    <Button
                      onClick={() => handleFollowClick(user._id)}
                      size="sm"
                      intent={amIFollowing ? 'neutral' : 'primary'}
                      className="ml-4"
                    >
                      {amIFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
