FROM node:22
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE ${FRONTEND_PORT}
CMD ["npm","start"] 