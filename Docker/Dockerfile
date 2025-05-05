# Stage 1: Builder
FROM node:18-slim AS builder

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies with frozen lockfile
RUN yarn install --frozen-lockfile

# Build the application
RUN yarn run build

FROM node:18-slim

WORKDIR /app
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/* 
RUN mkdir -p /app && chown node:node /app

COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/.env* ./.env
COPY --from=builder --chown=node:node /app/*.* ./
COPY --from=builder --chown=node:node /app/src/migrations ./src/migrations/


USER node


EXPOSE 3000
CMD /bin/sh -c "yarn run deploy:prod || exit 1"
