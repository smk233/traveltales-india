# --- Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source files
COPY . .

# Build Vite React production bundle
RUN npm run build

# --- Production Serve Stage ---
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
