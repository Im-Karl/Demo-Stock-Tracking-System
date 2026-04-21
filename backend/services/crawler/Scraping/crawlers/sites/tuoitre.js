const { extractWithConfig } = require('../baseExtractor');

const config = {
  name: 'TuoiTre',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120',
    Referer: 'https://tuoitre.vn/',
  },
  sapo: "h2.detail-sapo[data-role='sapo']",
  author: 'div.author-info a.name',
  article: "div.detail-content[data-role='content']",
  contentTags: 'p, h2',
  articleRemove: [
    'figure',
    '.VCSortableInPreviewMode',
    '#InreadPc',
    '.readmore-body-box',
    "[type='RelatedNewsBox']",
    "[type='RelatedOneNews']",
  ],
};

module.exports.extract = (url) => extractWithConfig(url, config);
