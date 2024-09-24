 # Use the official Node.js image from the Docker Hub
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY *.js *.sh *.env ./

# Expose the port the app runs on
EXPOSE 7085

RUN chmod +x ./container-entrypoint.sh

ENTRYPOINT ["./container-entrypoint.sh"]