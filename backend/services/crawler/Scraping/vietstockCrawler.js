const axios = require("axios");
const cheerio = require("cheerio");

async function fetchHTML(url) {
  try {
    const { data } = await axios.get(url, {
      timeout: 15000,
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    return cheerio.load(data);
  } catch (e) {
    console.error("fetchHTML error:", url, e.message);
    return null;
  }
}

function cleanText(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/&nbsp;/g, " ")
    .trim();
}

async function crawlVietstockCategory(categoryUrl, limit = 40) {
  const $ = await fetchHTML(categoryUrl);
  if (!$) return [];

  const links = [];

  $(".single_post a").each((i, el) => {
    let href = $(el).attr("href");
    if (!href) return;

    if (!href.includes(".htm")) return;

    if (href.startsWith("/")) {
      href = "https://vietstock.vn" + href;
    }

    links.push(href);
  });

  const uniqueLinks = [...new Set(links)].slice(0, limit);

  const articles = [];

  for (const url of uniqueLinks) {
    const article = await crawlVietstockArticle(url);
    if (article) articles.push(article);
  }

  return articles;
}

async function crawlVietstockArticle(url) {
  const $ = await fetchHTML(url);
  if (!$) return null;

  const title = cleanText($("h1").first().text());
  const contentBlock = $("#vst_detail");

  if (!contentBlock.length) {
    console.warn("No content block:", url);
    return null;
  }

  contentBlock.find("script, style, iframe").remove();

  // --- Lấy author trước ---
  const authorEl = contentBlock.find("p.pAuthor a").first();
  const author = authorEl.length ? cleanText(authorEl.text()) : "";

  const rawContent = contentBlock
    .find("p.pHead, p.pBody")
    .map((i, el) => $(el).text())
    .get()
    .join(". ");
  const content = cleanText(rawContent);

  // --- Lấy ngày xuất bản nếu có ---
  let published = "";
  const dateEl = $(".dateNewBlock .datenew").first();
  if (dateEl.length) {
    const timeText = dateEl.text().trim(); // "14-12-2025 21:32:00+07:00"
    // Chia nhỏ và lấy ngày tháng
    const match = timeText.match(/(\d{2})-(\d{2})-(\d{4})/);
    if (match) {
      const [, dd, MM, yyyy] = match;
      published = `${yyyy}-${MM}-${dd}`; // "2025-12-14"
    }
  }

  let image = null;
  const contentImg = contentBlock.find("img").first();
  if (contentImg.length) {
    image = contentImg.attr("src") || contentImg.attr("data-src") || null;
  } else {
    const pageImg = $("img").first();
    if (pageImg.length) {
      image = pageImg.attr("src") || pageImg.attr("data-src") || null;
    }
  }

  return {
    title,
    url,
    image,
    published,
    content,
    source: "Vietstock",
    author,
  };
}

module.exports = {
  crawlVietstockCategory,
  crawlVietstockArticle,
};
