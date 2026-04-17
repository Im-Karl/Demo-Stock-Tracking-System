import { motion } from "framer-motion";
import {
  RiFireFill,
  RiNewsFill,
  RiTeamFill,
  RiLightbulbFill,
  RiSparklingFill,
  RiChatSmile3Fill,
} from "react-icons/ri";
import Button from "../base-ui/Button";

export default function HomeHero() {
  const features = [
    {
      title: "Dữ liệu thời gian thực",
      desc: "Giá cả thị trường, xu hướng, và các tin tức liên quan được cập nhật liên tục",
      icon: RiFireFill,
      color:
        "text-neutral-800 dark:text-neutral-300 bg-blue-100 dark:bg-blue-900/50",
      border: "border-blue-300 dark:border-blue-700",
    },
    {
      title: "Tin tức chọn lọc",
      desc: "Tổng hợp & phân tích từ nhiều nguồn đáng tin cậy",
      icon: RiNewsFill,
      color:
        "text-neutral-800 dark:text-neutral-300 bg-violet-100 dark:bg-violet-900/50",
      border: "border-violet-300 dark:border-violet-700",
    },
    {
      title: "Cộng đồng đầu tư",
      desc: "Chia sẻ quan điểm, học hỏi từ người cùng chí hướng",
      icon: RiTeamFill,
      color:
        "text-neutral-800 dark:text-neutral-300 bg-emerald-100 dark:bg-emerald-900/50",
      border: "border-emerald-300 dark:border-emerald-700",
    },
    {
      title: "Gợi ý thông minh",
      desc: "Hỗ trợ ra quyết định dựa trên dữ liệu & xu hướng",
      icon: RiLightbulbFill,
      color:
        "text-neutral-800 dark:text-neutral-300 bg-orange-100 dark:bg-orange-900/50",
      border: "border-orange-300 dark:border-orange-700",
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1521696328906-2b116060d0b5"
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container mx-auto p-10 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-white">
            Đánh giá thông minh thị trường Việt Nam
          </h1>

          <ul className="text-lg mb-8 leading-12 text-white/90">
            {[
              {
                Icon: RiSparklingFill,
                className: "text-yellow-400",
                desc: "Dự đoán giá và cảnh báo bất thường sử dụng AI",
              },
              {
                Icon: RiNewsFill,
                className: "text-red-400",
                desc: "Tổng hợp tin tức mới nhất từ các nguồn uy tín",
              },
              {
                Icon: RiChatSmile3Fill,
                className: "text-lime-400",
                desc: "Xây dựng cộng đồng đam mê tài chính",
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
            <Button render={<a href="/news" />} size="lg">
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

      <section className="relative py-12 bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              FinSavvy là gì?
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              FinSavvy là hệ thống phân tích và đánh giá thị trường toàn diện,
              bao gồm dự đoán giá cổ phiếu, cảnh báo bất thường, thu thập thông
              tin từ các trang báo lớn, và cùng nhau chia sẻ tại qua các bài
              viết.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((item, i) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 p-6 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                >
                  <div
                    className={`w-12 h-12 flex items-center justify-center shrink-0 border ${item.color} ${item.border}`}
                  >
                    <Icon size={24} />
                  </div>

                  <div>
                    <h4 className="text-xl font-bold -mt-1 mb-1">
                      {item.title}
                    </h4>

                    <p className="text-neutral-600 dark:text-neutral-400">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
