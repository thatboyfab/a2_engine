FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY src/ ./src

EXPOSE 3000

CMD ["npm", "start"]
