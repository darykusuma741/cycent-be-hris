# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build NestJS
RUN pnpm run build