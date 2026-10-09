# Real-Time Collaborative Code Interview Platform
# Production Multi-Language Container (Debian 12 Bookworm)

FROM node:20-bookworm-slim

# Install system dependencies & runtimes for code execution (Python 3, G++, GCC)
RUN apt-get update --fix-missing && apt-get install -y --no-install-recommends \
    python3 \
    g++ \
    gcc \
    curl \
    ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Node dependencies
COPY package*.json ./
RUN npm install --omit=dev

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
