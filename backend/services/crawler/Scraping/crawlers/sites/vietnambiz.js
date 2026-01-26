const { extractWithConfig } = require("../baseExtractor");

const config = {
  name: "Vietnambiz",
  sapo: "div[data-role='sapo']",
  author: "p[data-role='author']",
  article: "div[data-role='content']",
  articleRemove: [
    "figure",
    "figcaption",
    "img",
    ".box-related",
    ".VCSortableInPreviewMode",
  ],
};

module.exports.extract = (url) =>
  extractWithConfig(url, config);
