FROM node:18-alpine

WORKDIR /app

COPY server/package*.json ./
RUN npm install

COPY server/ .

COPY client/dist ./dist

EXPOSE 9090

CMD ["node", "server.js"]