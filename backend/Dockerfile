# --- Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install all dependencies (including devDependencies for TypeScript compiler)
RUN npm ci

# Copy backend source files
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# --- Production Runtime Stage ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy compiled JavaScript files from builder stage
COPY --from=builder /app/dist ./dist

# Create uploads directory
RUN mkdir -p public/uploads

EXPOSE 5000

CMD ["npm", "start"]
