const http = require("http");
const { getReviewsPageForAppId } = require("./helpers");

const PORT = 3001;

// create a server with a /reviews/:appId endpoint
http
  .createServer(async function (req, res) {
    res.setHeader("Content-type", "application/json");
    if (req.url.includes("/reviews")) {
      // e.g. `/reviews/12345`, extract the `12345` part
      const appId = req.url.split("/")[2];

      try {
        const result = await getReviewsPageForAppId({ appId });
        res.end(
          JSON.stringify({
            data: result,
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
