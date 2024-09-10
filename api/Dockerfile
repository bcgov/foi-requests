FROM node:20-alpine AS build
# RUN npm install --python=python2.7
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

# COPY package*.json ./
COPY --chown=node:node package*.json ./

USER node

RUN npm install --legacy-peer-deps

# COPY . .
COPY --chown=node:node . .

EXPOSE 7085

CMD [ "node", "index.js" ]