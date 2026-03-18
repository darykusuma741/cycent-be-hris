# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build NestJS
RUN pnpm run build

# Stage 2: production
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env .env  

EXPOSE 3000
CMD ["node", "dist/main.js"]