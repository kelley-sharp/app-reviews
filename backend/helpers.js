const fetch = require("node-fetch");
const fs = require("fs");

async function getReviewsPageForAppId({ appId, page = 1 }) {
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

async function collectReviewsFromLast48Hours({ appId }) {
  let reviews = [];
  const now = new Date();
  const fortyEightHoursAgo = now.setHours(now.getHours() - 48);

  let isComplete = false;
  let page = 1;

  while (!isComplete) {
    const reviewPage = await getReviewsPageForAppId({ appId, page });

    // find the index of the most recent review before 48 hours ago
    // that's where we need to stop paginating
    const lastReviewIndex = reviewPage.findIndex(
      (review) => review.timeSubmitted < fortyEightHoursAgo
    );
    if (lastReviewIndex === -1) {
      reviews = reviews.concat(reviewPage);
      page += 1;
    } else {
      reviews = reviews.concat(reviewPage.slice(0, lastReviewIndex));
      isComplete = true;
    }
  }

  return reviews;
}

function writeReviewsToFile({ reviews, appId }) {
  fs.writeFile(
    `${__dirname}/data/reviews/${appId}.json`,
    JSON.stringify(reviews),
    (err) => {
      if (err) {
        console.log(`There was an error writing to file: ${err.message}`);
      }
    }
  );
}

module.exports = {
  collectReviewsFromLast48Hours,
  writeReviewsToFile,
};
