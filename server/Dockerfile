FROM node:14-slim

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

COPY . .

COPY docker.env .env

EXPOSE 5000

CMD [ "index.js" ]