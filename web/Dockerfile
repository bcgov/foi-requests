 FROM node:16.2.0-alpine as build-step
    RUN mkdir -p /app
    WORKDIR /app
    COPY package.json /app
    RUN npm install
    COPY . /app
    RUN npm run build --prod

# FROM nginx:1.20.1
#     COPY --from=build-step /app/dist/bcfoi /usr/share/nginx/html
#     EXPOSE 4200:80

# note: never use the :latest tag in a production site
FROM caddy:2

COPY ./Caddyfile /etc/caddy/Caddyfile
COPY ./dist/bcfoi /srv
COPY ./caddy_security.conf /etc/caddy/caddy_security.conf