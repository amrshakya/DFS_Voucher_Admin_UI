FROM --platform=linux/amd64 node:16.16.0

# Create app directory
RUN mkdir -p /admin-ui/project
WORKDIR /admin-ui/project

# Install app dependencies
COPY package*.json /admin-ui/project
RUN npm install

# Copy app source
COPY ./config /admin-ui/project/config
COPY ./public /admin-ui/project/public
COPY ./src /admin-ui/project/src
COPY ./src-pwa /admin-ui/project/src-pwa
COPY ./quasar.conf.js /admin-ui/project/quasar.conf.js
COPY ./server.js /admin-ui/project/server.js

EXPOSE 9990

CMD [ "node", "server.js" ]
