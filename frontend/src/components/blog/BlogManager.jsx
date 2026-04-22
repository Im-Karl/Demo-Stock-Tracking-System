import React, { useState, useEffect } from 'react';
import { blogService } from '../../services/blogService';
import { RiEdit2Fill, RiDeleteBinFill, RiRestartFill, RiCloseCircleFill, RiFileTextFill, RiLockFill, RiEarthFill } from 'react-icons/ri';
import toast from 'react-hot-toast';
import Button from '../base-ui/Button';
import PageLayout from '../base-ui/PageLayout';
import GlassCard from '../base-ui/GlassCard';

export default function BlogManager() {
  const [activeTab, setActiveTab] = useState('published');
  const [blogs, setBlogs] = useState({
    published: [],
    drafts: [],
    trashed: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchMyBlogs = async () => {
    try {
      const res = await blogService.getMyBlogs();
      setBlogs({
        published: res.data.published || [],
        drafts: res.data.drafts || [],
        trashed: res.data.trashed || [],
      });
    } catch (error) {
      toast.error('Lỗi tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const handleSoftDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn chuyển bài này vào thùng rác?')) return;
    try {
      await blogService.moveToTrash(id);
      toast.success('Đã chuyển vào thùng rác');
      fetchMyBlogs();
    } catch {
      toast.error('Lỗi xóa bài');
    }
  };

  const handleRestore = async (id) => {
    try {
      await blogService.restoreBlog(id);
      toast.success('Đã khôi phục');
      fetchMyBlogs();
    } catch {
      toast.error('Lỗi khôi phục');
    }
  };

  const handleHardDelete = async (id) => {
    if (!confirm('CẢNH BÁO: Xóa vĩnh viễn?')) return;
    try {
      await blogService.hardDelete(id);
      toast.success('Đã xóa vĩnh viễn');
      fetchMyBlogs();
    } catch {
      toast.error('Lỗi xóa');
    }
  };

  const handleToggleStatus = async (slug) => {
    try {
      const res = await blogService.togglePublic(slug);
      toast.success(res.data.message);
      fetchMyBlogs();
    } catch {
      toast.error('Lỗi');
    }
  };

  const renderList = (list, type) => {
    if (list.length === 0)
      return <div className="text-center text-neutral-400 dark:text-neutral-500 py-16">Không có bài viết nào.</div>;

    return (
      <div className="space-y-5">
        {list.map((blog) => (
          <div
            key={blog._id}
            onClick={() => {
              if (type !== 'trashed') window.location.href = `/blog/${blog.slug}`;
            }}
            className="bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/50 rounded-xl p-5 hover:shadow-xl transform hover:scale-[1.01] transition-all flex flex-col md:flex-row justify-between md:items-center gap-4 cursor-pointer"
          >
            <div>
              <h3 className="font-bold text-neutral-800 dark:text-white text-lg line-clamp-1">{blog.title}</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                {type === 'trashed' && blog.deletedAt && (
                  <span className="text-red-400 ml-2 italic">
                    (Tự hủy sau: {30 - Math.floor((new Date() - new Date(blog.deletedAt)) / (1000 * 60 * 60 * 24))}{' '}
                    ngày)
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {type === 'published' && (
                <>
                  <Button
                    size="sm"
                    intent="warningSoft"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatus(blog.slug);
                    }}
                  >
                    <RiLockFill size={16} /> Hạ về nháp
                  </Button>
                  <Button
                    size="icon"
                    intent="dangerSoft"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSoftDelete(blog._id);
                    }}
                  >
                    <RiDeleteBinFill size={18} />
                  </Button>
                </>
              )}
              {type === 'drafts' && (
                <>
                  <Button
                    size="sm"
                    intent="successSoft"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatus(blog.slug);
                    }}
                  >
                    <RiEarthFill size={16} /> Xuất bản
                  </Button>
                  <Button
                    size="icon"
                    intent="primarySoft"
                    render={<a href={`/blog/edit/${blog._id}`} onClick={(e) => e.stopPropagation()} />}
                  >
                    <RiEdit2Fill size={18} />
                  </Button>
                  <Button
                    size="icon"
                    intent="dangerSoft"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSoftDelete(blog._id);
                    }}
                  >
                    <RiDeleteBinFill size={18} />
                  </Button>
                </>
              )}
              {type === 'trashed' && (
                <>
                  <Button
                    size="sm"
                    intent="successSoft"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestore(blog._id);
                    }}
                  >
                    <RiRestartFill size={16} /> Khôi phục
                  </Button>
                  <Button
                    size="sm"
                    intent="dangerSoft"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleHardDelete(blog._id);
                    }}
                  >
                    <RiCloseCircleFill size={16} /> Xóa vĩnh viễn
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading)
    return (
      <PageLayout showAmbient={false} className="py-20 text-center">
        <div className="text-neutral-500">Đang tải dữ liệu...</div>
      </PageLayout>
    );

  return (
    <PageLayout showAmbient={false} className="py-10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold flex items-center gap-3 text-blue-600 dark:text-blue-400">
            <RiFileTextFill /> Quản lý bài viết
          </h1>

          <Button
            intent="primary"
            className="flex items-center gap-2 w-auto hover:scale-105 active:scale-95 transition"
            render={<a href="/blog/create" />}
          >
            Viết bài mới
          </Button>
        </div>

        <div className="flex gap-3 mb-8 flex-wrap">
          {[
            {
              key: 'published',
              label: 'Đã xuất bản',
              count: blogs.published.length,
            },
            { key: 'drafts', label: 'Bản nháp', count: blogs.drafts.length },
            { key: 'trashed', label: 'Thùng rác', count: blogs.trashed.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${activeTab === tab.key ? 'text-white bg-blue-600 shadow-md' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'}`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <GlassCard className="min-h-[400px]">
          {activeTab === 'published' && renderList(blogs.published, 'published')}
          {activeTab === 'drafts' && renderList(blogs.drafts, 'drafts')}
          {activeTab === 'trashed' && renderList(blogs.trashed, 'trashed')}
        </GlassCard>
      </div>
    </PageLayout>
  );
}
