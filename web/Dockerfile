# Web/Dockerfile

# Stage 1: Build the Angular app
FROM node:22 as build

WORKDIR /usr/src/app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the application code
COPY . .

# Build the Angular app
RUN npm run build-dev -- --configuration=production

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the build output to Nginx's html directory
COPY --from=build /usr/src/app/dist/bcfoi /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
