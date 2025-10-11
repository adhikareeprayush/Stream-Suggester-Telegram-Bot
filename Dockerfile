FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies (use package-lock if present)
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Ensure dotenv can read .env at runtime (do NOT copy .env into image)

# Use a non-root user for better security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

CMD ["node", "bot.js"]
