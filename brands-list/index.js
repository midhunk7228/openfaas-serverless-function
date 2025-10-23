const http = require("http");
const handler = require("./handler.js");

const port = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      let parsedBody = {};
      if (body) {
        try {
          parsedBody = JSON.parse(body);
        } catch (e) {
          parsedBody = { raw: body };
        }
      }

      const url = new URL(req.url, `http://${req.headers.host}`);
      const query = {};
      url.searchParams.forEach((value, key) => {
        query[key] = value;
      });

      const event = {
        body: parsedBody,
        headers: req.headers,
        method: req.method,
        query: query,
        path: url.pathname,
      };

      const context = {
        statusCode: 200,
        status: function (code) {
          this.statusCode = code;
          return this;
        },
        succeed: function (result) {
          res.statusCode = this.statusCode;
          res.setHeader(
            "Content-Type",
            result["content-type"] || "application/json"
          );
          res.end(result.body);
          return result;
        },
      };

      await handler(event, context);
    } catch (error) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: error.message }));
    }
  });
});

server.listen(port, () => {
  console.log(`Brands List API listening on port ${port}`);
});
