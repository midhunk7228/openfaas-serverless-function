#!/usr/bin/env node
/**
 * Local development server for OpenFaaS function
 * Runs your function on http://localhost:3000 without needing OpenFaaS
 */

const http = require("http");
const handler = require("./hello-world/handler.js");

const PORT = process.env.PORT || 3000;

// Mock OpenFaaS context
function createContext(res) {
  return {
    statusCode: 200,
    headerValues: {},

    status: function (code) {
      this.statusCode = code;
      return this;
    },

    headers: function (headers) {
      this.headerValues = { ...this.headerValues, ...headers };
      return this;
    },

    succeed: function (result) {
      // Set response headers
      res.statusCode = this.statusCode;
      res.setHeader("Content-Type", result["content-type"] || "application/json");
      
      // Set any custom headers
      Object.keys(this.headerValues).forEach((key) => {
        res.setHeader(key, this.headerValues[key]);
      });

      // Send response
      res.end(JSON.stringify(result));
      return result;
    },

    fail: function (error) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: error.message || error }));
      return error;
    },
  };
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Parse request body
  let body = "";
  
  req.on("error", (error) => {
    console.error("Request error:", error);
    if (!res.headersSent) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Bad request" }));
    }
  });
  
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      // Parse body as JSON if present
      let parsedBody = {};
      if (body) {
        try {
          parsedBody = JSON.parse(body);
        } catch (e) {
          // If not JSON, use raw body
          parsedBody = { raw: body };
        }
      }

      // Parse query parameters
      const urlObj = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
      const query = {};
      urlObj.searchParams.forEach((value, key) => {
        query[key] = value;
      });

      // Create OpenFaaS-style event
      const event = {
        body: parsedBody,
        headers: req.headers,
        method: req.method,
        query: query,
        path: urlObj.pathname,
      };

      // Create context and invoke handler
      const context = createContext(res);
      
      console.log(`\n[${new Date().toISOString()}] ${req.method} ${urlObj.pathname}`);
      console.log("Request body:", JSON.stringify(parsedBody, null, 2));

      // Invoke the handler
      const result = await handler(event, context);
      console.log("Response sent:", result);

    } catch (error) {
      console.error("❌ Error:", error);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: error.message, stack: error.stack }));
      }
    }
  });
});

// Start server
server.listen(PORT, () => {
  console.log("🚀 OpenFaaS Function Server");
  console.log("=".repeat(50));
  console.log(`✅ Server running at: http://localhost:${PORT}`);
  console.log(`📝 Function: hello-world`);
  console.log("=".repeat(50));
  console.log("\n💡 Try it out:");
  console.log(`\n   curl -X POST http://localhost:${PORT} \\`);
  console.log(`     -H "Content-Type: application/json" \\`);
  console.log(`     -d '{"message": "Hello, World!"}'`);
  console.log("\n⏹  Press Ctrl+C to stop\n");
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n\n👋 Shutting down server...");
  server.close(() => {
    console.log("✅ Server stopped");
    process.exit(0);
  });
});

