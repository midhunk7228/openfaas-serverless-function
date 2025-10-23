'use strict'

module.exports = async (event, context) => {
  // This function works well with GET requests
  // It returns useful server and request information
  
  const requestInfo = {
    status: 'success',
    timestamp: new Date().toISOString(),
    method: event.method,
    path: event.path,
    message: 'OpenFaaS GET function is working!',
    server: {
      function: 'get-info',
      runtime: 'Node.js 20',
      platform: process.platform,
      nodeVersion: process.version,
      uptime: process.uptime()
    },
    request: {
      method: event.method,
      path: event.path || '/',
      query: event.query || {},
      headers: {
        contentType: event.headers["content-type"],
        userAgent: event.headers["user-agent"],
        host: event.headers["host"]
      }
    },
    examples: {
      withQuery: '?name=Alice&greeting=Hello',
      description: 'Add query parameters to see them in the response'
    }
  }

  // If query parameters exist, include a personalized message
  if (event.query && Object.keys(event.query).length > 0) {
    requestInfo.queryParams = event.query
    
    if (event.query.name) {
      requestInfo.personalMessage = `Hello, ${event.query.name}!`
    }
  }

  const result = {
    body: JSON.stringify(requestInfo, null, 2),
    'content-type': 'application/json'
  }

  return context
    .status(200)
    .succeed(result)
}
