const { extractWithConfig } = require("../baseExtractor");

const config = {
  name: "VnEconomy",
  sapo: "div[data-field='sapo']",
  article: "div[data-field='body']",
  contentTags: "p, h2, h3, li, strong",
  author: "p.name[data-field='author']",
};

module.exports.extract = (url) =>
  extractWithConfig(url, config);
