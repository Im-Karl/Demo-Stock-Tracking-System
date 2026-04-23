import React, { useState, useEffect } from 'react';
import { blogService } from '../../services/blogService';
import {
  RiEdit2Fill,
  RiDeleteBinFill,
  RiRestartFill,
  RiCloseCircleFill,
  RiFileTextFill,
  RiLockFill,
  RiEarthFill,
} from 'react-icons/ri';
import toast from 'react-hot-toast';
import Button from '../base-ui/Button';
import Tab from '../base-ui/Tab';
import ConfirmModal from '../base-ui/ConfirmModal';

const BookmarkButton = ({ children, softClass, boldClass, rotateClass = '', onClick, title, as = 'button', href }) => {
  const Component = as;
  return (
    <div className={`drop-shadow-sm transition-transform hover:translate-x-1.5 z-10 ${rotateClass}`}>
      <Component
        href={href}
        onClick={onClick}
        title={title}
        className={`relative flex items-center gap-1.5 pl-4 pr-12 py-2 font-bold cursor-pointer ${softClass}`}
        style={{ clipPath: 'polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)' }}
      >
        {/* Bold Right Tip */}
        <div className={`absolute right-0 top-0 bottom-0 w-8 pointer-events-none ${boldClass}`} />
        <span className="relative z-10 flex items-center gap-1.5">{children}</span>
      </Component>
    </div>
  );
};

