# Gunakan node alpine
FROM node:20-alpine

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

# Expose port aplikasi
EXPOSE 3000

# Jalankan aplikasi
CMD ["node", "dist/main.js"]