# Development stage
FROM node:18-alpine AS development

# Install build dependencies for native modules (bcrypt, etc.)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files and lock file
COPY package*.json ./
COPY package-lock.json ./
COPY .npmrc* ./
COPY tsconfig*.json ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Start development server
CMD ["pnpm", "run", "start:dev"]

# Builder stage
FROM node:18-alpine AS builder

# Install build dependencies for native modules (bcrypt, etc.)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files and lock file
COPY package*.json ./
COPY package-lock.json ./
COPY .npmrc* ./
COPY tsconfig*.json ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install dumb-init and build dependencies for native modules
RUN apk add --no-cache dumb-init python3 make g++

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files and lock file
COPY package*.json ./
COPY package-lock.json ./
COPY .npmrc* ./

# Install production dependencies only (with build tools for native modules)
RUN npm ci --omit=dev

# Remove build dependencies after installation to reduce image size
RUN apk del python3 make g++

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Copy any additional files needed at runtime
COPY --chown=nodejs:nodejs ./public ./public

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').request({path: '/health', port: 3001}, (r) => {if (r.statusCode !== 200) process.exit(1); else process.exit(0);}).end();"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/main"]
