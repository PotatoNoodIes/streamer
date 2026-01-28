# ---------- Build stage ----------
FROM node:20-slim AS builder

# ✅ Set timezone
ENV TZ=America/Toronto

# ✅ Install timezone data
RUN apt-get update && apt-get install -y tzdata

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build


# ---------- Runtime stage ----------
FROM node:20-slim

# ✅ SAME timezone fix in runtime image
ENV TZ=America/Toronto

RUN apt-get update && apt-get install -y tzdata

WORKDIR /app

COPY --from=builder /app/.output ./.output

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
ENV NODE_ENV=production

CMD ["node", ".output/server/index.mjs"]
