# Stage 1: Cài đặt dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy các tệp định nghĩa thư viện để tận dụng cache của Docker
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Xây dựng ứng dụng (Build)
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NHẬN BIẾN MÔI TRƯỜNG LÚC BUILD (Rất quan trọng để kết nối API)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Stage 3: Chạy ứng dụng (Runtime)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Tạo user không có quyền root để bảo mật (tương tự phía BE của bạn)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy các file cần thiết cho môi trường Production
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Chuyển sang user không có quyền root
USER nextjs

EXPOSE 3000
ENV PORT 3000

# Chạy ứng dụng
CMD ["npm", "start"]