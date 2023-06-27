const http = require("http");
const {
  collectReviewsFromLast48Hours,
  writeReviewsToFile,
} = require("./helpers");

const PORT = 3001;

// create a server with a /reviews/:appId endpoint
http
  .createServer(async function (req, res) {
    res.setHeader("Content-type", "application/json");
    if (req.url.includes("/reviews")) {
      // e.g. `/reviews/12345`, extract the `12345` part
      const appId = req.url.split("/")[2];

      try {
        const reviews = await collectReviewsFromLast48Hours({ appId });
        writeReviewsToFile({ reviews, appId });
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
  });
