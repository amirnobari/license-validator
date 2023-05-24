FROM node:18-alpine

LABEL maintainer="Mostafa Rostam Dokht Effati"

WORKDIR /opt
COPY package.json .

RUN corepack disable yarn

RUN npm i -g yarn

RUN yarn install

COPY . .

RUN yarn dev

