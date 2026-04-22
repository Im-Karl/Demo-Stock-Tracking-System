import React, { useState, useEffect, useMemo, useRef } from 'react';
import { commentService } from '../../services/commentService';
import { toast } from 'react-hot-toast';
import { formatTimeAgo } from '../utils/timeFormat';
import { RiMessage2Fill, RiReplyFill, RiDeleteBinFill, RiCornerDownRightFill, RiSendPlaneFill, RiArrowDownSFill, RiArrowUpSFill, RiArrowUpDownFill } from 'react-icons/ri';
import Button from '../base-ui/Button';

export default function CommentSection({ blogId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [sortOrder, setSortOrder] = useState('desc'); // desc: Mới nhất, asc: Cũ nhất
  const [visibleRoots, setVisibleRoots] = useState(5); // Chỉ hiện 5 comment gốc ban đầu

  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;

  // ================= FETCH =================
  const fetchComments = async () => {
    try {
      const res = await commentService.getCommentsByBlog(blogId);
      setComments(res.data.comments);
    } catch (err) {
      console.error('Lỗi lấy comment:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (blogId) fetchComments();
  }, [blogId]);

  // ================= GROUP COMMENTS =================
  const { rootComments, repliesMap } = useMemo(() => {
    const roots = [];
    const map = {};

    comments.forEach((c) => {
      if (!c.parentComment) {
        roots.push(c);
      } else {
        if (!map[c.parentComment]) map[c.parentComment] = [];
        map[c.parentComment].push(c);
      }
    });

    // Đảo reply: cũ lên trên (theo chuẩn chung của reply)
    Object.keys(map).forEach((key) => {
      map[key].reverse();
    });

    return { rootComments: roots, repliesMap: map };
  }, [comments]);

  // Lọc và sắp xếp Root Comments
  const sortedRootComments = useMemo(() => {
    return [...rootComments].sort((a, b) => {
      if (sortOrder === 'desc') return new Date(b.createdAt) - new Date(a.createdAt);
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
  }, [rootComments, sortOrder]);

  const displayedRoots = sortedRootComments.slice(0, visibleRoots);

  // ================= SUBMIT =================
  const handleRootSubmit = async (e) => {
    e?.preventDefault();
    if (!currentUser) return toast.error('Vui lòng đăng nhập để bình luận!');
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await commentService.addComment(blogId, newComment, null);
      toast.success('Đã gửi bình luận!');
      setNewComment('');
      setReplyingTo(null);
      setSortOrder('desc'); // Ép về Mới nhất để user thấy comment vừa đăng
      fetchComments();
    } catch (err) {
      toast.error('Lỗi khi gửi bình luận');
    } finally {
      setSubmitting(false);
    }
  };

  const submitReply = async (content, parentId) => {
    if (!currentUser) return toast.error('Vui lòng đăng nhập để bình luận!');
    if (!content.trim()) return;
    try {
      await commentService.addComment(blogId, content, parentId);
      toast.success('Đã trả lời bình luận!');
      setReplyingTo(null);
      fetchComments();
    } catch (err) {
      toast.error('Lỗi khi gửi bình luận');
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm('Bạn có chắc muốn xóa bình luận này?')) return;
    try {
      await commentService.deleteComment(commentId);
      toast.success('Đã xóa bình luận!');
      fetchComments();
    } catch (err) {
      toast.error('Không thể xóa bình luận');
    }
  };

  const handleKeyDown = (e, submitFn) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitFn();
    }
  };

  const CommentItem = ({ comment, isReply = false }) => {
    const replies = repliesMap[comment._id] || [];

    if (comment.isDeleted && replies.length === 0) return null;

    const isAuthor = currentUser && String(currentUser._id || currentUser.id) === String(comment.author._id);

    const [localReplyText, setLocalReplyText] = useState('');
    const replyInputRef = useRef(null);

    const isLongText = comment.content?.length > 150;
    const [isExpandedText, setIsExpandedText] = useState(false);
    const [showReplies, setShowReplies] = useState(false);

    useEffect(() => {
      if (replyingTo === comment._id && replyInputRef.current) {
        replyInputRef.current.focus();
      }
    }, [replyingTo]);

    return (
      <div className={`flex gap-3 md:gap-4 mt-6 ${isReply ? 'ml-6 md:ml-12 relative' : ''}`}>
        {isReply && (
          <div className="absolute -left-4 md:-left-6 top-0 w-3 md:w-4 h-6 border-b-2 border-l-2 border-neutral-300 dark:border-neutral-700 rounded-bl-xl"></div>
        )}
        <a href={`/author/${comment.author._id}`} className="flex gap-3 md:gap-4">
          {/* Avatar */}
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
            {comment.author.avatar ? (
              <img src={comment.author.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-blue-500 uppercase">
                {(comment.author.displayName || comment.author.username).charAt(0)}
              </span>
            )}
          </div>
        </a>
        {/* Nội dung Comment */}
        <div className="flex-1 min-w-0">
          <div className="bg-white dark:bg-neutral-800/80 p-3 md:p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700/50 shadow-sm">
            <div className="flex items-center gap-2 mb-1.5 md:mb-2">
              <a href={`/author/${comment.author._id}`} className="flex gap-3 md:gap-4">
                <span className="font-bold text-[13px] md:text-sm text-neutral-900 dark:text-white">
                  {comment.author.displayName || comment.author.username}
                </span>
              </a>
              <span className="text-[11px] text-neutral-500">{formatTimeAgo(comment.createdAt)}</span>
            </div>

            {comment.isDeleted ? (
              <p className="text-sm text-neutral-400 dark:text-neutral-500 italic">Bình luận này đã bị xóa.</p>
            ) : (
              <div>
                <p
                  className={`text-[13px] md:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap ${!isExpandedText && isLongText ? 'line-clamp-2' : ''}`}
                >
                  {comment.content}
                </p>
                {isLongText && (
                  <button
                    onClick={() => setIsExpandedText(!isExpandedText)}
                    className="text-xs font-bold text-blue-500 mt-1 hover:underline"
                  >
                    {isExpandedText ? 'Thu gọn' : 'Xem thêm'}
                  </button>
                )}
              </div>
            )}
          </div>

          {!comment.isDeleted && (
            <div className="flex items-center gap-4 mt-2 ml-2">
              <button
                onClick={() => {
                  setReplyingTo(replyingTo === comment._id ? null : comment._id);
                  setLocalReplyText('');
                }}
                className="text-[11px] md:text-xs font-bold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
              >
                {replyingTo === comment._id ? 'Hủy' : 'Trả lời'}
              </button>

              {isAuthor && (
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="text-[11px] md:text-xs font-bold text-neutral-500 hover:text-red-500 transition-colors"
                >
                  Xóa
                </button>
              )}
            </div>
          )}

          {/* Hộp nhập RiReplyFill */}
          {replyingTo === comment._id && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitReply(localReplyText, comment._id);
              }}
              className="mt-3 flex gap-2 md:gap-3 animate-in fade-in slide-in-from-top-2"
            >
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0 text-neutral-500">
                <RiCornerDownRightFill size={14} />
              </div>
              <div className="flex-1 flex items-start gap-2 relative">
                <textarea
                  ref={replyInputRef}
                  className="w-full p-2.5 pr-10 md:pr-12 text-xs md:text-sm rounded-xl bg-white dark:bg-neutral-900 border border-blue-300 dark:border-blue-700/50 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 outline-none custom-scrollbar resize-none"
                  rows="2"
                  placeholder={`Trả lời ${comment.author.displayName || comment.author.username}...`}
                  value={localReplyText}
                  onChange={(e) => setLocalReplyText(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, () => submitReply(localReplyText, comment._id))}
                />
                <Button
                  type="submit"
                  intent="primary"
                  size="icon"
                  className="!rounded-lg flex-shrink-0 h-8 w-8 absolute bottom-1.5 right-1.5"
                  disabled={!localReplyText.trim()}
                >
                  <RiSendPlaneFill size={12} className="-ml-0.5" />
                </Button>
              </div>
            </form>
          )}

          {replies.length > 0 && (
            <div className="mt-2">
              {/* Nút Xem thêm câu trả lời */}
              {!showReplies ? (
                <button
                  onClick={() => setShowReplies(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-3 py-1.5 rounded-full transition-colors mt-1"
                >
                  <RiCornerDownRightFill size={14} /> Xem {replies.length} câu trả lời
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setShowReplies(false)}
                    className="flex items-center gap-1 text-[11px] font-bold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 mt-1 ml-1 mb-2 transition-colors"
                  >
                    <RiArrowUpSFill size={14} /> Thu gọn câu trả lời
                  </button>

                  <div className="animate-in fade-in duration-300">
                    {replies.map((r) => (
                      <CommentItem key={r._id} comment={r} isReply={true} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <div className="py-10 text-center text-neutral-500">Đang tải bình luận...</div>;

  return (
    <div className="mt-16 pt-10 border-t border-neutral-200 dark:border-neutral-800">
      {/* Header Bình luận & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <RiMessage2Fill className="text-blue-500" /> Bình luận ({comments.length})
        </h3>

        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg w-fit border border-neutral-200 dark:border-neutral-700">
          <button
            onClick={() => setSortOrder('desc')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${sortOrder === 'desc' ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
          >
            Mới nhất
          </button>
          <button
            onClick={() => setSortOrder('asc')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${sortOrder === 'asc' ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
          >
            Cũ nhất
          </button>
        </div>
      </div>

      {/* ROOT INPUT */}
      <form
        onSubmit={handleRootSubmit}
        className="mb-10 bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700/50"
      >
        <textarea
          className="w-full p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 focus:ring-2 focus:ring-blue-500 outline-none custom-scrollbar resize-y min-h-[100px] text-sm leading-relaxed"
          placeholder={
            currentUser
              ? 'Nhập bình luận của bạn... (Nhấn Enter để gửi, Shift+Enter để xuống dòng)'
              : 'Vui lòng đăng nhập để bình luận...'
          }
          value={!replyingTo ? newComment : ''}
          onChange={(e) => {
            setNewComment(e.target.value);
            setReplyingTo(null);
          }}
          onKeyDown={(e) => handleKeyDown(e, handleRootSubmit)}
          disabled={!currentUser}
        />
        <div className="flex justify-end mt-3">
          <Button
            type="submit"
            intent="primary"
            disabled={submitting || !currentUser || replyingTo !== null || !newComment.trim()}
          >
            {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
          </Button>
        </div>
      </form>

      {/*  KHUNG CHỨA LIST COMMENT CÓ SCROLLBAR MAX-HEIGHT */}
      {rootComments.length === 0 ? (
        <div className="text-center py-10 text-neutral-500 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-neutral-100 dark:border-neutral-800 border-dashed">
          Chưa có bình luận nào. Hãy trở thành người đầu tiên!
        </div>
      ) : (
        <div className="space-y-2 max-h-[800px] overflow-y-auto custom-scrollbar pr-2 pb-6">
          {displayedRoots.map((c) => (
            <CommentItem key={c._id} comment={c} />
          ))}

          {visibleRoots < sortedRootComments.length && (
            <div className="text-center mt-8 pt-4">
              <Button intent="neutral" onClick={() => setVisibleRoots((prev) => prev + 5)} className="!rounded-full">
                <RiArrowDownSFill size={16} className="mr-1" /> Xem thêm bình luận cũ hơn
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
