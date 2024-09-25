# Stage 1: Build the Angular app
FROM node:20-alpine AS build

WORKDIR /usr/src/app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps --ignore-scripts

# Copy the Angular project configuration and source files
COPY angular.json tsconfig.json ./
COPY src ./src

# Build the Angular app
RUN npm run build-dev -- --configuration=production

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Add a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy the build output to Nginx's html directory
COPY --from=build /usr/src/app/dist/bcfoi /usr/share/nginx/html

# Change ownership of the Nginx html directory
RUN chown -R appuser:appgroup /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Switch to the non-root user
USER appuser

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]