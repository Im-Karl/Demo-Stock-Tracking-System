import { motion } from 'framer-motion';
import { RiFireFill, RiNewsFill, RiTeamFill, RiLightbulbFill, RiSparklingFill, RiChatSmile3Fill } from 'react-icons/ri';
import Button from '../base-ui/Button';
import FeatureCard from '../base-ui/FeatureCard';
import ZippingGrid from './ZippingGrid';

export default function HomeHero() {
  const features = [
    {
      title: 'Dữ liệu thời gian thực',
      desc: 'Giá cả thị trường, xu hướng, và các tin tức liên quan được cập nhật liên tục',
      icon: RiFireFill,
      color: 'text-grey-800 dark:text-grey-300 bg-primary-100 dark:bg-primary-900/50',
    },
    {
      title: 'Tin tức chọn lọc',
      desc: 'Tổng hợp & phân tích từ nhiều nguồn đáng tin cậy',
      icon: RiNewsFill,
      color: 'text-grey-800 dark:text-grey-300 bg-secondary-100 dark:bg-secondary-900/50',
    },
    {
      title: 'Cộng đồng đầu tư',
      desc: 'Chia sẻ quan điểm, học hỏi từ người cùng chí hướng',
      icon: RiTeamFill,
      color: 'text-grey-800 dark:text-grey-300 bg-emerald-100 dark:bg-emerald-900/50',
    },
    {
      title: 'Gợi ý thông minh',
      desc: 'Hỗ trợ ra quyết định dựa trên dữ liệu & xu hướng',
      icon: RiLightbulbFill,
      color: 'text-grey-800 dark:text-grey-300 bg-amber-100 dark:bg-amber-900/50',
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-grey-300 dark:bg-grey-700/50">
      {/* Animated Grid Background */}
      <ZippingGrid dotCount={20} trailLength={10} moveInterval={50} cellSize={30} />
      <div className="absolute inset-0 bg-white/40 dark:bg-black/60 pointer-events-none" />

      <div className="container mx-auto p-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-grey-900 dark:text-white font-heading">
            Đánh giá thông minh <br className="hidden lg:block" /> thị trường Việt Nam
          </h1>

          <ul className="text-lg mb-8 leading-12 text-grey-700 dark:text-white/90">
            {[
              {
                Icon: RiSparklingFill,
                className: 'text-primary-400',
                desc: 'Dự đoán giá và cảnh báo bất thường sử dụng AI',
              },
              {
                Icon: RiNewsFill,
                className: 'text-secondary-400',
                desc: 'Tổng hợp tin tức mới nhất từ các nguồn uy tín',
              },
              {
                Icon: RiChatSmile3Fill,
                className: 'text-emerald-400',
                desc: 'Xây dựng cộng đồng đam mê tài chính',
              },
            ].map((KeyPoint, i) => (
              <li key={i} className="flex items-center gap-4">
                <KeyPoint.Icon size={32} className={KeyPoint.className} />
                {KeyPoint.desc}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-4">
            <Button render={<a href="/stock" />} intent="primary" size="lg">
              Xem thị trường
            </Button>
            <Button render={<a href="/news" />} intent="neutral" size="lg">
              Đọc tin tức
            </Button>
          </div>
        </motion.div>

        {/* Right side - decorative placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:block"
        />
      </div>

      <section className="relative py-20 bg-grey-50 dark:bg-black overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 font-heading text-grey-900 dark:text-grey-50">
              FinSavvy là gì?
            </h2>
            <p className="text-lg text-grey-600 dark:text-grey-400">
              FinSavvy là hệ thống phân tích và đánh giá thị trường toàn diện, bao gồm dự đoán giá cổ phiếu, cảnh báo
              bất thường, thu thập thông tin từ các trang báo lớn, và cùng nhau chia sẻ tại qua các bài viết.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((item, i) => (
              <FeatureCard
                key={i}
                as={motion.div}
                direction="vertical"
                icon={item.icon}
                colorClass={item.color}
                title={item.title}
                desc={item.desc}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
