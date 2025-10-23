FROM node:20-alpine

# Create app user
RUN addgroup -S app && adduser -S -g app app

# Set up working directory
WORKDIR /home/app

# Copy package files
COPY --chown=app:app package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY --chown=app:app handler.js ./
COPY --chown=app:app index.js ./

# Copy static assets (images, clients, etc.)
COPY --chown=app:app images/ ./images/
COPY --chown=app:app clients/ ./clients/
COPY --chown=app:app assets/ ./assets/

# Switch to app user
USER app

# Set PORT environment variable
ENV PORT=8080

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8080', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the server
CMD ["node", "index.js"]