export default function BlogManager() {
  const [activeTab, setActiveTab] = useState('published');
  const [blogs, setBlogs] = useState({
    published: [],
    drafts: [],
    trashed: [],
  });
  const [loading, setLoading] = useState(true);
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    onConfirm: () => {},
    title: '',
    message: '',
    isLoading: false,
  });

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

  const handleSoftDelete = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Chuyển vào thùng rác',
      message: 'Bạn có chắc chắn muốn chuyển bài viết này vào thùng rác? Bạn có thể khôi phục nó sau này.',
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, isLoading: true }));
        try {
          await blogService.moveToTrash(id);
          toast.success('Đã chuyển vào thùng rác');
          fetchMyBlogs();
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        } catch {
          toast.error('Lỗi xóa bài');
        } finally {
          setConfirmConfig((prev) => ({ ...prev, isLoading: false }));
        }
      },
    });
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

  const handleHardDelete = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Xóa vĩnh viễn',
      message: 'Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn khỏi hệ thống.',
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, isLoading: true }));
        try {
          await blogService.hardDelete(id);
          toast.success('Đã xóa vĩnh viễn');
          fetchMyBlogs();
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        } catch {
          toast.error('Lỗi xóa');
        } finally {
          setConfirmConfig((prev) => ({ ...prev, isLoading: false }));
        }
      },
    });
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

  const stickyColors = [
    'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-100',
    'bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-100',
    'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-100',
    'bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-100',
  ];

  const renderList = (list, type) => {
    if (list.length === 0)
      return (
        <div className="text-center text-grey-400 dark:text-grey-500 py-16 col-span-full">Không có bài viết nào.</div>
      );

    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] justify-items-center sm:justify-items-start gap-12 sm:gap-16 py-8">
        {list.map((blog, index) => {
          const rotationClass = index % 3 === 0 ? '-rotate-2' : index % 3 === 1 ? 'rotate-2' : '-rotate-1';
          const colorTheme = stickyColors[index % stickyColors.length];

          return (
            <div
              key={blog._id}
              onClick={() => {
                if (type !== 'trashed') window.location.href = `/blog/${blog.slug}`;
              }}
              className={`relative w-[280px] h-[280px] shrink-0 p-6 pt-18 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:rotate-0 hover:shadow-xl hover:z-20 cursor-pointer flex flex-col group ${rotationClass} ${colorTheme}`}
            >
              {/* Adhesive Strip */}
              <div className="absolute top-0 left-0 right-0 h-12 bg-black/[0.03] dark:bg-black/20 pointer-events-none -z-1" />

              {/* Note Content */}
              <h3 className="font-heading font-bold text-xl md:text-2xl line-clamp-4 leading-snug mb-4">
                {blog.title}
              </h3>

              <div className="mt-auto">
                <p className="text-xs font-bold opacity-60">{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</p>
                {type === 'trashed' && blog.deletedAt && (
                  <p className="text-xs font-bold text-red-500 mt-1">
                    Tự hủy sau: {30 - Math.floor((new Date() - new Date(blog.deletedAt)) / (1000 * 60 * 60 * 24))} ngày
                  </p>
                )}
              </div>

              {/* Bookmark Flags */}
              <div className="absolute bottom-4 -right-8 flex flex-col gap-2 items-end z-10 opacity-90 group-hover:opacity-100 transition-opacity">
                {type === 'published' && (
                  <>
                    <BookmarkButton
                      softClass="bg-amber-500/75 text-white"
                      boldClass="bg-amber-500/75"
                      rotateClass="-rotate-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(blog.slug);
                      }}
                    >
                      <RiLockFill size={14} /> Nháp
                    </BookmarkButton>
                    <BookmarkButton
                      softClass="bg-red-500/75 text-white"
                      boldClass="bg-red-500/75"
                      rotateClass="rotate-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSoftDelete(blog._id);
                      }}
                    >
                      <RiDeleteBinFill size={14} /> Xóa
                    </BookmarkButton>
                  </>
                )}
                {type === 'drafts' && (
                  <>
                    <BookmarkButton
                      softClass="bg-emerald-500/75 text-white"
                      boldClass="bg-emerald-500/75"
                      rotateClass="-rotate-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(blog.slug);
                      }}
                    >
                      <RiEarthFill size={14} /> Đăng
                    </BookmarkButton>
                    <BookmarkButton
                      as="a"
                      href={`/blog/edit/${blog._id}`}
                      softClass="bg-primary-500/75 text-white"
                      boldClass="bg-primary-500/75"
                      rotateClass="rotate-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <RiEdit2Fill size={14} /> Sửa
                    </BookmarkButton>
                    <BookmarkButton
                      softClass="bg-red-500/75 text-white"
                      boldClass="bg-red-500/75"
                      rotateClass="-rotate-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSoftDelete(blog._id);
                      }}
                    >
                      <RiDeleteBinFill size={14} /> Xóa
                    </BookmarkButton>
                  </>
                )}
                {type === 'trashed' && (
                  <>
                    <BookmarkButton
                      softClass="bg-emerald-500/75 text-white"
                      boldClass="bg-emerald-500/75"
                      rotateClass="rotate-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(blog._id);
                      }}
                    >
                      <RiRestartFill size={14} /> Phục hồi
                    </BookmarkButton>
                    <BookmarkButton
                      softClass="bg-red-500/75 text-white"
                      boldClass="bg-red-500/75"
                      rotateClass="-rotate-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHardDelete(blog._id);
                      }}
                    >
                      <RiCloseCircleFill size={14} /> Xóa hẳn
                    </BookmarkButton>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading)
    return (
      <div className="py-20 text-center">
        <div className="text-grey-500 font-medium">Đang tải dữ liệu...</div>
      </div>
    );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center border-b border-grey-200 dark:border-grey-800">
          {[
            { key: 'published', label: 'Đã xuất bản', count: blogs.published.length },
            { key: 'drafts', label: 'Bản nháp', count: blogs.drafts.length },
            { key: 'trashed', label: 'Thùng rác', count: blogs.trashed.length },
          ].map((tab) => (
            <Tab key={tab.key} active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)} className="!py-2">
              {tab.label} ({tab.count})
            </Tab>
          ))}
        </div>

        <Button intent="primary" render={<a href="/blog/create" />} className="shrink-0">
          <RiFileTextFill size={16} /> Viết bài mới
        </Button>
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'published' && renderList(blogs.published, 'published')}
        {activeTab === 'drafts' && renderList(blogs.drafts, 'drafts')}
        {activeTab === 'trashed' && renderList(blogs.trashed, 'trashed')}
      </div>

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        isLoading={confirmConfig.isLoading}
      />
    </div>
  );
}
