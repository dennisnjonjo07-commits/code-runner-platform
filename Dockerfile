FROM node:18-alpine

WORKDIR /app

# Install system dependencies for code execution
RUN apk update && apk add --no-cache \
    python3 \
    python3-pip \
    openjdk11-jre \
    ruby \
    rust \
    cargo \
    bash \
    curl

# Copy package files
COPY package*.json ./

# Install Node dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create upload directory
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start application
CMD ["npm", "start"]
