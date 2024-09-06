FROM node:22
# RUN npm install --python=python2.7
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./
RUN chmod 755 ./

USER node

RUN npm install --legacy-peer-deps

COPY --chown=node:node . .
RUN chmod 755 .

EXPOSE 7085

CMD [ "node", "index.js" ]