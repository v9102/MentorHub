# ================================
# Base
# ================================
FROM node:20-alpine AS base
WORKDIR /app

# ================================
# Dependencies
# ================================
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ================================
# Build (env needed here!)
# ================================
FROM base AS builder

# --- Build-time env vars (Clerk) ---
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY

ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
ENV CLERK_SECRET_KEY=${CLERK_SECRET_KEY}

# Copy deps + source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js
RUN npm run build

# ================================
# Production runner
# ================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only required runtime files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["npm", "start"]
