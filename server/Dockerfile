# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate
COPY tsconfig.json ./
COPY src ./src/
RUN npx tsc

# Production stage
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --omit=dev
RUN npx prisma generate
COPY --from=builder /app/dist ./dist/

EXPOSE 3000

# Entrypoint: run migrations, seed data, then start
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx prisma/seed.ts && node dist/app.js"]
