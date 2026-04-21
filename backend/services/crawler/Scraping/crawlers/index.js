const cafef = require('./sites/cafef');
const vneconomy = require('./sites/vneconomy');
const vnexpress = require('./sites/vnexpress');
const vietnamnet = require('./sites/vietnamnet');
const vietnambiz = require('./sites/vietnambiz');
const tuoitre = require('./sites/tuoitre');

function getDomain(url) {
  return new URL(url).hostname.replace(/^www\./, '');
}

const map = {
  'cafef.vn': cafef,
  'vneconomy.vn': vneconomy,
  'vnexpress.net': vnexpress,
  'vietnamnet.vn': vietnamnet,
  'vietnambiz.vn': vietnambiz,
  'tuoitre.vn': tuoitre,
};

async function extractArticle(url) {
  const domain = getDomain(url);
  const crawler = map[domain];

  if (!crawler) {
    console.log('No crawler found for:', domain);
    return { content: '', author: '', image: null };
  }

  return crawler.extract(url);
}

module.exports = { extractArticle };
