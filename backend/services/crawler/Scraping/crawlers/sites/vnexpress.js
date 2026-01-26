const axios = require("axios");
const cheerio = require("cheerio");
const { extractWithConfig } = require("../baseExtractor");

function clean(t = "") {
  return t.replace(/\s+/g, " ").trim();
}

async function extract(url) {
  const result = await extractWithConfig(url, {
    name: "VnExpress",
    sapo: "p.description",
    article: "article.fck_detail",
    contentTags: "p.Normal",
    articleRemove: ["figure", ".box-tinlienquanv2"],
  });

  // parse author đặc thù
  try {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const $ = cheerio.load(data);

    let author = "";
    $("p.Normal[style*='text-align:right']").each((_, el) => {
      const strong = $(el).find("strong").first().text();
      if (strong) author = clean(strong);
    });

    if (!author) {
      const text = $("p.author_mail").text();
      if (text) author = clean(text);
    }

    if (!author) {
      $("p.Normal[align='right']").each((_, el) => {
        const text = $(el).text();
        if (text) author = clean(text);
      });
    }

    return { ...result, author };
  } catch {
    return result;
  }
}

module.exports = { extract };
