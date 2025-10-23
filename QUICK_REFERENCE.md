# Quick Reference

## Your Function Details

| Property          | Value                                        |
| ----------------- | -------------------------------------------- |
| **Function Name** | `hello-world`                                |
| **Language**      | Node.js 20                                   |
| **Gateway**       | `http://127.0.0.1:8080`                      |
| **Endpoint**      | `http://127.0.0.1:8080/function/hello-world` |
| **Handler**       | `./hello-world/handler.js`                   |

## API Endpoint Structure

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  http://127.0.0.1:8080/function/hello-world            │
│  └────┬──────┘ └──┬──┘ └────┬────┘ └─────┬──────┘      │
│       │           │         │            │              │
│    Protocol     Host:Port  Path      Function Name     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Request Flow

```
Client Application
       │
       │  POST /function/hello-world
       │  Content-Type: application/json
       │  Body: {"message": "test"}
       │
       ▼
┌──────────────┐
│   Gateway    │  http://127.0.0.1:8080
│  (OpenFaaS)  │
└──────┬───────┘
       │
       │  Routes to function
       │
       ▼
┌──────────────┐
│ hello-world  │  Your Node.js function
│   Function   │  (running in container)
└──────┬───────┘
       │
       │  Returns response
       │
       ▼
┌──────────────┐
│   Response   │  {"body": "...", "content-type": "..."}
└──────────────┘
```

## Quick Commands

### Local Testing (No Deployment)

```bash
# Interactive testing
node test-interactive.js

# Test API endpoint call (requires deployment)
node example-api-call.js
```

### Build & Deploy

```bash
# Build the container
faas-cli build -f stack.yaml

# Deploy to OpenFaaS
faas-cli deploy -f stack.yaml

# Or do both at once
faas-cli up -f stack.yaml
```

### Call the API

```bash
# Using curl
curl -X POST http://127.0.0.1:8080/function/hello-world \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# Using faas-cli
echo '{"test": "data"}' | faas-cli invoke hello-world

# Async call
curl -X POST http://127.0.0.1:8080/async-function/hello-world \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### Monitor & Debug

```bash
# List functions
faas-cli list

# Get function logs
faas-cli logs hello-world

# Get function info
faas-cli describe hello-world

# Check OpenFaaS health
curl http://127.0.0.1:8080/healthz
```

## Example Payloads

### Simple Message

```json
{
  "message": "Hello, World!"
}
```

### With Multiple Fields

```json
{
  "user": "Alice",
  "action": "process",
  "data": [1, 2, 3],
  "timestamp": "2025-10-23T15:00:00Z"
}
```

### Nested Object

```json
{
  "request": {
    "type": "query",
    "params": {
      "id": 123,
      "filter": "active"
    }
  }
}
```

## Response Format

Your function currently returns:

```json
{
  "body": "{...stringified input...}",
  "content-type": "application/json"
}
```

## Common Issues

### Connection Refused

- ❌ OpenFaaS not running
- ✅ Start Docker and deploy OpenFaaS

### Function Not Found

- ❌ Function not deployed
- ✅ Run `faas-cli deploy -f stack.yaml`

### Port Already in Use

- ❌ Port 8080 taken
- ✅ Change gateway port in `stack.yaml`

## File Structure

```
openfaas/
├── hello-world/              # Your function code
│   ├── handler.js           # Main handler
│   └── package.json         # Dependencies
├── stack.yaml               # OpenFaaS config
├── test-interactive.js      # Local testing
├── example-api-call.js      # API call examples
├── API_ENDPOINTS.md         # Full endpoint docs
├── QUICK_REFERENCE.md       # This file
└── README.md                # Main documentation
```
