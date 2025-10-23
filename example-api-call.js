#!/usr/bin/env node
/**
 * Example API calls to the OpenFaaS function
 * Shows different ways to call your deployed function
 */

// Check if function is deployed (requires OpenFaaS running)
const GATEWAY_URL = "http://127.0.0.1:8080";
const FUNCTION_NAME = "hello-world";
const ENDPOINT = `${GATEWAY_URL}/function/${FUNCTION_NAME}`;

console.log("📡 OpenFaaS API Endpoint Examples\n");
console.log("=".repeat(50));
console.log(`Gateway: ${GATEWAY_URL}`);
console.log(`Function: ${FUNCTION_NAME}`);
console.log(`Endpoint: ${ENDPOINT}`);
console.log("=".repeat(50));
console.log();

// Example 1: Using Node.js built-in http
console.log("Example 1: Using Node.js http module");
console.log("-".repeat(50));

const http = require("http");

const data = JSON.stringify({
  message: "Hello from Node.js!",
  timestamp: new Date().toISOString(),
  example: 1,
});

const options = {
  hostname: "127.0.0.1",
  port: 8080,
  path: "/function/hello-world",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length,
  },
};

console.log("\nRequest:");
console.log(`POST ${ENDPOINT}`);
console.log("Body:", data);

const req = http.request(options, (res) => {
  let responseData = "";

  res.on("data", (chunk) => {
    responseData += chunk;
  });

  res.on("end", () => {
    console.log("\nResponse:");
    console.log(`Status: ${res.statusCode}`);
    console.log("Body:", responseData);
    console.log("\n");
    showCurlExamples();
  });
});

req.on("error", (error) => {
  console.error("\n❌ Error:", error.message);
  console.log(
    "\n⚠️  Make sure OpenFaaS is running and the function is deployed!"
  );
  console.log("\nTo deploy:");
  console.log("  1. Start Docker Desktop");
  console.log("  2. Deploy OpenFaaS (see API_ENDPOINTS.md)");
  console.log("  3. Run: faas-cli build -f stack.yaml");
  console.log("  4. Run: faas-cli deploy -f stack.yaml");
  console.log("\nFor local testing without deployment:");
  console.log("  node test-interactive.js");
  console.log("\n");
});

req.write(data);
req.end();

function showCurlExamples() {
  console.log("Example 2: Using cURL");
  console.log("-".repeat(50));
  console.log("\n# Simple POST request:");
  console.log(`curl -X POST ${ENDPOINT} \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{"message": "Hello!", "value": 42}'`);

  console.log("\n\n# With pretty-printed response:");
  console.log(`curl -X POST ${ENDPOINT} \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{"user": "Alice", "action": "test"}' | jq`);

  console.log("\n\n# Asynchronous invocation:");
  console.log(`curl -X POST ${GATEWAY_URL}/async-function/${FUNCTION_NAME} \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{"task": "long-running"}'`);

  console.log("\n\n" + "=".repeat(50));
  console.log("📖 See API_ENDPOINTS.md for more examples");
  console.log("=".repeat(50) + "\n");
}
