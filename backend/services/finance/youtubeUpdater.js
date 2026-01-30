const Parser = require("rss-parser");
const Company = require("./models/Company");

const parser = new Parser();

const fetchLatestVideos = async () => {
  console.log("Bắt đầu quét Youtube...");
  
  try {
    const companies = await Company.find({ youtubeChannelId: { $exists: true, $ne: "" } });

    for (const company of companies) {
      try {
        const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${company.youtubeChannelId}`;
        const feed = await parser.parseURL(feedUrl);

        if (feed.items && feed.items.length > 0) {
          const latestVideo = feed.items[0];
          
          const videoId = latestVideo.id.split(":")[2] || latestVideo.link.split("v=")[1];

          if (videoId && company.latestVideoId !== videoId) {
            company.latestVideoId = videoId;
            await company.save();
            console.log(`[${company.symbol}] Update video mới: ${videoId}`);
          }
        }
      } catch (err) {
        console.error(`Lỗi quét kênh của ${company.symbol}: ${err.message}`);
      }
    }
    console.log("Hoàn tất quét Youtube.");
  } catch (err) {
    console.error("Lỗi chung Youtube Updater:", err);
  }
};

module.exports = { fetchLatestVideos };