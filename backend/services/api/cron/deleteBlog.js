const cron = require('node-cron');
const Blog = require('../models/Blog.js');

const setupDeleteBlogCron = () => {
  cron.schedule(
    '0 0 * * *',
    async () => {
      console.log('[Cron] Bắt đầu quét dọn thùng rác...');

      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const result = await Blog.deleteMany({
          isDeleted: true,
          deletedAt: { $lte: thirtyDaysAgo },
        });

        if (result.deletedCount > 0) {
          console.log(`[Cron] Đã xóa vĩnh viễn ${result.deletedCount} bài viết cũ quá 30 ngày.`);
        } else {
          console.log('[Cron] Thùng rác sạch sẽ, không có gì để xóa.');
        }
      } catch (error) {
        console.error('Lỗi Cronjob:', error);
      }
    },
    {
      scheduled: true,
      timezone: 'Asia/Ho_Chi_Minh',
    },
  );
};

module.exports = setupDeleteBlogCron;
