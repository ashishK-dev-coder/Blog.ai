# # Use the official Node.js image as a base
# FROM node:lts-alpine AS builder

# # Set the working directory in the container
# WORKDIR /app

# # Copy package.json and package-lock.json files to the container
# COPY package.json package-lock.json ./

# # Install dependencies
# RUN npm install

# # Copy the entire project to the container
# COPY . .

# # Build the Next.js project
# RUN npm run build

# # Use Nginx as a lightweight web server to serve static files
# FROM nginx:alpine

# # Copy the built static files from the previous stage to the Nginx container
# COPY --from=builder /app/out /usr/share/nginx/html

# # Expose port 80
# EXPOSE 80

# # Start Nginx when the container starts
# CMD ["nginx", "-g", "daemon off;"]
# # CMD ["npm", "run", "start;"]

# Stage 1: Build the Next.js application (with cache invalidation)
# FROM node AS builder

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# # Invalidate cache on package.json or package-lock.json changes
# COPY package*.json .
# # RUN npm cache clean --force

# COPY . .
# RUN npm run build

# # Stage 2: Nginx server
# # FROM nginx:alpine

# # WORKDIR /var/www/html

# # COPY --from=builder /app/out .

# EXPOSE 3000

# # CMD ["nginx", "-g", "daemon off;"]
# CMD ["npm run dev"]

# FROM node

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .
# RUN npm run build

# EXPOSE 3000:3000

# CMD ["npm", "run", "dev"]  # Use instead of string array


# FROM node AS builder

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY package*.json .

# COPY . .
# RUN npm run build

# EXPOSE 3000

# CMD ["npm run dev"]

FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build && ls -l /app/.next


# If using npm comment out above and use below instead
# RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]