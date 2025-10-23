#!/usr/bin/env node
/**
 * Interactive test runner for OpenFaaS function
 * Allows you to test with different inputs easily
 */

const handler = require("./hello-world/handler.js");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Mock context
const context = {
  statusCode: 200,
  status: function (code) {
    this.statusCode = code;
    return this;
  },
  succeed: function (result) {
    console.log("\n✅ Response:");
    console.log(JSON.stringify(result, null, 2));
    return result;
  },
  fail: function (error) {
    console.error("\n❌ Error:", error);
    return error;
  },
};

async function testFunction(inputData) {
  try {
    const data = JSON.parse(inputData);

    const event = {
      body: data,
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    };

    console.log("\n📤 Sending:");
    console.log(JSON.stringify(data, null, 2));

    await handler(event, context);
  } catch (error) {
    console.error("\n❌ Invalid JSON or error:", error.message);
  }
}

console.log("🧪 Interactive OpenFaaS Function Tester");
console.log("=====================================\n");
console.log("Enter JSON data to test your function");
console.log('Type "exit" or press Ctrl+C to quit\n');
console.log('Example: {"message": "Hello!", "value": 42}\n');

function promptUser() {
  rl.question("> ", async (input) => {
    if (input.toLowerCase() === "exit" || input.toLowerCase() === "quit") {
      console.log("\n👋 Goodbye!");
      rl.close();
      return;
    }

    if (input.trim()) {
      await testFunction(input);
    }

    console.log(""); // blank line
    promptUser();
  });
}

promptUser();
