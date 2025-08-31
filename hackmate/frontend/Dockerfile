# Frontend Dockerfile for HackMate React App
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Set environment to development for hot reload
ENV NODE_ENV=development

# Start the development server
CMD ["npm", "start"]