import React, { useState, useEffect, useMemo, useRef } from 'react';
import { commentService } from '../../services/commentService';
import { toast } from 'react-hot-toast';
import { formatTimeAgo } from '../utils/timeFormat';
import {
  RiMessage2Fill,
  RiCornerDownRightFill,
  RiSendPlaneFill,
  RiArrowDownSFill,
  RiArrowUpSFill,
} from 'react-icons/ri';
import Button from '../base-ui/Button';
import Avatar from '../base-ui/Avatar';
import Tab from '../base-ui/Tab';

export default function CommentSection({ blogId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [sortOrder, setSortOrder] = useState('desc');
  const [visibleRoots, setVisibleRoots] = useState(5);

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
      setSortOrder('desc');
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

  const CommentItem = ({ comment, isReply = false, hideLine = false }) => {
    const replies = repliesMap[comment._id] || [];

    if (comment.isDeleted && replies.length === 0) return null;

    const isCommentAuthor = currentUser && String(currentUser._id || currentUser.id) === String(comment.author._id);
    const commentAuthorName = comment.author.displayName || comment.author.username;

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
      <div className={`flex gap-3 mt-3 ${isReply ? 'ml-8 md:ml-12 relative pl-1.5 md:pl-0.5' : ''}`}>
        {isReply && !hideLine && (
          <div className="absolute -left-4 md:-left-6 top-0 w-3 md:w-4 h-7.5 border-b-2 border-l-2 border-grey-300 dark:border-grey-700 rounded-bl-xl"></div>
        )}

        <a href={`/author/${comment.author._id}`} className="shrink-0 mt-2 h-max">
          <Avatar src={comment.author.avatar} alt={commentAuthorName} fallback={commentAuthorName} />
        </a>

        {/* Comment body */}
        <div className="flex-1 min-w-0">
          <div className="p-4 rounded-sm bg-grey-100 dark:bg-grey-800">
            <div className="flex items-center gap-2 mb-1.5">
              <a
                href={`/author/${comment.author._id}`}
                className="font-bold text-sm text-grey-900 dark:text-grey-100 hover:text-primary-500 transition-colors"
              >
                {commentAuthorName}
              </a>
              <span className="text-[11px] text-grey-500">{formatTimeAgo(comment.createdAt)}</span>
            </div>

            {comment.isDeleted ? (
              <p className="text-sm text-grey-400 dark:text-grey-500 italic">Bình luận này đã bị xóa.</p>
            ) : (
              <div>
                <p
                  className={`text-sm text-grey-700 dark:text-grey-300 leading-relaxed whitespace-pre-wrap ${!isExpandedText && isLongText ? 'line-clamp-2' : ''}`}
                >
                  {comment.content}
                </p>
                {isLongText && (
                  <Button
                    onClick={() => setIsExpandedText(!isExpandedText)}
                    intent="ghost"
                    className="!h-auto !px-0 !py-0 text-xs font-bold text-primary-500 mt-1 hover:underline cursor-pointer"
                  >
                    {isExpandedText ? 'Thu gọn' : 'Xem thêm'}
                  </Button>
                )}
              </div>
            )}
          </div>

          {!comment.isDeleted && (
            <div className="flex items-center mt-2 *:text-xs">
              <Button
                onClick={() => {
                  setReplyingTo(replyingTo === comment._id ? null : comment._id);
                  setLocalReplyText('');
                }}
                intent="ghost"
                size="sm"
              >
                {replyingTo === comment._id ? 'Hủy' : 'Trả lời'}
              </Button>

              {isCommentAuthor && (
                <Button onClick={() => handleDelete(comment._id)} intent="ghost" size="sm">
                  Xóa
                </Button>
              )}
            </div>
          )}

          {/* Reply input */}
          {replyingTo === comment._id && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitReply(localReplyText, comment._id);
              }}
              className="mt-3 flex gap-2 md:gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-grey-100 dark:bg-grey-800 flex items-center justify-center flex-shrink-0 text-grey-500">
                <RiCornerDownRightFill size={14} />
              </div>
              <div className="flex-1 flex flex-col items-end gap-2 relative">
                <textarea
                  ref={replyInputRef}
                  className="w-full p-4 rounded-sm bg-white dark:bg-black border-2 border-grey-300 dark:border-grey-700 text-grey-900 dark:text-grey-100 placeholder:text-grey-400 dark:placeholder:text-grey-500 focus:border-primary-500 outline-none resize-y min-h-[100px] text-sm leading-relaxed"
                  placeholder={`Trả lời ${commentAuthorName}...`}
                  value={localReplyText}
                  onChange={(e) => setLocalReplyText(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, () => submitReply(localReplyText, comment._id))}
                />
                <Button type="submit" intent="primary" size="sm" disabled={!localReplyText.trim()}>
                  <RiSendPlaneFill className="-ml-0.5" /> Gửi bình luận
                </Button>
              </div>
            </form>
          )}

          {replies.length > 0 && (
            <div className="mt-2">
              {!showReplies ? (
                <Button onClick={() => setShowReplies(true)} intent="ghost" size="sm" className="text-xs">
                  <RiCornerDownRightFill size={14} /> Xem {replies.length} câu trả lời
                </Button>
              ) : (
                <>
                  <Button onClick={() => setShowReplies(false)} intent="ghost" size="sm" className="text-xs">
                    <RiArrowUpSFill size={14} /> Thu gọn câu trả lời
                  </Button>

                  <div>
                    {replies.map((r, i) => (
                      <CommentItem key={r._id} comment={r} isReply={true} hideLine={i > 0} />
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

  if (loading) return <div className="py-10 text-center text-grey-500">Đang tải bình luận...</div>;

  return (
    <div className="mt-8 pt-10 border-t border-grey-200 dark:border-grey-800">
      {/* Header Bình luận & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h3 className="text-xl font-bold text-grey-900 dark:text-grey-50 flex items-center gap-4">
          <RiMessage2Fill size={24} className="text-primary-500" /> Bình luận ({comments.length})
        </h3>

        <div className="flex items-center border-b border-grey-200 dark:border-grey-800">
          <Tab active={sortOrder === 'desc'} onClick={() => setSortOrder('desc')} className="!py-2">
            Mới nhất
          </Tab>
          <Tab active={sortOrder === 'asc'} onClick={() => setSortOrder('asc')} className="!py-2">
            Cũ nhất
          </Tab>
        </div>
      </div>

      {/* ROOT INPUT */}
      <form onSubmit={handleRootSubmit} className="mb-10">
        <textarea
          className="w-full p-4 rounded-sm bg-white dark:bg-black border-2 border-grey-300 dark:border-grey-700 text-grey-900 dark:text-grey-100 placeholder:text-grey-400 dark:placeholder:text-grey-500 focus:border-primary-500 outline-none resize-y min-h-[100px] text-sm leading-relaxed"
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

      {/* COMMENT LIST */}
      {rootComments.length === 0 ? (
        <div className="text-center py-10 text-grey-500 bg-grey-50 dark:bg-grey-900 rounded-sm border border-dashed border-grey-200 dark:border-grey-800">
          Chưa có bình luận nào. Hãy trở thành người đầu tiên!
        </div>
      ) : (
        <div className="space-y-2 pr-2 pb-6">
          {displayedRoots.map((c) => (
            <CommentItem key={c._id} comment={c} />
          ))}

          {visibleRoots < sortedRootComments.length && (
            <div className="text-center mt-8 pt-4">
              <Button intent="neutral" onClick={() => setVisibleRoots((prev) => prev + 5)}>
                <RiArrowDownSFill size={16} className="mr-1" /> Xem thêm bình luận
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
