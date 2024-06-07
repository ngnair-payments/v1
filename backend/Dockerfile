# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install npm@10.8.1
RUN npm install -g npm@10.8.1 uuid -g @nestjs/jwt -g @nestjs/passport -g passport -g passport-jwt -g bcryptjs

# Install Nest CLI globally
RUN npm install -g @nestjs/cli

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

EXPOSE 3009

CMD ["npm", "run", "start:prod"]
