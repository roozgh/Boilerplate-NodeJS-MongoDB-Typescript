FROM node:12.16

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i --no-audit --progress=false

COPY . .

RUN npm run compile

EXPOSE 80

ENTRYPOINT npm start