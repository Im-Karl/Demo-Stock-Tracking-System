module.exports = [
  {
    source: "Reuters Business & Markets",
    reliability: 1,
    urls: [
      "https://feeds.reuters.com/reuters/businessNews",
      "https://feeds.reuters.com/reuters/marketsNews",
    ],
  },
  {
    source: "Financial Times",
    reliability: 1,
    urls: [
      "https://ft.com/rss/home",
      "https://ft.com/world?format=rss",
      "https://ft.com/global-economy?format=rss",
      "https://ft.com/emerging-markets?format=rss",
    ],
  },
  {
    source: "The Wall Street Journal (WSJ)",
    reliability: 1,
    urls: ["https://feeds.a.dj.com/rss/RSSMarketsMain.xml"],
  },
  {
    source: "BBC Business",
    reliability: 1,
    urls: ["http://feeds.bbci.co.uk/news/business/rss.xml"],
  },
  {
    source: "The Economist",
    reliability: 1,
    urls: ["https://www.economist.com/business/rss.xml"],
  },

  {
    source: "CNBC",
    reliability: 2,
    urls: [
      "https://www.cnbc.com/id/100003114/device/rss/rss.html",
      "https://www.cnbc.com/id/19832390/device/rss/rss.html",
    ],
  },
  {
    source: "Yahoo Finance",
    reliability: 2,
    urls: [
      "https://feeds.finance.yahoo.com/rss/2.0/headline?s=MSFT&region=US&lang=en-US",
      "https://feeds.finance.yahoo.com/rss/2.0/headline?s=AAPL&region=US&lang=en-US",
    ],
  },
  {
    source: "MarketWatch",
    reliability: 2,
    urls: [
      "https://rss.feedspot.com/marketwatch_rss_feeds/",
      "https://feeds.content.dowjones.com/rss/MarketWatch/marketpulse",
    ],
  },
  {
    source: "Nasdaq News",
    reliability: 2,
    urls: ["https://rsshub.app/nasdaq/news"],
  },

  {
    source: "Seeking Alpha",
    reliability: 3,
    urls: ["https://seekingalpha.com/feed.xml"],
  },
  {
    source: "Fortune",
    reliability: 3,
    urls: ["https://fortune.com/feed/"],
  },
  {
    source: "South China Morning Post",
    reliability: 3,
    urls: ["https://www.scmp.com/rss/92/feed"],
  },
  {
    source: "Business Insider - Finance",
    reliability: 3,
    urls: ["https://www.businessinsider.com/finance/rss"],
  },

  {
    source: "Trading Economics News",
    reliability: 4,
    urls: ["https://tradingeconomics.com/rss/news"],
  },
  {
    source: "The Street",
    reliability: 4,
    urls: ["https://www.thestreet.com/feeds/rss/markets"],
  },
  {
    source: "FT Alphaville Blog",
    reliability: 4,
    urls: ["https://ftalphaville.ft.com/feed/"],
  },

  {
    source: "Investing.com",
    reliability: 5,
    urls: [
      "https://www.investing.com/rss/news_25.rss",
      "https://www.investing.com/rss/stock_market_news.rss",
      "https://www.investing.com/rss/equities.rss",
      "https://www.investing.com/rss/most-popular-news.rss",
      "https://www.investing.com/rss/stock-market-analysis.rss",
      "https://www.investing.com/rss/technical-analysis.rss",
    ],
  },
];
