const fetch = require("node-fetch");
const fs = require("fs");

/**
 * Get a single page of reviews from the app store. Defaults to page 1.
 */
async function getReviewsPageForAppId({ appId, page = 1 }) {
  // helper function to more cleanly flatten / map the entry content
  function mapEntryToReview(entry) {
    return {
      id: entry.id.label,
      content: entry.content.label,
      author: entry.author.name.label,
      score: Number(entry["im:rating"].label),
      timeSubmitted: new Date(entry.updated.label),
    };
  }

  const response = await fetch(
    `https://itunes.apple.com/us/rss/customerreviews/id=${appId}/sortBy=mostRecent/page=${page}/json`
  );
  const responseJson = await response.json();
  return responseJson.feed.entry.map(mapEntryToReview);
}

/**
 * Given an app ID, return all of the reviews from the past 48 hours.
 */
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

function readReviewsFromFile({ appId }) {
  return JSON.parse(fs.readFileSync(`${__dirname}/data/reviews/${appId}.json`));
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

async function pollForReviews({ appId, pollingIntervalMs }) {
  console.log(
    `Started polling for reviews in last 48 hours for appId ${appId}`
  );

  const reviews = await collectReviewsFromLast48Hours({ appId });
  writeReviewsToFile({ reviews, appId });

  setInterval(async () => {
    console.log(`Polling again for ${appId}.`);
    const reviews = await collectReviewsFromLast48Hours({ appId });
    writeReviewsToFile({ reviews, appId });
  }, pollingIntervalMs);
}

module.exports = {
  collectReviewsFromLast48Hours,
  writeReviewsToFile,
  pollForReviews,
  readReviewsFromFile,
};
