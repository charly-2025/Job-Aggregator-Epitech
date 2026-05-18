FROM node:22
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE ${BACKEND_PORT}
CMD ["node", "index.js"]   