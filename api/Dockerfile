 # Use the official Node.js image from the Docker Hub
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install the application dependencies
RUN npm install --legacy-peer-deps --ignore-scripts

# Copy the rest of the application code to the working directory
COPY *.js *.sh *.env ./

RUN chgrp -R 0 /app && chmod -R g+rwX /app

RUN chmod +x ./container-entrypoint.sh

USER node

ENTRYPOINT ["./container-entrypoint.sh"]