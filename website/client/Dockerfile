FROM node:lts-alpine

RUN apk add bash
RUN apk add git

RUN mkdir /game_portal_client
WORKDIR /game_portal_client

ADD src ./src
ADD public/ ./public
ADD package.json ./
ADD vue.config.js ./
ADD babel.config.js ./

RUN npm install

CMD ["npm", "run", "serve"]
