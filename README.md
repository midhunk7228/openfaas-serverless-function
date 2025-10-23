Test your function immediately without deployment:

```bash
node test-interactive.js
```

This runs your handler with mock data for quick testing.

### API Endpoint (When Deployed)

Once deployed to OpenFaaS, your function is available at:

```
http://127.0.0.1:8080/function/hello-world
```

**Example API Call**:

```bash
curl -X POST http://127.0.0.1:8080/function/hello-world \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!", "user": "Alice"}'
```

**Using faas-cli**:

```bash
echo '{"message": "Hello, OpenFaaS!"}' | faas-cli invoke hello-world
```

**Test endpoint connectivity**:

```bash
node example-api-call.js
```

📖 **Documentation**:

- [API_ENDPOINTS.md](./API_ENDPOINTS.md) - Complete endpoint documentation
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick command reference

## Available Commands

- `faas-cli build` - Build the function container image
- `faas-cli push` - Push the function to a container registry
- `faas-cli deploy` - Deploy the function to OpenFaaS
- `faas-cli invoke` - Invoke the deployed function
- `faas-cli remove` - Remove the function from OpenFaaS
- `faas-cli up` - Build, push, and deploy in one command

## Customizing the Function

Edit `hello-world/handler.js` to modify the function logic. You can also add npm dependencies by editing `hello-world/package.json`.

## Available Templates

This project includes the following OpenFaaS templates:

- dockerfile
- java11
- java11-vert-x
- java17
- node18
- node20
- node22
- php7
- php8

To create a new function with a different template:

```bash
faas-cli new my-function --lang <template-name>
```
