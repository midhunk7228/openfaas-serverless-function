const http = require("http");
const fs = require("fs");
const path = require("path");
const handler = require("./handler.js");

const port = process.env.PORT || 3000;

// MIME types for common file extensions
const MIME_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".css": "text/css",
  ".js": "text/javascript",
  ".html": "text/html",
};

// Function to serve static files
function serveStaticFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "File not found" }));
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache for 1 year
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept, Origin"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle OPTIONS for CORS
  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // Check if request is for a static file (images, assets, clients)
  if (
    pathname.startsWith("/images/") ||
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/clients/")
  ) {
    const filePath = path.join(__dirname, pathname);
    serveStaticFile(filePath, res);
    return;
  }

  // Handle API requests - only process /api/* routes
  if (!pathname.startsWith("/api/")) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Not Found",
        message: "API endpoints must start with /api/",
        availableEndpoints: [
          "/api/brands",
          "/api/brands?category=Technology",
          "/api/brands?search=nike",
        ],
      })
    );
    return;
  }

  // Remove /api prefix for handler processing
  const apiPath = pathname.replace("/api", "");
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

      const query = {};
      url.searchParams.forEach((value, key) => {
        query[key] = value;
      });

      const event = {
        body: parsedBody,
        headers: req.headers,
        method: req.method,
        query: query,
        path: apiPath, // Use apiPath instead of pathname
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
