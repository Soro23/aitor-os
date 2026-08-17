# syntax=docker/dockerfile:1

FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Next.js sustituye las NEXT_PUBLIC_* por su valor literal dentro del bundle
# de cliente durante el build, no en runtime — sin estos ARG el navegador
# recibiria undefined. Solo variables publicas: los ARG quedan visibles en el
# historial de capas de la imagen, asi que SUPABASE_SERVICE_ROLE_KEY y demas
# secretos se inyectan unicamente en runtime.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Imagen final minima: sin node_modules completo ni fuente TS, solo el
# output standalone que Next.js genera gracias a output: 'standalone' en
# next.config.ts.
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# Sin migraciones ni scripts adicionales aqui — supabase migration up se
# ejecuta antes de este contenedor, nunca en su arranque (ver skill
# migration-deployment-guardian).
CMD ["node", "server.js"]
