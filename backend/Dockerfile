FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm config set registry https://registry.npmjs.org/
RUN npm install

COPY . .

RUN touch .env

EXPOSE 3000

CMD ["npm", "start"] 