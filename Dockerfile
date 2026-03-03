# Use official Bun image
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy package.json only (skip bun.lockb if missing)
COPY package.json ./

# Install dependencies
RUN bun install

# Copy the rest of the project
COPY . .

# Expose Nuxt dev port
EXPOSE 3000

# Run Nuxt dev
CMD ["bun", "run", "dev"]