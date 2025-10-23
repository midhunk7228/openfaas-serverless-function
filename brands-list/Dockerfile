FROM node:20-alpine

# Install OpenFaaS watchdog
ADD https://github.com/openfaas/of-watchdog/releases/download/0.10.11/fwatchdog /usr/bin/fwatchdog
RUN chmod +x /usr/bin/fwatchdog

# Install dependencies
RUN apk --no-cache add curl ca-certificates

# Create app user
RUN addgroup -S app && adduser -S -g app app

# Set up working directory
WORKDIR /home/app

# Copy and install dependencies
COPY --chown=app:app package*.json ./
RUN npm install --production

# Copy function code
COPY --chown=app:app handler.js ./function/

# Switch to app user
USER app

# Configure watchdog
ENV fprocess="node /home/app/function/handler.js"
ENV mode="http"
ENV upstream_url="http://127.0.0.1:3000"
ENV PORT=8080

# Health check
HEALTHCHECK --interval=5s CMD [ -e /tmp/.lock ] || exit 1

EXPOSE 8080

CMD ["fwatchdog"]

