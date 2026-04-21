module.exports = [
  {
    source: 'CafeF',
    reliability: 1,
    urls: [
      // "https://cafef.vn/home.rss",
      'https://cafef.vn/thi-truong-chung-khoan.rss',
      // "https://cafef.vn/bat-dong-san.rss",
      'https://cafef.vn/thi-truong-tai-chinh.rss',
      // "https://cafef.vn/vi-mo-dau-tu.rss",
      'https://cafef.vn/tai-chinh-ngan-hang.rss',
    ],
  },
  {
    source: 'VnEconomy',
    reliability: 1,
    urls: [
      'https://vneconomy.vn/rss.htm',
      'https://vneconomy.vn/kinh-te-so.rss',
      'https://vneconomy.vn/chung-khoan.rss',
      'https://vneconomy.vn/tai-chinh.rss',
      'https://vneconomy.vn/doanh-nghiep.rss',
    ],
  },
  // {
  //   source: "Vietstock",
  //   reliability: 1,
  //   urls: [
  //     "https://vietstock.vn/rss/home.rss",
  //     "https://vietstock.vn/rss/chung-khoan.rss",
  //     "https://vietstock.vn/rss/kinh-te-vi-mo.rss", // không còn sử dụng rss
  //     "https://vietstock.vn/rss/tai-chinh-ngan-hang.rss",
  //     "https://vietstock.vn/rss/doanh-nghiep.rss",
  //   ],
  // },

  {
    source: 'VnExpress',
    reliability: 2,
    urls: [
      'https://vnexpress.net/rss/kinh-doanh.rss',
      'https://vnexpress.net/rss/kinh-doanh/chung-khoan.rss',
      'https://vnexpress.net/rss/kinh-doanh/quoc-te.rss',
      // "https://vnexpress.net/rss/thoi-su.rss",
      'https://vnexpress.net/rss/so-hoa.rss',
    ],
  },

  {
    source: 'TuoiTre',
    reliability: 4,
    urls: [
      'https://tuoitre.vn/rss/kinh-doanh.rss',
      'https://tuoitre.vn/rss/tai-chinh.rss',
      // "https://tuoitre.vn/rss/bat-dong-san.rss",
      // "https://tuoitre.vn/rss/kinh-te-chinh-tri.rss",
    ],
  },

  {
    source: 'Vietnamnet',
    reliability: 3,
    urls: [
      'https://vietnamnet.vn/rss/kinh-doanh.rss',
      'https://vietnamnet.vn/rss/tai-chinh.rss',
      'https://vietnamnet.vn/rss/chung-khoan.rss',
      'https://vietnamnet.vn/rss/bat-dong-san.rss',
      'https://vietnamnet.vn/rss/thoi-su.rss',
    ],
  },

  {
    source: 'VietnamBiz',
    reliability: 4,
    urls: [
      'https://vietnambiz.vn/kinh-te-vi-mo.rss',
      'https://vietnambiz.vn/chung-khoan.rss',
      'https://vietnambiz.vn/tai-chinh-ngan-hang.rss',
      'https://vietnambiz.vn/doanh-nghiep.rss',
      'https://vietnambiz.vn/hang-hoa.rss',
    ],
  },
];
