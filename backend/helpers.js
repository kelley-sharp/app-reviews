const fetch = require("node-fetch");

async function getRssFeedData({ appId }) {
  return fetch(
    `https://itunes.apple.com/us/rss/customerreviews/id=${appId}/sortBy=mostRecent/page=1/json`
  ).then((res) => res.json());
}

module.exports = {
  getRssFeedData,
};
