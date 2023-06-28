FROM node:16
WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm i
RUN npm i bcrypt
RUN npm i -g typeorm

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start" ]