const http = require("http");
const { getRssFeedData } = require("./helpers");

const PORT = 3001;

// create a server with a /reviews/:appId endpoint
http
  .createServer(async function (req, res) {
    res.setHeader("Content-type", "application/json");
    if (req.url.includes("/reviews")) {
      // e.g. `/reviews/12345
      const appId = req.url.split("/")[1];

      try {
        const result = await getRssFeedData({ appId });
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
              message: "Internal Server Error",
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
