FROM node:14.18.1-alpine

#RUN apk --no-cache add --virtual builds-deps build-base python

WORKDIR /home/node/

COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN #yarn remove bcrypt && yarn add bcrypt
RUN npm run build; exit 0

CMD ["npm", "run", "start:prod"]

EXPOSE 3000
