const fetch = require("node-fetch");
const fs = require("fs");

async function getReviewsPageForAppId({ appId, page = 1 }) {
  console.log({ appId, page });

  function mapEntryToReview(entry) {
    return {
      id: entry.id.label,
      content: entry.content.label,
      author: entry.author.name.label,
      score: entry["im:rating"].label,
      timeSubmitted: new Date(entry.updated.label),
    };
  }

  return fetch(
    `https://itunes.apple.com/us/rss/customerreviews/id=${appId}/sortBy=mostRecent/page=${page}/json`
  )
    .then((res) => res.json())
    .then((data) => data.feed.entry.map(mapEntryToReview));
}

module.exports = {
  getReviewsPageForAppId,
};
