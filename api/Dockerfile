FROM node:20-alpine AS build
# RUN npm install --python=python2.7
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./


USER root
# Install npm-force-resolutions globally
# Run npm-force-resolutions before installing dependencies
RUN npm install -g npm-force-resolutions 

USER node

RUN npx npm-force-resolutions && \
    npm install --legacy-peer-deps

COPY . .

EXPOSE 7085

RUN chmod +x ./docker_entrypoint.sh

ENTRYPOINT ["./docker_entrypoint.sh"]
CMD ["node", "index.js"]