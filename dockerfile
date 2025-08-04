# Stage 1: Build Vue app
FROM node:20 AS build-stage

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Enable and prepare pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies and build
COPY . .
RUN pnpm install -r
RUN pnpm run build

# Stage 2: Serve app with Nginx
FROM nginx:stable-alpine AS production-stage

# Copy the built files to Nginx container
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
