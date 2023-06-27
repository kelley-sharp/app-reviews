const http = require("http");
const {
  collectReviewsFromLast48Hours,
  writeReviewsToFile,
  pollForReviews,
  readReviewsFromFile,
} = require("./helpers");

const { PORT, DEFAULT_APP_ID, POLLING_INTERVAL_MS } = require("./config");

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
