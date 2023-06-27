FROM node:16
WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn
RUN yarn add bcrypt
RUN yarn global add typeorm

COPY . .

RUN yarn typeorm migration:run -d ./db/postgres

EXPOSE 3000

CMD [ "yarn", "start" ]