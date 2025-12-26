# Allocat Frontend - Vue.js Application
# Multi-stage build for optimized production image

# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for better caching
COPY package*.json ./

# Install dependencies
# Install dependencies
RUN npm ci

# Accept build arguments for environment variables
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copy source code
COPY . .

# Build for production
RUN npm run build:prod

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

