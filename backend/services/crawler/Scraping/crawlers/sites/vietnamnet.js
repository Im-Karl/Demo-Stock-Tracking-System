const { extractWithConfig } = require('../baseExtractor');

const config = {
  name: 'Vietnamnet',
  sapo: 'h2.content-detail-sapo',
  author: '.article-detail-author__info .name a',
  article: '#maincontent',
  articleRemove: ['figure', 'figcaption', "[id^='COMPONENT']", '.adbro', '.box-related'],
};

module.exports.extract = (url) => extractWithConfig(url, config);
