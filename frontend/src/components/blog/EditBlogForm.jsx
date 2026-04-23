import React, { useState, useEffect, useRef } from 'react';
import { blogService } from '../../services/blogService';
import { uploadService } from '../../services/uploadService';
import { navigate } from 'astro:transitions/client';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-hot-toast';
import { RiFileEditFill, RiQuestionFill, RiImageAddFill, RiLoader4Fill, RiEarthFill, RiLockFill } from 'react-icons/ri';
import MarkdownHelpModal from './MarkdownHelpModal';
import Button from '../base-ui/Button';
import Switch from '../base-ui/Switch';

export default function EditBlogForm({ blogId }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPublic: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const imageInputRef = useRef(null);

  // Load blog từ API + merge draft
  useEffect(() => {
    if (!blogId) return;

    const fetchBlog = async () => {
      try {
        const res = await blogService.getBlogById(blogId);
        let data = {
          title: res.data.title,
          content: res.data.content,
          isPublic: res.data.isPublic ?? true,
        };

        const draft = localStorage.getItem(`draft_blog_edit_${blogId}`);
        if (draft) {
          data = { ...data, ...JSON.parse(draft) }; // ưu tiên draft
        }

        setFormData(data);
      } catch (err) {
        toast.error('Không tìm thấy bài viết');
        navigate('/blog/manage');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  // Auto-save draft
  useEffect(() => {
    if (!blogId) return;

    const timeout = setTimeout(() => {
      localStorage.setItem(`draft_blog_edit_${blogId}`, JSON.stringify(formData));
      setLastSaved(new Date());
    }, 1000);

    return () => clearTimeout(timeout);
  }, [formData, blogId]);

  // Upload ảnh & chèn Markdown
  const handleUploadBlogImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadService.uploadImage(file);
      const url = res.data.url;
      setFormData((prev) => ({
        ...prev,
        content: prev.content + `\n![Hình ảnh bài viết](${url})\n`,
      }));
      toast.success('Đã chèn ảnh vào bài viết!');
    } catch {
      toast.error('Lỗi: Không thể tải ảnh lên Supabase');
    } finally {
      setUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  // Lưu bài
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Vui lòng nhập tiêu đề và nội dung!');
      return;
    }

    setSaving(true);
    try {
      await blogService.updateBlog(blogId, formData);
      toast.success('Cập nhật thành công!');
      localStorage.removeItem(`draft_blog_edit_${blogId}`);
      setTimeout(() => navigate('/blog/manage'), 1000);
    } catch {
      toast.error('Lỗi khi lưu bài viết');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center w-full">
        <div className="text-grey-500">Đang tải bài viết...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full">

        <input
          type="file"
          ref={imageInputRef}
          onChange={handleUploadBlogImage}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />

        <form onSubmit={handleSubmit}>
          <div className="mb-10 flex flex-col gap-5">
            <div className="flex flex-col lg:flex-row lg:items-end gap-6 justify-between border-b border-grey-200 dark:border-grey-800 pb-3 group focus-within:border-primary-500 transition-colors">
              <input
                className="flex-1 w-full text-4xl md:text-5xl font-extrabold bg-transparent outline-none text-grey-900 dark:text-grey-100 placeholder:text-grey-400"
                placeholder="Tiêu đề bài viết..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />

              <div className="flex items-center gap-3 shrink-0 mb-1">
                {lastSaved && (
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-xs font-medium text-grey-500">
                      Đã lưu nháp: {lastSaved.toLocaleTimeString()}
                    </span>
                  </div>
                )}
                
                {lastSaved && <div className="w-px h-6 bg-grey-200 dark:bg-grey-800 mx-1 hidden sm:block"></div>}
                
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
            <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
              <Switch
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                checkedIcon={<RiEarthFill />}
                uncheckedIcon={<RiLockFill />}
              />
              <span className="font-medium text-grey-700 dark:text-grey-300">
                {formData.isPublic ? 'Công khai' : 'Riêng tư'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
            <div className="flex flex-col">
              <label className="mb-3 text-xs font-bold uppercase text-grey-500">
                Soạn thảo Markdown
              </label>
              <textarea
                className="w-full min-h-[520px] p-5 rounded-xl bg-grey-50 dark:bg-grey-900/40 border-none text-grey-900 dark:text-grey-100 placeholder:text-grey-500 font-mono text-sm leading-relaxed focus:ring-2 focus:ring-primary-500 outline-none custom-scrollbar"
                placeholder="# Viết nội dung tại đây..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-3 text-xs font-bold uppercase text-grey-500">
                Xem trước
              </label>
              <div className="w-full min-h-[520px] p-6 rounded-xl bg-grey-50 dark:bg-grey-900/40 border-none overflow-y-auto prose prose-lg max-w-none prose-neutral dark:prose-invert custom-scrollbar">
                {formData.content ? (
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
                    {formData.content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-grey-400 italic mt-24 text-center">Nội dung xem trước sẽ hiển thị tại đây…</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center gap-4 pt-8 mt-4">
            <Button type="button" intent="ghost" onClick={() => navigate('/blog/manage')}>
              Hủy bỏ
            </Button>
            <Button type="submit" intent="primary" disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>

        <MarkdownHelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
