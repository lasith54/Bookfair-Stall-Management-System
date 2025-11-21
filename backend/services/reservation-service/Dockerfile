# Development stage
FROM node:18-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Create shared directory for volume mount
RUN mkdir -p /app/shared

EXPOSE 3003

CMD ["npm", "run", "dev"]

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3003

CMD ["npm", "start"]
