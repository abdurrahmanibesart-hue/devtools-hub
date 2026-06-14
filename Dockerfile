FROM node:20-alpine AS backend-builder
WORKDIR /app
COPY .npmrc package*.json ./
RUN npm ci
COPY nest-cli.json tsconfig*.json ./
COPY src/ ./src/
RUN npm run build:backend

FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/.npmrc frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY .npmrc package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=backend-builder /app/dist ./dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "dist/main.js"]
