# Real-Time Collaborative Code Interview Platform
# Production Multi-Language Container

FROM node:20-bullseye-slim

# Install system dependencies & runtimes for code execution
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    g++ \
    gcc \
    openjdk-17-jre-headless \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Node dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application source code
COPY . .

# Set execution environment defaults
ENV NODE_ENV=production \
    PORT=8080 \
    HOST=0.0.0.0 \
    EXECUTION_ENGINE=local \
    EXECUTION_TIMEOUT_MS=6000

EXPOSE 8080

CMD ["node", "server/index.js"]
