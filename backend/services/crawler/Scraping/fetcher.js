const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const cheerio = require('cheerio');
const Parser = require('rss-parser');
const rssSources = require('./rssSources');
const rssSourcesWorld = require('./rssSourcesWorld');
const { decode } = require('html-entities');
const db = require('./db');

// import crawler router
const { extractArticle } = require('./crawlers');

// vietstock keeps its own system
const { crawlVietstockCategory } = require('./vietstockCrawler');

db.configure('busyTimeout', 5000);
const parser = new Parser();

// Khởi tạo DB
db.serialize(() => {
  db.run(`DROP TABLE IF EXISTS articles;`);
  db.run(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      url TEXT UNIQUE,
      image TEXT,
      published TEXT,
      content TEXT,
      source TEXT,
      author TEXT
    )
  `);
});

// fallback: extract image nếu crawler không trả ảnh
async function extractImageFallback(url) {
  try {
    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    const $ = cheerio.load(data);

    let img =
      $("meta[property='og:image']").attr('content') ||
      $('img[data-src]').attr('data-src') ||
      $('img').first().attr('src');

    if (img?.startsWith('//')) img = 'https:' + img;
    return img || null;
  } catch {
    return null;
  }
}

async function fetchRSS() {
  try {
    console.log('=== Fetching Vietstock (HTML crawler)... ===');

    // --- 1) Crawl Vietstock ---
    const vietstockCategories = ['https://vietstock.vn/chung-khoan.htm', 'https://vietstock.vn/doanh-nghiep.htm'];

    for (const category of vietstockCategories) {
      const articles = await crawlVietstockCategory(category);

      const stmt = db.prepare(`
        INSERT OR IGNORE INTO articles 
          (title, url, image, published, content, source, author)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      articles.forEach((a) => stmt.run(a.title, a.url, a.image, a.published, a.content, a.source, a.author || ''));

      stmt.finalize();
      console.log(`Inserted ${articles.length} Vietstock articles from ${category}`);
    }

    // --- 2) Crawl RSS Sources ---
    console.log('=== Fetching RSS sources... ===');

    await Promise.all(
      rssSources.map(async (sourceItem) => {
        console.log(`Source: ${sourceItem.source}`);

        await Promise.all(
          sourceItem.urls.map(async (rssUrl) => {
            console.log(`  → Fetching RSS: ${rssUrl}`);

            try {
              const feed = await parser.parseURL(rssUrl);

              const articlesData = await Promise.all(
                feed.items.map(async (item) => {
                  const title = decode(item.title || '').trim();
                  const link = item.link;
                  const published = item.pubDate ? new Date(item.pubDate).toISOString().split('T')[0] : '';

                  const { content, author, image: crawlerImage } = await extractArticle(link);

                  const image = item.enclosure?.url || crawlerImage || (await extractImageFallback(link));

                  return [title, link, image, published, content, sourceItem.source, author];
                }),
              );

              const stmt = db.prepare(`
                INSERT OR IGNORE INTO articles 
                (title, url, image, published, content, source, author)
                VALUES (?, ?, ?, ?, ?, ?, ?)
              `);

              articlesData.forEach((a) => stmt.run(...a));
              stmt.finalize();

              console.log(`  → Inserted ${articlesData.length} articles`);
            } catch (err) {
              console.log('RSS Fetch Error:', rssUrl, err.message);
            }
          }),
        );
      }),
    );
  } catch (err) {
    console.log('Fetcher error:', err.message);
  }
}

module.exports = { fetchRSS };
