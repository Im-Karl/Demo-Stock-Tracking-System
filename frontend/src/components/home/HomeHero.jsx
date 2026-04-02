import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Newspaper,
  Users,
  ArrowRight,
  Activity,
  Brain,
  Building,
  Network,
} from "lucide-react";
import Button from "../base-ui/Button";
import StatsCard from "./StatsCard";

export default function HomeHero() {
  const features = [
    {
      title: "Dữ liệu Realtime",
      desc: "Theo dõi biến động thị trường theo từng giây",
      icon: Activity,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Tin tức chọn lọc",
      desc: "Tổng hợp & phân tích từ nhiều nguồn đáng tin cậy",
      icon: Newspaper,
      color: "from-violet-500 to-purple-500",
    },
    {
      title: "Cộng đồng đầu tư",
      desc: "Chia sẻ quan điểm, học hỏi từ người cùng chí hướng",
      icon: Users,
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "Gợi ý thông minh",
      desc: "Hỗ trợ ra quyết định dựa trên dữ liệu & xu hướng",
      icon: Brain,
      color: "from-orange-500 to-amber-500",
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto px-6 py-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            Nắm bắt nhịp đập <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-primary from-secondary pr-10">
              tài chính số
            </span>
          </h1>

          <p className="text-lg opacity-75 mb-8 leading-relaxed">
            Hệ thống theo dõi đánh giá chứng khoán thời gian thực, tổng hợp tin
            tức tự động và cộng đồng nhà đầu tư thông minh. Tất cả trong một nền
            tảng duy nhất.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button render={<a href="/stock" />}>
              <TrendingUp size={20} />
              Xem thị trường
            </Button>
            <Button render={<a href="/news" />} intent="neutral">
              <Newspaper size={20} />
              Đọc tin tức
            </Button>
          </div>

          <StatsCard
            stats={[
              {
                stat: "25+",
                label: "Ngân hàng",
                Icon: Building,
                className: "bg-sky-500 text-white",
              },
              {
                stat: "0.5s",
                label: "Độ trễ data",
                Icon: Network,
                className: "bg-emerald-500 text-white",
              },
              {
                stat: "24/7",
                label: "Cập nhật tin",
                Icon: Newspaper,
                className: "bg-amber-500 text-white",
              },
            ]}
          />
        </motion.div>

        {/* --- RIGHT SIDE: ANIMATED CHART --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Glass Card Container */}
          <div className="relative z-10 p-8">
            {/* SVG Chart Animation */}
            <svg viewBox="0 0 400 300" className="w-full h-auto">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-primary)"
                    stopOpacity="0.5"
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-primary)"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[50, 100, 150, 200, 250].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="400"
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  strokeDasharray="4 4"
                />
              ))}

              {/* The Area under the line */}
              <motion.path
                d="M 0 250 Q 50 200 100 220 T 200 150 T 300 100 T 400 50 V 300 H 0 Z"
                fill="url(#chartGradient)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />

              <motion.path
                d="M 0 250 Q 50 200 100 220 T 200 150 T 300 100 T 400 50"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />

              {[
                { cx: 100, cy: 220, delay: 0.5 },
                { cx: 200, cy: 150, delay: 1.0 },
                { cx: 300, cy: 100, delay: 1.5 },
                { cx: 400, cy: 50, delay: 2.0 },
              ].map((point, i) => (
                <motion.circle
                  key={i}
                  cx={point.cx}
                  cy={point.cy}
                  r="6"
                  fill="#fff"
                  stroke="var(--color-primary)"
                  strokeWidth="3"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: point.delay, duration: 0.5 }}
                />
              ))}

              {/* <motion.g
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <rect
                  x="280"
                  y="20"
                  width="100"
                  height="40"
                  rx="20"
                  fill="#10b981"
                />
                <text
                  x="330"
                  y="45"
                  textAnchor="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                >
                  BUY NOW
                </text>
              </motion.g> */}
            </svg>

            {/* Floating Cards trang trí */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute bottom-6 left-20 bg-primary/33 p-3 rounded flex items-center gap-3 border-3 border-b-8 border-primary"
            >
              <div className="w-12 h-12 bg-white rounded flex items-center justify-center text-green-600">
                <ArrowRight className="-rotate-45" size={32} />
              </div>
              <div className="-space-y-1">
                <p className="font-bold">Lợi nhuận tuần</p>
                <p className="text-2xl font-bold text-green-500">+12.5%</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <section className="relative py-28 bg-white dark:bg-neutral-900 overflow-hidden">
        {/* Ambient light */}
        <div className="absolute inset-0 pointer-events-none">
          {/* <div className="absolute top-1/3 left-[-10%] w-[400px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full" /> */}
          {/* <div className="absolute bottom-0 right-[-10%] w-[400px] h-[400px] bg-violet-500/20 blur-[120px] rounded-full" /> */}
        </div>

        <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT – CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Thị trường không thiếu cơ hội — <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                chỉ thiếu thông tin đúng lúc
              </span>
            </h2>

            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 max-w-xl">
              Chứng khoán Việt Nam biến động liên tục, tin tức tràn lan khiến
              nhiều nhà đầu tư ra quyết định theo cảm xúc và bỏ lỡ xu hướng quan
              trọng.
            </p>

            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
              FinSavvy được xây dựng như một trung tâm phân tích và trao đổi,
              nơi dữ liệu realtime, tin tức chọn lọc và góc nhìn cộng đồng giúp
              bạn hiểu rõ thị trường trước khi hành động.
            </p>
          </motion.div>

          {/* RIGHT – HIGHLIGHT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((item, i) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="group p-6 rounded-2xl bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl
                            border border-neutral-200 dark:border-neutral-700
                            hover:shadow-2xl hover:-tranneutral-y-1 transition-all"
                >
                  {/* ICON */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color}
                                flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <Icon className="text-white" size={26} />
                  </div>

                  <h4 className="text-lg font-bold mb-2">{item.title}</h4>

                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
