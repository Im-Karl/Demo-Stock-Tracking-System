const { extractWithConfig } = require("../baseExtractor");

const config = {
  name: "CafeF",
  article: ".detail-content, .ttct-body",
  contentTags: "p, h2, h3, li, strong",
  author: ".author, .author-info",
};

module.exports.extract = (url) =>
  extractWithConfig(url, config);
