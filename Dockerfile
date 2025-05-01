# Use official Node.js image
FROM node:alpine

# Set working directory
WORKDIR /app

# Copy package.json and install http-server
COPY package.json ./
RUN npm install

# Copy your app files
COPY . .

# Expose the port
EXPOSE 8080

# Start the app
CMD ["npx", "http-server", "-p", "8080"]
