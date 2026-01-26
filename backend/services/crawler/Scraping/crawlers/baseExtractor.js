// baseExtractor.js
const axios = require("axios");
const cheerio = require("cheerio");

function clean(t = "") {
  return t.replace(/\s+/g, " ").trim();
}

async function extractWithConfig(url, config) {
  try {
    const { data } = await axios.get(url, {
      headers: config.headers || { "User-Agent": "Mozilla/5.0" },
      timeout: config.timeout || 15000,
    });

    const $ = cheerio.load(data, { decodeEntities: false });

    // remove global junk
    $("script, style, iframe, noscript").remove();

    // remove custom junk
    if (config.remove?.length) {
      config.remove.forEach(sel => $(sel).remove());
    }

    /* ===== SAPO ===== */
    let sapo = "";
    if (config.sapo) {
      sapo = clean($(config.sapo).first().text());
    }

    /* ===== AUTHOR ===== */
    let author = "";
    if (config.author) {
      author = clean($(config.author).first().text());
    }

    /* ===== CONTENT ===== */
    let body = "";
    if (config.article) {
      const article = $(config.article);

      if (config.articleRemove?.length) {
        config.articleRemove.forEach(sel => article.find(sel).remove());
      }

      body = article
        .find(config.contentTags || "p")
        .map((_, el) => clean($(el).text()))
        .get()
        .filter(Boolean)
        .join(". ");
    }

    const content = [sapo, body].filter(Boolean).join(". ");

    /* ===== IMAGE ===== */
    let image =
      $("meta[property='og:image']").attr("content") ||
      $(config.image || "img").first().attr("data-src") ||
      $(config.image || "img").first().attr("src");

    if (image?.startsWith("//")) image = "https:" + image;

    return { content, author, image };
  } catch (err) {
    console.log(`${config.name || "Extractor"} error:`, err.message);
    return { content: "", author: "", image: null };
  }
}

module.exports = { extractWithConfig };
