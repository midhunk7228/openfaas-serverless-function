# API Endpoint Guide

## OpenFaaS Endpoint Structure

When deployed, your function is accessible via:

```
http://<gateway-url>/function/<function-name>
```

### For Your Function

Based on your `stack.yaml` configuration:

**Function Name**: `hello-world`  
**Gateway**: `http://127.0.0.1:8080` (default local)

**Full Endpoint**:

```
http://127.0.0.1:8080/function/hello-world
```

## Making API Calls

### Using cURL

**POST Request** (recommended for this function):

```bash
curl -X POST http://127.0.0.1:8080/function/hello-world \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, World!", "user": "Alice"}'
```

**GET Request**:

```bash
curl http://127.0.0.1:8080/function/hello-world
```

**With Custom Headers**:

```bash
curl -X POST http://127.0.0.1:8080/function/hello-world \
  -H "Content-Type: application/json" \
  -H "X-Custom-Header: value" \
  -d '{"data": "test"}'
```

### Using JavaScript/Fetch

```javascript
// Browser or Node.js with fetch
const response = await fetch("http://127.0.0.1:8080/function/hello-world", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: "Hello from JavaScript!",
    timestamp: new Date().toISOString(),
  }),
});

const data = await response.json();
console.log(data);
```

### Using Python

```python
import requests
import json

url = 'http://127.0.0.1:8080/function/hello-world'
payload = {
    'message': 'Hello from Python!',
    'value': 42
}

response = requests.post(url, json=payload)
print(response.json())
```

### Using the OpenFaaS CLI

```bash
# Invoke with data
echo '{"message": "test"}' | faas-cli invoke hello-world

# Or interactively
faas-cli invoke hello-world
# Then type your JSON and press Ctrl+D
```

## Endpoint Variations

### Asynchronous Invocation

For long-running functions, use async endpoints:

```bash
curl -X POST http://127.0.0.1:8080/async-function/hello-world \
  -H "Content-Type: application/json" \
  -d '{"task": "process"}'
```

Returns immediately with a 202 Accepted status.

### With Query Parameters

```bash
curl "http://127.0.0.1:8080/function/hello-world?param1=value1&param2=value2" \
  -H "Content-Type: application/json" \
  -d '{"data": "test"}'
```

Access in your function via `event.query`.

## Production Endpoints

When deploying to production, your endpoint would be:

### Kubernetes/Cloud

```
https://your-domain.com/function/hello-world
```

### OpenFaaS Cloud

```
https://username.o6s.io/hello-world
```

### Custom Domain with Ingress

```
https://api.yourcompany.com/hello-world
```

## Customizing the Gateway URL

Edit `stack.yaml` to change the gateway:

```yaml
provider:
  name: openfaas
  gateway: http://your-custom-gateway:8080 # Change this
```

## Health Check Endpoints

OpenFaaS also provides these endpoints:

```bash
# Check if function is ready
curl http://127.0.0.1:8080/healthz

# List all functions
curl http://127.0.0.1:8080/system/functions

# Function info
curl http://127.0.0.1:8080/system/function/hello-world
```

## Testing Your Current Function

Your function expects:

- **Method**: Any (POST recommended)
- **Content-Type**: `application/json`
- **Body**: Any JSON object

**Example Request**:

```bash
curl -X POST http://127.0.0.1:8080/function/hello-world \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "action": "greet",
    "timestamp": "2025-10-23T15:00:00Z"
  }'
```

**Example Response**:

```json
{
  "body": "{\"name\":\"John\",\"action\":\"greet\",\"timestamp\":\"2025-10-23T15:00:00Z\"}",
  "content-type": "application/json"
}
```

## CORS Configuration

For browser-based apps, you may need to configure CORS. OpenFaaS handles this via annotations in `stack.yaml`:

```yaml
functions:
  hello-world:
    lang: node20
    handler: ./hello-world
    image: hello-world:latest
    annotations:
      cors-allow-origin: "*"
      cors-allow-methods: "GET,POST,PUT,DELETE,OPTIONS"
      cors-allow-headers: "Content-Type"
```

## Authentication

To secure your endpoints:

```bash
# Basic Auth
curl -X POST http://127.0.0.1:8080/function/hello-world \
  -u admin:password \
  -H "Content-Type: application/json" \
  -d '{"data": "secure"}'

# With API Key
curl -X POST http://127.0.0.1:8080/function/hello-world \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"data": "secure"}'
```
