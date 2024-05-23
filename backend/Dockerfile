FROM node:16.14.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV PORT_SERVER 3000

CMD [ "node", "index.js"]