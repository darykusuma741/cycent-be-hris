# Gunakan node alpine
# FROM node:20-alpine
FROM node:22.13.1-alpine

# Buat working directory
WORKDIR /app

# Salin file dependency dulu
COPY package.json pnpm-lock.yaml ./

# Install pnpm dan dependency
RUN npm install -g pnpm
RUN pnpm install

# Salin seluruh source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build NestJS
RUN pnpm run build
RUN ls -la dist

# Expose port aplikasi
EXPOSE 3000

# Jalankan aplikasi
# CMD ["node", "dist/src/main.js"]
CMD npx prisma migrate deploy && node dist/src/main.js