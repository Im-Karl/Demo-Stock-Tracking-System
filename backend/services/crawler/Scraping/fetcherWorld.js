const sqlite3 = require("sqlite3").verbose();
const Parser = require("rss-parser");
const { decode } = require("html-entities");
const rssSources = require("./rssSourcesWorld");
const db = require("./db");
db.configure('busyTimeout', 5000); 
const parser = new Parser();

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS articles_world (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      url TEXT UNIQUE,
      image TEXT,
      published TEXT,
      content TEXT,
      source TEXT
    )
  `);
});

async function fetchRSS() {
  console.log("=== Fetching WORLD RSS (RSS only) ===");

  for (const source of rssSources) {
    for (const rssUrl of source.urls) {
      try {
        console.log(`→ ${source.source}: ${rssUrl}`);
        const feed = await parser.parseURL(rssUrl);

        const stmt = db.prepare(`
          INSERT OR IGNORE INTO articles_world
          (title, url, image, published, content, source)
          VALUES (?, ?, ?, ?, ?, ?)
        `);

        feed.items.forEach((item) => {
          const title = decode(item.title || "").trim();
          const link = item.link;

          const published = item.pubDate
            ? new Date(item.pubDate).toISOString().split("T")[0]
            : "";

          const content = decode(
            item.contentSnippet ||
            item.content ||
            ""
          ).trim();

          const image =
            item.enclosure?.url ||
            item["media:content"]?.url ||
            item["media:thumbnail"]?.url ||
            null;

          stmt.run(
            title,
            link,
            image,
            published,
            content,
            source.source
          );
        });

        stmt.finalize();
        console.log(`Inserted ${feed.items.length} articles`);
      } catch (err) {
        console.error("World RSS error:", rssUrl, err.message);
      }
    }
  }
}

module.exports = { fetchRSS };
