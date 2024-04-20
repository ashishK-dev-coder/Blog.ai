# # Use a slim Node.js base image for reduced size
# FROM node:18-alpine AS builder

# # Set working directory
# WORKDIR /app

# # Copy package.json and package-lock.json (or yarn.lock)
# COPY package*.json ./

# # Install dependencies during build stage (faster on subsequent builds)
# RUN npm install --production

# # Copy only the production-ready app code
# FROM node:18-alpine AS runner

# # Set working directory
# WORKDIR /app

# # Copy only the production-ready app from the builder stage
# COPY --from=builder . .

# # Expose the port your Node.js app listens on (replace 3000 with your actual port)
# EXPOSE 8881

# # Set environment credentials (replace with actual variable names and values)
# ENV PORT=8881
# ENV MONGODB_URI = "mongodb+srv://programmingpr12:ashishkumar12@social-media-ai.b8u7f2i.mongodb.net/Backend-API?retryWrites=true&w=majority"
# ENV CORS_ORIGIN = *
# ENV ACCESS_TOKEN_SECRET = d28533cf-d4b2-4919-a59a-97322652023f
# ENV ACCESS_TOKEN_EXPIRY = 1d
# ENV REFRESH_TOKEN_SECRET = ba9a5496-0804-40dc-bc94-748e30177859
# ENV REFRESH_TOKEN_EXPIRY = 10d

# # Start the Node.js application (replace "index.js" with your main entry point)
# # CMD [ "npm", "start", "index.js" ]
# CMD [ "npm", "run", "dev" ]

# FROM node:20

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY prisma ./prisma

# RUN npx prisma generate

# COPY . .

# EXPOSE 4000

# CMD ["node", "index.js"]

FROM node:18-alpine 

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8881

ENV PORT=8881
ENV MONGODB_URI=mongodb+srv://programmingpr12:ashishkumar12@social-media-ai.b8u7f2i.mongodb.net/Backend-API?retryWrites=true&w=majority
ENV CORS_ORIGIN=*
ENV ACCESS_TOKEN_SECRET=d28533cf-d4b2-4919-a59a-97322652023f
ENV ACCESS_TOKEN_EXPIRY=1d
ENV REFRESH_TOKEN_SECRET=ba9a5496-0804-40dc-bc94-748e30177859
ENV REFRESH_TOKEN_EXPIRY=10d
ENV REDIS_HOST=Redis
ENV REDIS_PORT=6379
ENV REDIS_PREFIX=master-backend
ENV REDIS_EXPIRE=60*60

CMD ["npm", "run", "start"]