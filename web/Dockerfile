
#############################################
#                Base Build                 #
#############################################

# Stage 1: Build the Angular app
FROM node:20-alpine AS build

WORKDIR /usr/src/app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps --ignore-scripts \
  && npm rebuild

# Copy the Angular project configuration and source files
COPY angular.json tsconfig.json ./
COPY src ./src

# Build the Angular app
RUN npm run build-dev -- --configuration=production

#############################################
#                NGINX Build                #
#############################################
## Stage 2: Nginx state for serving content

FROM nginx:1.29-alpine

# copy custom nginx configuration from host to container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

# Copy the build output to Nginx's html directory
COPY --from=build /usr/src/app/dist/bcfoi .

# Provide nginx directory the required permissions
RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx

# Switch to the non-root user
USER appuser

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]