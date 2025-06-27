# Vite+React Dockerfile
# Multi-stage: build with Vite, serve with Node.js glue server

# Build stage
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps && npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.js ./server.js
RUN npm install express
EXPOSE 3011
CMD ["node", "server.js"]
