import React, { useState, useEffect, useRef } from 'react';
import { useCreateBlog } from '../../hooks/useBlogs';
import { blogService } from '../../services/blogService';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RiQuestionFill, RiImageAddFill, RiLoader4Fill, RiFileEditFill } from 'react-icons/ri';
import { uploadService } from '../../services/uploadService';
import MarkdownHelpModal from './MarkdownHelpModal';
import Button from '../base-ui/Button';

const queryClient = new QueryClient();

function BlogEditorContent() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [draftId, setDraftId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [syncStatus, setSyncStatus] = useState('Sẵn sàng');

  const imageInputRef = useRef(null);
  const draftCreatingRef = useRef(false);

  const { mutate: createPost } = useCreateBlog();

  useEffect(() => {
    const saved = localStorage.getItem('draft_blog_create');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.title || parsed.content) {
          setTitle(parsed.title || '');
          setContent(parsed.content || '');
          toast.success('Đã khôi phục dữ liệu chưa lưu lúc trước!');
        }
      } catch (e) {
        localStorage.removeItem('draft_blog_create');
      }
    }
  }, []);

  useEffect(() => {
    if (!title.trim() && !content.trim()) return;

    setSyncStatus('Đang lưu...');

    if (!draftId) {
      localStorage.setItem('draft_blog_create', JSON.stringify({ title, content }));
    } else {
      localStorage.removeItem('draft_blog_create');
    }

    const timer = setTimeout(() => {
      if (draftId) {
        blogService
          .updateBlog(draftId, { title, content, isPublic: false })
          .then(() => setSyncStatus('Đã lưu nháp an toàn'))
          .catch(() => setSyncStatus('Lỗi mạng (Chưa lưu)'));
      } else {
        if (!draftCreatingRef.current) {
          draftCreatingRef.current = true;

          createPost(
            {
              title: title || 'Bản nháp không tên',
              content: content || ' ',
              isPublic: false,
            },
            {
              onSuccess: (res) => {
                const newDraftId = res.blog?._id || res.data?.blog?._id;
                if (!newDraftId) return;

                setDraftId(newDraftId);
                setSyncStatus('Đã lưu nháp an toàn');

                // Ảo thuật đổi URL để mốt lỡ F5 nó vào trang Edit
                window.history.replaceState(null, '', `/blog/edit/${newDraftId}`);

                // Xóa rác LocalStorage sau khi tạo thành công
                localStorage.removeItem('draft_blog_create');
              },
              onError: () => {
                setSyncStatus('Lỗi mạng (Đã lưu vào máy)');
                draftCreatingRef.current = false;
              },
            },
          );
        }
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [title, content, draftId, createPost]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (syncStatus === 'Đang lưu...') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [syncStatus]);

  const handleUploadBlogImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadService.uploadImage(file);
      const url = res.data.url;
      setContent((prev) => prev + `\n![Hình ảnh bài viết](${url})\n`);
      toast.success('Đã chèn ảnh vào bài viết!');
    } catch {
      toast.error('Lỗi: Không thể tải ảnh lên Supabase');
    } finally {
      setUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) return toast.error('Vui lòng nhập đầy đủ tiêu đề và nội dung!');

    if (!draftId) {
      toast.loading('Hệ thống đang chuẩn bị dữ liệu, vui lòng đợi vài giây rồi thử lại...');
      return;
    }

    blogService
      .updateBlog(draftId, { title, content, isPublic: true })
      .then(() => {
        localStorage.removeItem('draft_blog_create');
        toast.success('Đăng bài thành công!');
        setTimeout(() => (window.location.href = '/blog'), 1200);
      })
      .catch(() => toast.error('Lỗi khi xuất bản bài viết'));
  };

  return (
    <div className="relative w-full">

        <input
          type="file"
          ref={imageInputRef}
          onChange={handleUploadBlogImage}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />

        {/* TIÊU ĐỀ & ACTIONS */}
        <div className="mb-10 mt-4 flex flex-col lg:flex-row lg:items-end gap-6 justify-between border-b border-grey-200 dark:border-grey-800 pb-3 group focus-within:border-primary-500 transition-colors">
          <input
            className="flex-1 w-full text-4xl md:text-5xl font-extrabold bg-transparent outline-none text-grey-900 dark:text-grey-100 placeholder:text-grey-400"
            placeholder="Tiêu đề bài viết..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex items-center gap-3 shrink-0 mb-1">
            <div className="hidden sm:flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${syncStatus === 'Đã lưu nháp an toàn' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}
              ></div>
              <span className="text-xs font-medium text-grey-500">{syncStatus}</span>
            </div>

            <div className="w-px h-6 bg-grey-200 dark:bg-grey-800 mx-1 hidden sm:block"></div>

            <Button
              type="button"
              intent="neutral"
              size="icon"
              onClick={() => imageInputRef.current?.click()}
              disabled={uploading}
              title="Chèn ảnh vào bài"
            >
              {uploading ? <RiLoader4Fill className="animate-spin" size={20} /> : <RiImageAddFill size={20} />}
            </Button>

            <Button
              type="button"
              intent="primary"
              size="icon"
              onClick={() => setShowHelp(true)}
              title="Hướng dẫn Markdown"
            >
              <RiQuestionFill size={20} />
            </Button>
          </div>
        </div>

        {/* EDITOR & PREVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          <div className="flex flex-col">
            <label className="mb-3 text-xs font-bold uppercase text-grey-500">
              Soạn thảo Markdown
            </label>
            <textarea
              className="w-full min-h-[520px] p-5 rounded-xl bg-grey-50 dark:bg-grey-900/40 border-none text-grey-900 dark:text-grey-100 placeholder:text-grey-500 font-mono text-sm leading-relaxed focus:ring-2 focus:ring-primary-500 outline-none custom-scrollbar"
              placeholder="# Viết nội dung tại đây..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-3 text-xs font-bold uppercase text-grey-500">Xem trước</label>
            <div className="w-full min-h-[520px] p-6 rounded-xl bg-grey-50 dark:bg-grey-900/40 border-none overflow-y-auto prose prose-lg max-w-none prose-neutral dark:prose-invert custom-scrollbar">
              {content ? (
                <ReactMarkdown
                  components={{
                    img: ({ src, alt }) => (
                      <div className="flex flex-col items-center my-6">
                        <img src={src} alt={alt} className="rounded-xl max-w-full shadow-md" />
                        {alt && <p className="text-sm text-grey-500 italic mt-2 text-center">{alt}</p>}
                      </div>
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-grey-400 opacity-60">
                  <RiFileEditFill size={48} className="mb-4" />
                  <p className="italic text-center">Nội dung hiển thị tại đây…</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* NÚT SUBMIT */}
        <div className="flex justify-end pt-8 mt-4">
          <Button
            onClick={handlePublish}
            disabled={!title.trim() || !content.trim()}
            intent="primary"
            className="px-8 py-3"
          >
            Xuất bản Công Khai
          </Button>
        </div>

        <MarkdownHelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}

export default function BlogEditor() {
  return (
    <QueryClientProvider client={queryClient}>
      <BlogEditorContent />
    </QueryClientProvider>
  );
}
