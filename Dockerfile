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

# Build the Docker image
# docker build -t weather-4caster .


# To push the image to Docker Hub, first login to your Docker Hub account
# docker login
# docker login -u <your-docker-hub-username> -p <your-docker-hub-password>
#docker login -u mokhtarlahjaily

# Tag the image with your Docker Hub username and repository name
#docker tag weather-4caster mokhtarlahjaily/weather-4caster:latest

# Push the image to Docker Hub
#docker push mokhtarlahjaily/weather-4caster:latest

# Run the Docker container
# docker run -d -p 8080:8080 weather-4caster

#Check contents of Dockerfile
#Get-Content Dockerfile