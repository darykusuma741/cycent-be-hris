# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

# Copy source code
COPY . .

# Build NestJS
RUN pnpm run build

# Stage 2: Run
FROM node:20-alpine

WORKDIR /app

# Copy node_modules dan hasil build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY .env ./
COPY package.json ./

EXPOSE 3000

# Jalankan migrasi Prisma lalu start app
CMD ["sh", "-c", "npx prisma migrate deploy && node ./dist/src/main.js"]