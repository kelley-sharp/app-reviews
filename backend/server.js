const http = require("http");
const {
  collectReviewsFromLast48Hours,
  writeReviewsToFile,
  pollForReviews,
  readReviewsFromFile,
} = require("./helpers");

const PORT = 3001;

// Airbnb App - Change me if you want to generate files for different apps
const DEFAULT_APP_ID = "401626263";

// Poll Every Five Minutes! Change me if you want to see polling in action
const POLLING_INTERVAL_MS = 1000 * 60 * 5;

// create a server with a /reviews/:appId endpoint
http
  .createServer(async function (req, res) {
    res.setHeader("Content-type", "application/json");
    // enable CORS, credit https://stackoverflow.com/a/54309023/5920970
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
    res.setHeader("Access-Control-Max-Age", 2592000); // 30 days
    if (req.url.includes("/reviews")) {
      // e.g. `/reviews/12345`, extract the `12345` part
      const appId = req.url.split("/")[2];

      try {
        const reviews = readReviewsFromFile({ appId });
        res.end(
          JSON.stringify({
            data: reviews,
          })
        );
      } catch (error) {
        res.end(
          JSON.stringify({
            error: {
              status: 500,
              title: "Internal Server Error",
              message: error.message,
            },
          })
        );
      }
    } else {
      res.end(JSON.stringify({ error: { status: 404, message: "Not Found" } }));
    }
  })
  .listen(PORT, function () {
    console.log(`RSS Server Listening on Port ${PORT}`); //the server object listens on port 3000
    pollForReviews({
      appId: DEFAULT_APP_ID,
      pollingIntervalMs: POLLING_INTERVAL_MS,
    });
  });
