# Base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy backend files
COPY package*.json ./
COPY app.js ./

# Copy frontend files
COPY frontend/ ./frontend/

# Install root-level (backend) dependencies
RUN npm install

# Install frontend dependencies
WORKDIR /app/frontend
RUN npm install

# Back to root for starting
WORKDIR /app

# Install concurrently to run both servers
RUN npm install concurrently --save-dev

# Default command: run both servers in dev mode
CMD ["npx", "concurrently", "node app.js", "npm --prefix frontend run dev"]
