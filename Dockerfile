FROM --platform=linux/amd64 node:16.16.0

# Create app directory
RUN mkdir -p /admin-ui/project
WORKDIR /admin-ui/project

# Install app dependencies
COPY package*.json /admin-ui/project
RUN npm install

# Copy app source
COPY . /admin-ui/project/

RUN npm run build

EXPOSE 9990

CMD [ "node", "server.js" ]
