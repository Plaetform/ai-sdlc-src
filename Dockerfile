# syntax=docker/dockerfile:1.7
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --fund=false

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Browser App Insights connection string. NEXT_PUBLIC_* is inlined into the
# client bundle at build time, so it must be present during `next build`.
# Supplied by the deploy workflow from the repo secret the kiosk pushes; empty
# (telemetry off) when the "app-insights" component is opted out.
ARG NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING=""
ENV NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING=$NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING
RUN mkdir -p public && npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
